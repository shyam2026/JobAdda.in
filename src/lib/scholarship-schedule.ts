// Scholarship Exam Schedule Constants
// Registration Cutoff: 14th August 2026, 10:00 PM IST
// Exam Date: 16th August 2026 (10:00 AM IST to 10:00 PM IST)
// Result Date: 20th August 2026 onwards

export const REGISTRATION_CUTOFF = new Date('2026-08-14T22:00:00+05:30').getTime();
export const EXAM_START_TIME = new Date('2026-08-16T10:00:00+05:30').getTime();
export const EXAM_END_TIME = new Date('2026-08-16T22:00:00+05:30').getTime();
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
