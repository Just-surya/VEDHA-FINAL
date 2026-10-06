import api from './api';
import { calculateGrade } from '../utils/gradeCalculator';

const STUDENTS_STORAGE_KEY = 'vedha_students_cache';

// Seed fallback data for offline / standalone preview resilience
const DEFAULT_STUDENTS = [
  {
    id: "1",
    name: "Lakshmi Iyer",
    class: "10-A",
    marks: 97,
    attendance: 96,
    grade: "A",
    gender: "Female",
    contactEmail: "lakshmi.iyer@vedha.edu.in",
    guardianName: "Ramesh Iyer",
    createdAt: "2026-06-01T08:30:00.000Z"
  },
  {
    id: "2",
    name: "Meera Menon",
    class: "10-A",
    marks: 94,
    attendance: 95,
    grade: "A",
    gender: "Female",
    contactEmail: "meera.menon@vedha.edu.in",
    guardianName: "Gopal Menon",
    createdAt: "2026-06-01T08:30:00.000Z"
  },
  {
    id: "3",
    name: "Aarav Nair",
    class: "10-A",
    marks: 88,
    attendance: 92,
    grade: "B",
    gender: "Male",
    contactEmail: "aarav.nair@vedha.edu.in",
    guardianName: "Suresh Nair",
    createdAt: "2026-06-01T08:30:00.000Z"
  },
  {
    id: "4",
    name: "Joel Mathew",
    class: "9-A",
    marks: 84,
    attendance: 90,
    grade: "B",
    gender: "Male",
    contactEmail: "joel.mathew@vedha.edu.in",
    guardianName: "Thomas Mathew",
    createdAt: "2026-06-01T08:30:00.000Z"
  },
  {
    id: "5",
    name: "Divya Pillai",
    class: "10-B",
    marks: 81,
    attendance: 91,
    grade: "B",
    gender: "Female",
    contactEmail: "divya.pillai@vedha.edu.in",
    guardianName: "Krishna Pillai",
    createdAt: "2026-06-01T08:30:00.000Z"
  },
  {
    id: "6",
    name: "Rohan Varghese",
    class: "9-B",
    marks: 76,
    attendance: 88,
    grade: "C",
    gender: "Male",
    contactEmail: "rohan.v@vedha.edu.in",
    guardianName: "Jacob Varghese",
    createdAt: "2026-06-01T08:30:00.000Z"
  },
  {
    id: "7",
    name: "Ananya Kurian",
    class: "10-B",
    marks: 71,
    attendance: 89,
    grade: "C",
    gender: "Female",
    contactEmail: "ananya.kurian@vedha.edu.in",
    guardianName: "George Kurian",
    createdAt: "2026-06-01T08:30:00.000Z"
  },
  {
    id: "8",
    name: "Gautham Krishna",
    class: "9-A",
    marks: 68,
    attendance: 86,
    grade: "D",
    gender: "Male",
    contactEmail: "gautham.k@vedha.edu.in",
    guardianName: "Mohanan Krishna",
    createdAt: "2026-06-01T08:30:00.000Z"
  },
  {
    id: "9",
    name: "Sneha Nambiar",
    class: "9-B",
    marks: 63,
    attendance: 93,
    grade: "D",
    gender: "Female",
    contactEmail: "sneha.nambiar@vedha.edu.in",
    guardianName: "Vijayan Nambiar",
    createdAt: "2026-06-01T08:30:00.000Z"
  },
  {
    id: "10",
    name: "Ashwin Panicker",
    class: "10-B",
    marks: 58,
    attendance: 84,
    grade: "D",
    gender: "Male",
    contactEmail: "ashwin.p@vedha.edu.in",
    guardianName: "Radhakrishnan Panicker",
    createdAt: "2026-06-01T08:30:00.000Z"
  },
  {
    id: "11",
    name: "Fathima Beevi",
    class: "9-A",
    marks: 50,
    attendance: 87,
    grade: "D",
    gender: "Female",
    contactEmail: "fathima.b@vedha.edu.in",
    guardianName: "Abdul Rahman",
    createdAt: "2026-06-01T08:30:00.000Z"
  },
  {
    id: "12",
    name: "Rahul Namboodiri",
    class: "9-B",
    marks: 34,
    attendance: 77,
    grade: "F",
    gender: "Male",
    contactEmail: "rahul.n@vedha.edu.in",
    guardianName: "Narayanan Namboodiri",
    createdAt: "2026-06-01T08:30:00.000Z"
  }
];

function getLocalStudents() {
  const cached = localStorage.getItem(STUDENTS_STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(DEFAULT_STUDENTS));
  return DEFAULT_STUDENTS;
}

function saveLocalStudents(students) {
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
}

/**
 * Fetch all students from json-server, falling back to local cache if server is unreachable
 */
export async function getStudents() {
  try {
    const res = await api.get('/students');
    saveLocalStudents(res.data);
    return res.data;
  } catch (err) {
    console.warn('API error, using local students cache:', err.message);
    return getLocalStudents();
  }
}

/**
 * Fetch a single student by ID
 */
export async function getStudentById(id) {
  try {
    const res = await api.get(`/students/${id}`);
    return res.data;
  } catch (err) {
    console.warn(`API error fetching student ${id}, fallback to local:`, err.message);
    const local = getLocalStudents();
    const found = local.find(s => String(s.id) === String(id));
    if (!found) throw new Error(`Student with id ${id} not found.`);
    return found;
  }
}

/**
 * Add a new student
 */
export async function addStudent(studentData) {
  const marks = Number(studentData.marks);
  const attendance = Number(studentData.attendance);
  const grade = calculateGrade(marks);

  const payload = {
    ...studentData,
    marks,
    attendance,
    grade,
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await api.post('/students', payload);
    // Update local cache
    const current = getLocalStudents();
    saveLocalStudents([...current, res.data]);
    return res.data;
  } catch (err) {
    console.warn('API error creating student, writing to local cache:', err.message);
    const current = getLocalStudents();
    const newId = String(Date.now());
    const newStudent = { ...payload, id: newId };
    saveLocalStudents([...current, newStudent]);
    return newStudent;
  }
}

/**
 * Update an existing student
 */
export async function updateStudent(id, studentData) {
  const marks = Number(studentData.marks);
  const attendance = Number(studentData.attendance);
  const grade = calculateGrade(marks);

  const payload = {
    ...studentData,
    marks,
    attendance,
    grade,
    updatedAt: new Date().toISOString(),
  };

  try {
    const res = await api.put(`/students/${id}`, payload);
    const current = getLocalStudents();
    const updated = current.map(s => (String(s.id) === String(id) ? res.data : s));
    saveLocalStudents(updated);
    return res.data;
  } catch (err) {
    console.warn(`API error updating student ${id}, updating local cache:`, err.message);
    const current = getLocalStudents();
    const updated = current.map(s => (String(s.id) === String(id) ? { ...s, ...payload, id: String(id) } : s));
    saveLocalStudents(updated);
    const updatedStudent = updated.find(s => String(s.id) === String(id));
    return updatedStudent;
  }
}

/**
 * Delete a student by ID
 */
export async function deleteStudent(id) {
  try {
    await api.delete(`/students/${id}`);
    const current = getLocalStudents();
    const filtered = current.filter(s => String(s.id) !== String(id));
    saveLocalStudents(filtered);
    return true;
  } catch (err) {
    console.warn(`API error deleting student ${id}, removing from local cache:`, err.message);
    const current = getLocalStudents();
    const filtered = current.filter(s => String(s.id) !== String(id));
    saveLocalStudents(filtered);
    return true;
  }
}
