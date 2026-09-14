import nodemailer from 'nodemailer';

export async function sendScholarshipConfirmationEmail(to: string, name: string, mobile: string, regNo: string) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || 465);

  if (!host || !user || !pass) {
    console.log(`[EMAIL CONFIRMATION - FALLBACK] Email: ${to} RegNo: ${regNo} (SMTP credentials missing)`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const mailOptions = {
      from: `"JobAdda.in" <${user}>`,
      to,
      subject: 'Scholarship Confirmation Mail from JobAdda.in',
      html: `
<!DOCTYPE html>
<html lang="en">
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="max-width: 600px; margin: 40px auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b; box-shadow: 0 4px 12px rgba(0,0,0,0.03); overflow: hidden;">
    
    <!-- Logo / Header (Matches website dark theme navbar) -->
    <div style="background-color: #0a0f1e; padding: 30px 20px; text-align: center; border-bottom: 2px solid #1e293b;">
      <h1 style="color: #ffffff; margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.03em;">
        JobAdda<span style="color: #818cf8; font-weight: 700;">.in</span>
      </h1>
      <p style="margin: 6px 0 0 0; font-size: 11px; color: #64748b; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;">
        Scholarship Test 2026
      </p>
    </div>

    <div style="padding: 30px;">
      <!-- Celebration Badge -->
      <div style="text-align: center; margin-bottom: 25px;">
        <span style="display: inline-block; background-color: #dcfce7; color: #166534; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em;">
          Registration Confirmed
        </span>
      </div>
      
      <!-- Greeting -->
      <p style="font-size: 16px; line-height: 1.6; margin-top: 0; color: #1e293b;">
        Dear <strong>${name}</strong>,
      </p>
      
      <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 20px;">
        We are pleased to inform you that your registration for the <strong>JobAdda.in Scholarship Test</strong> is now officially confirmed.
      </p>
      
      <!-- Candidate Details Card -->
      <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-left: 4px solid #22c55e; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <h3 style="margin: 0 0 12px 0; color: #1e3a8a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700;">
          Registration Receipt Details
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr>
            <td style="padding: 4px 0; color: #64748b; width: 140px;"><strong>Registration ID:</strong></td>
            <td style="padding: 4px 0; color: #1e293b;"><span style="font-family: monospace; font-size: 15px; font-weight: 800; color: #166534; background-color: #dcfce7; padding: 2px 6px; border-radius: 4px;">${regNo}</span></td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>Candidate Name:</strong></td>
            <td style="padding: 4px 0; color: #1e293b; font-weight: 600;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>Contact Number:</strong></td>
            <td style="padding: 4px 0; color: #1e293b;">${mobile}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>Email Address:</strong></td>
            <td style="padding: 4px 0; color: #1e293b;">${to}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>Payment Status:</strong></td>
            <td style="padding: 4px 0; color: #166534; font-weight: bold;">PAID ✅</td>
          </tr>
        </table>
      </div>
      
      <!-- Exam Information Notice Box -->
      <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h4 style="margin: 0 0 8px 0; color: #b45309; font-size: 15px; font-weight: 700;">
          Important Exam Schedule & Details
        </h4>
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #78350f; line-height: 1.6;">
          The JobAdda.in <strong>Diwali Special Scholarship Exam 2026</strong> is scheduled for <strong>06th November 2026 (10:00 AM – 10:00 PM IST)</strong>. Registrations remain open until <strong>04th November 2026 (11:59 PM IST)</strong>.
        </p>
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #78350f; line-height: 1.6;">
          You will receive a notification containing your exam slot and details approximately <strong>1 week before</strong> the exam date.
        </p>
        <p style="margin: 0; font-size: 14px; color: #78350f; line-height: 1.6;">
          Alternatively, you can visit the main <a href="https://jobadda.in/scholarship" target="_blank" style="color: #b45309; font-weight: 700; text-decoration: underline;">Scholarship Page</a>, where the exam access link will be posted once active.
        </p>
      </div>
      
      <!-- Support Contact -->
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-top: 25px;">
        If you have any queries or did not recognize this registration, please reply to this email or contact our support team at 
        <a href="mailto:support@jobadda.in" style="color: #2563eb; text-decoration: underline; font-weight: 700;">support@jobadda.in</a>.
      </p>
      
      <!-- Footer Disclaimer -->
      <div style="text-align: center; margin-top: 35px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8; line-height: 1.4;">
        This is an automated confirmation email sent by JobAdda.in.<br>
        Please do not reply directly to this email address.
      </div>
    </div>

  </div>
</body>
</html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL CONFIRMATION - SENT] Sent success email to: ${to}`);

    // Update database to mark email as sent
    try {
      const db = (await import('@/lib/prisma')).default as any;
      await db.scholarshipEntry.update({
        where: { registrationNo: regNo },
        data: { emailSent: true },
      });
      console.log(`[EMAIL CONFIRMATION - DB UPDATED] Marked emailSent=true for ${regNo}`);
    } catch (dbErr) {
      console.error(`[EMAIL CONFIRMATION - DB ERROR] Failed to update emailSent for ${regNo}:`, dbErr);
    }
  } catch (error) {
    console.error(`[EMAIL CONFIRMATION - ERROR] Failed to send email to ${to}:`, error);
  }
}
