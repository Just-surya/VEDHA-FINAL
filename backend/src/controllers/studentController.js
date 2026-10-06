import { supabase, isSupabaseConfigured, loadLocalStore } from '../config/db.js';

function calculateGrade(marks) {
  const m = Number(marks);
  if (isNaN(m)) return 'F';
  if (m >= 90) return 'A';
  if (m >= 80) return 'B';
  if (m >= 70) return 'C';
  if (m >= 50) return 'D';
  return 'F';
}

function normalizeStudent(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    name: row.name,
    class: row.class,
    marks: Number(row.marks),
    attendance: Number(row.attendance),
    grade: row.grade || calculateGrade(row.marks),
    gender: row.gender || 'Female',
    contactEmail: row.contact_email !== undefined ? row.contact_email : (row.contactEmail || ''),
    guardianName: row.guardian_name !== undefined ? row.guardian_name : (row.guardianName || ''),
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || undefined,
  };
}

export async function getStudents(req, res, next) {
  try {
    const { q, class: classFilter, sortBy } = req.query;

    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('students').select('*');

      if (classFilter && classFilter !== 'ALL') {
        query = query.eq('class', classFilter);
      }

      if (q && q.trim()) {
        const term = `%${q.trim()}%`;
        query = query.or(`name.ilike.${term},contact_email.ilike.${term}`);
      }

      if (sortBy === 'MARKS_DESC') {
        query = query.order('marks', { ascending: false });
      } else if (sortBy === 'MARKS_ASC') {
        query = query.order('marks', { ascending: true });
      } else if (sortBy === 'ATTENDANCE_DESC') {
        query = query.order('attendance', { ascending: false });
      } else if (sortBy === 'NAME_ASC') {
        query = query.order('name', { ascending: true });
      } else {
        query = query.order('marks', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw new Error(`Supabase error: ${error.message}`);
      return res.json((data || []).map(normalizeStudent));
    }

    // Local in-memory fallback
    const store = loadLocalStore();
    let result = [...(store.students || [])].map(normalizeStudent);

    if (classFilter && classFilter !== 'ALL') {
      result = result.filter(s => s.class === classFilter);
    }

    if (q && q.trim()) {
      const term = q.trim().toLowerCase();
      result = result.filter(
        s => s.name.toLowerCase().includes(term) || (s.contactEmail && s.contactEmail.toLowerCase().includes(term))
      );
    }

    if (sortBy === 'MARKS_DESC') {
      result.sort((a, b) => b.marks - a.marks);
    } else if (sortBy === 'MARKS_ASC') {
      result.sort((a, b) => a.marks - b.marks);
    } else if (sortBy === 'ATTENDANCE_DESC') {
      result.sort((a, b) => b.attendance - a.attendance);
    } else if (sortBy === 'NAME_ASC') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getStudentById(req, res, next) {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', String(id))
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) {
        return res.status(404).json({ success: false, message: `Student with id ${id} not found.` });
      }
      return res.json(normalizeStudent(data));
    }

    const store = loadLocalStore();
    const found = (store.students || []).find(s => String(s.id) === String(id));
    if (!found) {
      return res.status(404).json({ success: false, message: `Student with id ${id} not found.` });
    }
    return res.json(normalizeStudent(found));
  } catch (err) {
    next(err);
  }
}

