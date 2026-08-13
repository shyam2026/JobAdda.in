// Scholarship Exam Schedule Constants
// Registration Cutoff: 14th August 2026, 10:00 PM IST
// Exam Date: 15th August 2026 (6:00 AM IST to 11:59 PM IST)
// Result Date: 20th August 2026 onwards

export const REGISTRATION_CUTOFF = new Date('2026-08-14T22:00:00+05:30').getTime();
export const EXAM_START_TIME = new Date('2026-08-15T06:00:00+05:30').getTime();
export const EXAM_END_TIME = new Date('2026-08-15T23:59:59+05:30').getTime();
export const RESULT_PUBLISH_TIME = new Date('2026-08-20T00:00:00+05:30').getTime();

export function getExamStatus() {
  const now = Date.now();
  if (now < EXAM_START_TIME) {
    return 'BEFORE';
  } else if (now > EXAM_END_TIME) {
    return 'AFTER';
  }
  return 'ACTIVE';
}

export type ScholarshipPhase = 'REGISTRATION_OPEN' | 'REGISTRATION_CLOSED' | 'EXAM_LIVE' | 'RESULT_WAITING' | 'RESULT_LIVE';

export function getScholarshipPhase(): ScholarshipPhase {
  const now = Date.now();
  if (now < REGISTRATION_CUTOFF) {
    return 'REGISTRATION_OPEN';
  } else if (now < EXAM_START_TIME) {
    return 'REGISTRATION_CLOSED';
  } else if (now <= EXAM_END_TIME) {
    return 'EXAM_LIVE';
  } else if (now < RESULT_PUBLISH_TIME) {
    return 'RESULT_WAITING';
  } else {
    return 'RESULT_LIVE';
  }
}
