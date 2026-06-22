import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

function logDebug(message: string, data: any = {}) {
  try {
    const logPath = path.join(process.cwd(), 'cash-payment-debug.' + 'log');
    const logLine = `[${new Date().toISOString()}] ${message} : ${JSON.stringify(data)}\n`;
    fs.appendFileSync(logPath, logLine);
  } catch (e) {
    console.error("Failed to write to debug log file", e);
  }
}


export async function POST(req: Request) {
  try {
    const session = await auth();
    let user = session?.user as any;

    logDebug("Incoming cash payment request", { user });

    // 1. Verify authenticated admin/subadmin session
    if (!user || user.portalType !== 'admin') {
      logDebug("Unauthorized portalType", { user });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['ADMIN', 'SUBADMIN', 'SUPERADMIN'].includes(user.role)) {
      logDebug("Unauthorized role", { role: user.role });
      return NextResponse.json({ error: 'Unauthorized role' }, { status: 403 });
    }

    // 2. Verify module permission for subadmins
    const db = prisma as any;
    const adminRecord = await db.adminUser.findUnique({
      where: { email: user.email }
    });

    if (!adminRecord) {
      logDebug("Admin record not found in DB", { email: user.email });
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    const isSuper = adminRecord.role === 'SUPERADMIN';

    if (!isSuper) {
      let allowedModules: string[] = [];
      try {
        allowedModules = adminRecord.modules ? JSON.parse(adminRecord.modules) : [];
      } catch { allowedModules = []; }

      logDebug("Checking subadmin modules permission", { email: user.email, allowedModules });
      if (!allowedModules.includes('all') && !allowedModules.includes('cash-collection')) {
        logDebug("Subadmin lacks cash-collection module", { email: user.email, allowedModules });
        return NextResponse.json({ error: 'You do not have permission for cash collection' }, { status: 403 });
      }
    }

    // 3. Parse and validate request body
    const body = await req.json();
    logDebug("Request body parsed", { body });
    const { registrationNo, passcode, couponCode, amount } = body;

    if (!registrationNo || !passcode) {
      logDebug("Missing registrationNo or passcode", { registrationNo, hasPasscode: !!passcode });
      return NextResponse.json({ error: 'Registration number and passcode are required' }, { status: 400 });
    }

    const cleanPasscode = (raw: string): string => {
      return raw
        .replace(/^["']|["']$/g, '') // Strip surrounding quotes
        .replace(/\\/g, '')          // Strip backslash escapes (e.g. Hostinger escaping #)
        .trim();                     // Trim leading/trailing whitespace
    };

    // 4. Verify passcode (checks: Env -> cash-passcode.txt file -> Hardcoded Fallback)
    let validPasscode = '';
    let source = 'fallback';

    // Attempt 1: From process.env
    if (process.env.SCHOLARSHIP_ADMIN_CASH_PASSCODE) {
      const rawEnv = process.env.SCHOLARSHIP_ADMIN_CASH_PASSCODE;
      validPasscode = cleanPasscode(rawEnv);
      if (validPasscode) source = 'env';
    }

    // Attempt 2: From cash-passcode.txt file in root
    if (!validPasscode) {
      try {
        const filePath = path.join(process.cwd(), 'cash-passcode.txt');
        if (fs.existsSync(filePath)) {
          const rawFile = fs.readFileSync(filePath, 'utf8');
          validPasscode = cleanPasscode(rawFile);
          if (validPasscode) source = 'file';
        }
      } catch (err) {
        console.error("Failed to read cash-passcode.txt", err);
      }
    }

    // Attempt 3: Hardcoded fallback
    if (!validPasscode) {
      validPasscode = 'JA#8Xp2qL9vR';
      source = 'fallback_JA';
    }

    const enteredPasscode = cleanPasscode(passcode);
    logDebug("Comparing passcode", { entered: enteredPasscode, configured: validPasscode, source });

    if (enteredPasscode !== validPasscode) {
      logDebug("Passcode mismatch", { entered: enteredPasscode, configured: validPasscode, source });
      return NextResponse.json({ 
        error: `Invalid admin passcode (Source: ${source}, Entered length: ${enteredPasscode.length}, Configured length: ${validPasscode.length})` 
      }, { status: 403 });
    }

    // 5. Find scholarship entry
    const entry = await db.scholarshipEntry.findUnique({
      where: { registrationNo }
    });

    if (!entry) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    if (entry.paymentStatus === 'PAID') {
      return NextResponse.json({ error: 'This registration is already paid' }, { status: 409 });
    }

    // 6. Consume coupon if used
    if (couponCode) {
      await db.coupon.updateMany({
        where: { code: couponCode.trim().toUpperCase() },
        data: { usedCount: { increment: 1 } }
      });
    }

    // 7. Update the scholarship entry as PAID via cash
    const timestamp = Date.now();
    const collectorName = isSuper ? 'Admin' : (adminRecord.name || adminRecord.email);

    const updatedEntry = await db.scholarshipEntry.update({
      where: { registrationNo },
      data: {
        paymentStatus: 'PAID',
        paymentId: `CASH_${timestamp}`,
        orderId: `CASH_${timestamp}`,
        amount: amount || 0,
        couponCode: couponCode || null,
        cashCollectedBy: collectorName,
        cashCollectedById: adminRecord.id,
      },
    });

    // Send confirmation email in the background
    const { sendScholarshipConfirmationEmail } = await import('@/lib/scholarship-mail');
    sendScholarshipConfirmationEmail(updatedEntry.email, updatedEntry.name, updatedEntry.mobile, updatedEntry.registrationNo).catch(err => {
      console.error('Failed to send scholarship confirmation email:', err);
    });

    return NextResponse.json({
      success: true,
      message: `Cash payment recorded by ${collectorName}`,
    });
  } catch (e: any) {
    console.error('SCHOLARSHIP_CASH_PAYMENT_ERROR', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
