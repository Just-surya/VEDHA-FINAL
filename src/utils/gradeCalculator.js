/**
 * Returns letter grade based on marks (0 - 100)
 * Grade Buckets:
 * A: 90 - 100
 * B: 80 - 89
 * C: 70 - 79
 * D: 50 - 69
 * F: 0 - 49
 */
export function calculateGrade(marks) {
  const numericMarks = Number(marks);
  if (isNaN(numericMarks)) return 'F';
  if (numericMarks >= 90) return 'A';
  if (numericMarks >= 80) return 'B';
  if (numericMarks >= 70) return 'C';
  if (numericMarks >= 50) return 'D';
  return 'F';
}

/**
 * Returns color badge styling based on letter grade
 */
export function getGradeBadgeClass(grade) {
  switch (grade) {
    case 'A':
      return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
    case 'B':
      return 'bg-[#8b85ff]/15 text-[#8b85ff] border border-[#8b85ff]/30';
    case 'C':
      return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
    case 'D':
      return 'bg-sky-500/15 text-sky-400 border border-sky-500/30';
    case 'F':
      return 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
    default:
      return 'bg-slate-700/30 text-slate-400 border border-slate-600/30';
  }
}
