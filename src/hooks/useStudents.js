import { useState, useEffect, useCallback } from 'react';
import * as studentService from '../services/studentService';

export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (err) {
      setError(err.message || 'Failed to load students.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const addStudent = async (studentData) => {
    try {
      const created = await studentService.addStudent(studentData);
      await fetchStudents();
      return created;
    } catch (err) {
      throw new Error(err.message || 'Failed to add student.');
    }
  };

  const updateStudent = async (id, studentData) => {
    try {
      const updated = await studentService.updateStudent(id, studentData);
      await fetchStudents();
      return updated;
    } catch (err) {
      throw new Error(err.message || 'Failed to update student.');
    }
  };

  const removeStudent = async (id) => {
    try {
      await studentService.deleteStudent(id);
      await fetchStudents();
      return true;
    } catch (err) {
      throw new Error(err.message || 'Failed to delete student.');
    }
  };

  return {
    students,
    loading,
    error,
    refreshStudents: fetchStudents,
    addStudent,
    updateStudent,
    removeStudent,
  };
}
