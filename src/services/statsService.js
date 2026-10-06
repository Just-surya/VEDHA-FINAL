import api from './api';

const DEFAULT_ATTENDANCE_TREND = [
  { month: "Jun", attendance: 88 },
  { month: "Jul", attendance: 91 },
  { month: "Aug", attendance: 87 },
  { month: "Sep", attendance: 92 },
  { month: "Oct", attendance: 89 },
  { month: "Nov", attendance: 90 }
];

const DEFAULT_TERM_META = {
  currentTerm: "Term 2",
  academicYear: "2025-2026",
  previousTerm: {
    totalStudents: 9,
    deltaStudents: "+3 this term",
    avgMarks: 69.9,
    deltaMarks: "+2.1 vs last term",
    avgAttendance: 89.8,
    deltaAttendance: "-0.8 vs last term",
    passRate: 94,
    supportNeeded: "1 need support"
  }
};

/**
 * Fetch monthly attendance trend data
 */
export async function getAttendanceTrend() {
  try {
    const res = await api.get('/attendanceTrend');
    return res.data;
  } catch (err) {
    console.warn('API error fetching attendanceTrend, using fallback:', err.message);
    return DEFAULT_ATTENDANCE_TREND;
  }
}

/**
 * Fetch term metadata and previous term benchmarks
 */
export async function getTermMeta() {
  try {
    const res = await api.get('/termMeta');
    return res.data;
  } catch (err) {
    console.warn('API error fetching termMeta, using fallback:', err.message);
    return DEFAULT_TERM_META;
  }
}
