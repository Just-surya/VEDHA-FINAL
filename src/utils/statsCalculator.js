import { calculateGrade } from './gradeCalculator';

/**
 * Computes dashboard statistics dynamically from an array of student records.
 */
export function computeDashboardStats(students = [], termMeta = null) {
  const total = students.length;

  if (total === 0) {
    return {
      totalStudents: 0,
      studentsDeltaText: "+0 this term",
      avgMarks: 0,
      marksDeltaText: "0.0 vs last term",
      marksDeltaPositive: true,
      avgAttendance: 0,
      attendanceDeltaText: "0.0 vs last term",
      attendanceDeltaPositive: true,
      passRate: 0,
      supportNeededText: "0 need support",
      classAverages: [
        { class: '10-A', average: 0 },
        { class: '10-B', average: 0 },
        { class: '9-A', average: 0 },
        { class: '9-B', average: 0 },
      ],
      gradeDistribution: [
        { grade: 'A', count: 0, label: 'A (90-100)' },
        { grade: 'B', count: 0, label: 'B (80-89)' },
        { grade: 'C', count: 0, label: 'C (70-79)' },
        { grade: 'D', count: 0, label: 'D (50-69)' },
        { grade: 'F', count: 0, label: 'F (<50)' },
      ],
      topPerformers: [],
    };
  }

  // Aggregate marks and attendance
  const totalMarks = students.reduce((acc, s) => acc + Number(s.marks || 0), 0);
  const totalAttendance = students.reduce((acc, s) => acc + Number(s.attendance || 0), 0);
  const avgMarks = Math.round(totalMarks / total);
  const avgAttendance = Math.round(totalAttendance / total);

  // Pass rate (marks >= 40 is pass)
  const passedStudents = students.filter(s => Number(s.marks) >= 40);
  const failedStudents = students.filter(s => Number(s.marks) < 40);
  const passRate = Math.round((passedStudents.length / total) * 100);
  const needSupportCount = failedStudents.length;

  // Comparison with previous term defaults or termMeta
  const prev = termMeta?.previousTerm || {
    totalStudents: 9,
    avgMarks: 69.9,
    avgAttendance: 89.8,
  };

  const studentDiff = total - prev.totalStudents;
  const studentsDeltaText = studentDiff >= 0 ? `+${studentDiff} this term` : `${studentDiff} this term`;

  const marksDiff = (avgMarks - prev.avgMarks).toFixed(1);
  const marksDeltaPositive = avgMarks >= prev.avgMarks;
  const marksDeltaText = `${marksDiff > 0 ? '+' : ''}${marksDiff} vs last term`;

  const attendanceDiff = (avgAttendance - prev.avgAttendance).toFixed(1);
  const attendanceDeltaPositive = avgAttendance >= prev.avgAttendance;
  const attendanceDeltaText = `${attendanceDiff > 0 ? '+' : ''}${attendanceDiff} vs last term`;

  const supportNeededText = `${needSupportCount} ${needSupportCount === 1 ? 'need support' : 'need support'}`;

  // Class averages for target classes: 10-A, 10-B, 9-A, 9-B
  const targetClasses = ['10-A', '10-B', '9-A', '9-B'];
  const classAverages = targetClasses.map(clsName => {
    const classStudents = students.filter(s => s.class === clsName);
    if (classStudents.length === 0) return { class: clsName, average: 0 };
    const classAvg = classStudents.reduce((acc, s) => acc + Number(s.marks || 0), 0) / classStudents.length;
    return {
      class: clsName,
      average: Math.round(classAvg),
    };
  });

  // Grade distribution in 5 buckets
  const gradesCount = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  students.forEach(s => {
    const g = s.grade || calculateGrade(s.marks);
    if (gradesCount[g] !== undefined) {
      gradesCount[g]++;
    } else {
      gradesCount.F++;
    }
  });

  const gradeDistribution = [
    { grade: 'A', count: gradesCount.A, label: 'A (90-100)' },
    { grade: 'B', count: gradesCount.B, label: 'B (80-89)' },
    { grade: 'C', count: gradesCount.C, label: 'C (70-79)' },
    { grade: 'D', count: gradesCount.D, label: 'D (50-69)' },
    { grade: 'F', count: gradesCount.F, label: 'F (<50)' },
  ];

  // Top performers ranked by marks descending
  const topPerformers = [...students]
    .sort((a, b) => Number(b.marks) - Number(a.marks))
    .slice(0, 5)
    .map((s, idx) => ({
      rank: idx + 1,
      id: s.id,
      name: s.name,
      class: s.class,
      marks: Number(s.marks),
      attendance: Number(s.attendance),
      grade: s.grade || calculateGrade(s.marks),
    }));

  return {
    totalStudents: total,
    studentsDeltaText,
    studentsDeltaPositive: true,
    avgMarks,
    marksDeltaText,
    marksDeltaPositive,
    avgAttendance,
    attendanceDeltaText,
    attendanceDeltaPositive,
    passRate,
    supportNeededText,
    classAverages,
    gradeDistribution,
    topPerformers,
  };
}
