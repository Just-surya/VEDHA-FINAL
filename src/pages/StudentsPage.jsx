import React, { useState, useMemo } from 'react';
import { useStudents } from '../hooks/useStudents';
import StudentTable from '../components/students/StudentTable';
import StudentFormModal from '../components/students/StudentFormModal';
import StudentViewModal from '../components/students/StudentViewModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';

import { 
  UserPlus, 
  Search, 
  Filter, 
  CheckCircle, 
  X, 
  GraduationCap, 
  Layers, 
  SlidersHorizontal 
} from 'lucide-react';

export default function StudentsPage() {
  const {
    students,
    loading,
    error,
    refreshStudents,
    addStudent,
    updateStudent,
    removeStudent,
  } = useStudents();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [sortBy, setSortBy] = useState('MARKS_DESC');

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Success Notification
  const [successToast, setSuccessToast] = useState('');

  const triggerToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast('');
    }, 3500);
  };

  // Filter and Sort students
  const filteredStudents = useMemo(() => {
    let result = [...students];

    // Filter by name search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.contactEmail && s.contactEmail.toLowerCase().includes(q))
      );
    }

    // Filter by class
    if (selectedClass !== 'ALL') {
      result = result.filter((s) => s.class === selectedClass);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'MARKS_DESC') return Number(b.marks) - Number(a.marks);
      if (sortBy === 'MARKS_ASC') return Number(a.marks) - Number(b.marks);
      if (sortBy === 'ATTENDANCE_DESC') return Number(b.attendance) - Number(a.attendance);
      if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [students, searchQuery, selectedClass, sortBy]);

  // Form Submission (Add or Edit)
  const handleFormSubmit = async (formData) => {
    setIsSubmittingForm(true);
    try {
      if (editingStudent?.id) {
        await updateStudent(editingStudent.id, formData);
        triggerToast(`Updated student profile for "${formData.name}".`);
      } else {
        await addStudent(formData);
        triggerToast(`Successfully registered new student "${formData.name}".`);
      }
      setFormModalOpen(false);
      setEditingStudent(null);
    } catch (err) {
      alert(err.message || 'Error saving student record.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!deletingStudent?.id) return;
    setIsDeleting(true);
    try {
      await removeStudent(deletingStudent.id);
      triggerToast(`Removed record for "${deletingStudent.name}".`);
      setDeleteModalOpen(false);
      setDeletingStudent(null);
    } catch (err) {
      alert(err.message || 'Error deleting student record.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-bottom duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{successToast}</span>
          <button
            onClick={() => setSuccessToast('')}
            className="text-emerald-400 hover:text-white p-0.5 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#8b85ff] uppercase tracking-wider">
              Student Records
            </span>
            <span className="text-xs text-[#9490b8]">
              • {students.length} Total Enrolled
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Class Roster & Academic Marks
          </h1>
          <p className="text-sm text-[#9490b8] mt-1">
            Manage student registrations, marks, attendance benchmarks, and academic grades.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              setEditingStudent(null);
              setFormModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8b85ff] hover:bg-[#7b75f5] text-white text-sm font-medium transition-all shadow-lg shadow-indigo-950/40 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && <ErrorAlert message={error} onRetry={refreshStudents} />}

      {/* Filter and Search Bar Card */}
      <div className="bg-[#1c1b30] border border-[#282646] rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9490b8]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or email..."
            className="w-full pl-10 pr-9 py-2 bg-[#12111f] border border-[#282646] focus:border-[#8b85ff] rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9490b8] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter by Class & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Class Filter */}
          <div className="flex items-center gap-2 bg-[#12111f] border border-[#282646] rounded-xl px-3 py-1.5 text-xs text-[#9490b8]">
            <Filter className="w-3.5 h-3.5 text-[#8b85ff]" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent text-slate-200 text-xs outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#1c1b30]">All Classes</option>
              <option value="10-A" className="bg-[#1c1b30]">Class 10-A</option>
              <option value="10-B" className="bg-[#1c1b30]">Class 10-B</option>
              <option value="9-A" className="bg-[#1c1b30]">Class 9-A</option>
              <option value="9-B" className="bg-[#1c1b30]">Class 9-B</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 bg-[#12111f] border border-[#282646] rounded-xl px-3 py-1.5 text-xs text-[#9490b8]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8b85ff]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-slate-200 text-xs outline-none cursor-pointer"
            >
              <option value="MARKS_DESC" className="bg-[#1c1b30]">Highest Marks</option>
              <option value="MARKS_ASC" className="bg-[#1c1b30]">Lowest Marks</option>
              <option value="ATTENDANCE_DESC" className="bg-[#1c1b30]">Highest Attendance</option>
              <option value="NAME_ASC" className="bg-[#1c1b30]">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Student Table */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" text="Retrieving student records from server..." />
        </div>
      ) : (
        <StudentTable
          students={filteredStudents}
          onView={(student) => {
            setViewingStudent(student);
            setViewModalOpen(true);
          }}
          onEdit={(student) => {
            setEditingStudent(student);
            setFormModalOpen(true);
          }}
          onDelete={(student) => {
            setDeletingStudent(student);
            setDeleteModalOpen(true);
          }}
        />
      )}

      {/* Form Modal (Add & Edit) */}
      <StudentFormModal
        isOpen={formModalOpen}
        initialData={editingStudent}
        isSubmitting={isSubmittingForm}
        onSubmit={handleFormSubmit}
        onClose={() => {
          setFormModalOpen(false);
          setEditingStudent(null);
        }}
      />

      {/* View Details Modal */}
      <StudentViewModal
        isOpen={viewModalOpen}
        student={viewingStudent}
        onClose={() => {
          setViewModalOpen(false);
          setViewingStudent(null);
        }}
        onEdit={(student) => {
          setEditingStudent(student);
          setFormModalOpen(true);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        itemName={deletingStudent?.name}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingStudent(null);
        }}
      />

    </div>
  );
}