export async function createStudent(req, res, next) {
  try {
    const { name, class: studentClass, marks, attendance, gender, contactEmail, guardianName } = req.body;

    if (!name || !studentClass || marks === undefined || attendance === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, class, marks, and attendance are required fields.',
      });
    }

    const numMarks = Number(marks);
    const numAttendance = Number(attendance);

    if (isNaN(numMarks) || numMarks < 0 || numMarks > 100) {
      return res.status(400).json({ success: false, message: 'Marks must be a number between 0 and 100.' });
    }

    if (isNaN(numAttendance) || numAttendance < 0 || numAttendance > 100) {
      return res.status(400).json({ success: false, message: 'Attendance must be a number between 0 and 100.' });
    }

    const grade = calculateGrade(numMarks);
    const newId = req.body.id || `std_${Date.now()}`;
    const now = new Date().toISOString();

    const record = {
      id: String(newId),
      name: name.trim(),
      class: studentClass,
      marks: numMarks,
      attendance: numAttendance,
      grade,
      gender: gender || 'Female',
      contact_email: contactEmail ? contactEmail.trim() : null,
      guardian_name: guardianName ? guardianName.trim() : null,
      created_at: now,
      updated_at: now,
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('students')
        .insert(record)
        .select()
        .single();

      if (error) throw new Error(`Supabase error: ${error.message}`);
      return res.status(201).json(normalizeStudent(data));
    }

    // Local fallback
    const store = loadLocalStore();
    store.students = store.students || [];
    const localItem = {
      ...record,
      contactEmail: record.contact_email,
      guardianName: record.guardian_name,
      createdAt: now,
    };
    store.students.push(localItem);
    return res.status(201).json(normalizeStudent(localItem));
  } catch (err) {
    next(err);
  }
}

export async function updateStudent(req, res, next) {
  try {
    const { id } = req.params;
    const { name, class: studentClass, marks, attendance, gender, contactEmail, guardianName } = req.body;

    const numMarks = marks !== undefined ? Number(marks) : undefined;
    const numAttendance = attendance !== undefined ? Number(attendance) : undefined;

    if (numMarks !== undefined && (isNaN(numMarks) || numMarks < 0 || numMarks > 100)) {
      return res.status(400).json({ success: false, message: 'Marks must be a number between 0 and 100.' });
    }

    if (numAttendance !== undefined && (isNaN(numAttendance) || numAttendance < 0 || numAttendance > 100)) {
      return res.status(400).json({ success: false, message: 'Attendance must be a number between 0 and 100.' });
    }

    const updates = {
      updated_at: new Date().toISOString(),
    };

    if (name) updates.name = name.trim();
    if (studentClass) updates.class = studentClass;
    if (numMarks !== undefined) {
      updates.marks = numMarks;
      updates.grade = calculateGrade(numMarks);
    }
    if (numAttendance !== undefined) updates.attendance = numAttendance;
    if (gender) updates.gender = gender;
    if (contactEmail !== undefined) updates.contact_email = contactEmail ? contactEmail.trim() : null;
    if (guardianName !== undefined) updates.guardian_name = guardianName ? guardianName.trim() : null;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', String(id))
        .select()
        .single();

      if (error) throw new Error(`Supabase error: ${error.message}`);
      if (!data) return res.status(404).json({ success: false, message: `Student with id ${id} not found.` });
      return res.json(normalizeStudent(data));
    }

    // Local fallback
    const store = loadLocalStore();
    store.students = store.students || [];
    const index = store.students.findIndex(s => String(s.id) === String(id));
    if (index === -1) {
      return res.status(404).json({ success: false, message: `Student with id ${id} not found.` });
    }

    const existing = store.students[index];
    const updatedLocal = {
      ...existing,
      ...updates,
      contactEmail: updates.contact_email !== undefined ? updates.contact_email : existing.contactEmail,
      guardianName: updates.guardian_name !== undefined ? updates.guardian_name : existing.guardianName,
      updatedAt: updates.updated_at,
    };
    store.students[index] = updatedLocal;
    return res.json(normalizeStudent(updatedLocal));
  } catch (err) {
    next(err);
  }
}

export async function deleteStudent(req, res, next) {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', String(id));

      if (error) throw new Error(`Supabase error: ${error.message}`);
      return res.json({ success: true, message: `Student ${id} deleted successfully.` });
    }

    const store = loadLocalStore();
    store.students = store.students || [];
    const initialLen = store.students.length;
    store.students = store.students.filter(s => String(s.id) !== String(id));

    if (store.students.length === initialLen) {
      return res.status(404).json({ success: false, message: `Student with id ${id} not found.` });
    }

    return res.json({ success: true, message: `Student ${id} deleted successfully.` });
  } catch (err) {
    next(err);
  }
}
