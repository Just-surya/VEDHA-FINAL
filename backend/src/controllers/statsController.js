import { supabase, isSupabaseConfigured, loadLocalStore } from '../config/db.js';

export async function getAttendanceTrend(req, res, next) {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('attendance_trend')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw new Error(error.message);
      return res.json(data.map(item => ({
        id: item.id,
        month: item.month,
        attendance: Number(item.attendance),
      })));
    }

    const store = loadLocalStore();
    return res.json(store.attendanceTrend || []);
  } catch (err) {
    next(err);
  }
}

export async function getTermMeta(req, res, next) {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('term_meta')
        .select('*')
        .eq('id', 'current')
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (data) {
        return res.json({
          currentTerm: data.current_term,
          academicYear: data.academic_year,
          previousTerm: data.previous_term,
        });
      }
    }

    const store = loadLocalStore();
    return res.json(store.termMeta || {
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
    });
  } catch (err) {
    next(err);
  }
}
