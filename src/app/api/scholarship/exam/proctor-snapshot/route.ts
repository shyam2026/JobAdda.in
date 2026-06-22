import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { registrationNo, type, event, image } = body;

    if (!registrationNo) {
      return NextResponse.json({ error: "Missing registrationNo" }, { status: 400 });
    }

    const isLocal = process.env.NODE_ENV === 'development';

    if (isLocal && registrationNo === 'JA-DEBUG') {
      if (type === 'event' && event) {
        const violationTypes = ['TAB_SWITCH', 'FULLSCREEN_EXIT', 'COPY_ATTEMPT', 'PASTE_ATTEMPT', 'DEVTOOLS_ATTEMPT', 'RIGHT_CLICK'];
        const isViolation = violationTypes.includes(event.type);
        return NextResponse.json({ success: true, totalViolations: isViolation ? 1 : 0 });
      }
      if (type === 'snapshot' && image) {
        return NextResponse.json({ success: true, snapshotCount: 1 });
      }
      return NextResponse.json({ success: true });
    }

    const candidate = await (prisma as any).scholarshipEntry.findUnique({
      where: { registrationNo },
      select: {
        id: true,
        proctorViolations: true,
        proctorSnapshots: true,
        proctorLog: true,
      },
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    // ── Handle Event Logging ──
    if (type === 'event' && event) {
      const existingLog: any[] = (() => {
        try { return JSON.parse(candidate.proctorLog || '[]'); } catch { return []; }
      })();

      existingLog.push(event);

      // Increment violation count for violation-type events
      const violationTypes = ['TAB_SWITCH', 'FULLSCREEN_EXIT', 'COPY_ATTEMPT', 'PASTE_ATTEMPT', 'DEVTOOLS_ATTEMPT', 'RIGHT_CLICK'];
      const isViolation = violationTypes.includes(event.type);

      await (prisma as any).scholarshipEntry.update({
        where: { registrationNo },
        data: {
          proctorLog: JSON.stringify(existingLog),
          ...(isViolation ? { proctorViolations: { increment: 1 } } : {}),
        },
      });

      return NextResponse.json({ success: true, totalViolations: candidate.proctorViolations + (isViolation ? 1 : 0) });
    }

    // ── Handle Snapshot Upload ──
    if (type === 'snapshot' && image) {
      const existingSnapshots: any[] = (() => {
        try { return JSON.parse(candidate.proctorSnapshots || '[]'); } catch { return []; }
      })();

      // Store snapshot metadata (timestamp + truncated base64 preview)
      // We store the full base64 for admin review
      existingSnapshots.push({
        timestamp: new Date().toISOString(),
        image,  // full base64
      });

      // Keep only the last 20 snapshots to avoid DB bloat
      const trimmed = existingSnapshots.slice(-20);

      await (prisma as any).scholarshipEntry.update({
        where: { registrationNo },
        data: {
          proctorSnapshots: JSON.stringify(trimmed),
        },
      });

      // Also log this as a proctor event
      const existingLog: any[] = (() => {
        try { return JSON.parse(candidate.proctorLog || '[]'); } catch { return []; }
      })();

      existingLog.push({
        type: 'SNAPSHOT_CAPTURED',
        timestamp: new Date().toISOString(),
        details: `Snapshot #${trimmed.length} captured`,
      });

      await (prisma as any).scholarshipEntry.update({
        where: { registrationNo },
        data: {
          proctorLog: JSON.stringify(existingLog),
        },
      });

      return NextResponse.json({ success: true, snapshotCount: trimmed.length });
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 });

  } catch (error: any) {
    console.error("PROCTOR_SNAPSHOT_ERROR", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
