import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';
import { calculateGrade, getGradeBadgeClass } from '../../utils/gradeCalculator';

export default function StudentFormModal({
  isOpen,
  initialData = null,
  isSubmitting = false,
  onSubmit,
  onClose,
}) {
  const isEdit = !!initialData?.id;

  const [formData, setFormData] = useState({
    name: '',
    class: '10-A',
    marks: '',
    attendance: '',
    gender: 'Female',
    contactEmail: '',
    guardianName: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        class: initialData.class || '10-A',
        marks: initialData.marks !== undefined ? String(initialData.marks) : '',
        attendance: initialData.attendance !== undefined ? String(initialData.attendance) : '',
        gender: initialData.gender || 'Female',
        contactEmail: initialData.contactEmail || '',
        guardianName: initialData.guardianName || '',
      });
    } else {
      setFormData({
        name: '',
        class: '10-A',
        marks: '',
        attendance: '',
        gender: 'Female',
        contactEmail: '',
        guardianName: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Real-time calculated grade preview
  const calculatedGrade = formData.marks !== '' ? calculateGrade(formData.marks) : '—';

  const validate = () => {
    const errs = {};

    // Name validation
    if (!formData.name.trim()) {
      errs.name = 'Student full name is required';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    // Class validation
    if (!formData.class) {
      errs.class = 'Class selection is required';
    }

    // Marks validation (0-100)
    if (formData.marks === '' || formData.marks === null) {
      errs.marks = 'Marks are required';
    } else {
      const marksNum = Number(formData.marks);
      if (isNaN(marksNum)) {
        errs.marks = 'Marks must be a valid number';
      } else if (marksNum < 0 || marksNum > 100) {
        errs.marks = 'Marks must be between 0 and 100';
      }
    }

    // Attendance validation (0-100)
    if (formData.attendance === '' || formData.attendance === null) {
      errs.attendance = 'Attendance is required';
    } else {
      const attNum = Number(formData.attendance);
      if (isNaN(attNum)) {
        errs.attendance = 'Attendance must be a valid number';
      } else if (attNum < 0 || attNum > 100) {
        errs.attendance = 'Attendance must be between 0 and 100';
      }
    }

    // Email format validation (if provided)
    if (formData.contactEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contactEmail.trim())) {
        errs.contactEmail = 'Please provide a valid email address';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      contactEmail: formData.contactEmail.trim(),
      guardianName: formData.guardianName.trim(),
      marks: Number(formData.marks),
      attendance: Number(formData.attendance),
    });
  };

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#1c1b30] border border-[#282646] rounded-2xl w-full max-w-lg p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 my-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-[#9490b8] hover:text-white p-1 rounded-lg hover:bg-[#282646] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#8b85ff]/15 border border-[#8b85ff]/30 flex items-center justify-center text-[#8b85ff] shrink-0">
            {isEdit ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {isEdit ? 'Edit Student Record' : 'Add New Student'}
            </h3>
            <p className="text-xs text-[#9490b8]">
              {isEdit
                ? 'Update academic performance and attendance figures'
                : 'Enroll a new student for Term 2 tracking'}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Lakshmi Iyer"
              className={`w-full px-3.5 py-2.5 bg-[#12111f] border ${
                errors.name ? 'border-rose-500 ring-1 ring-rose-500/40' : 'border-[#282646] focus:border-[#8b85ff]'
              } rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-colors`}
            />
            {errors.name && (
              <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Class & Gender Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Class <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.class}
                onChange={(e) => handleChange('class', e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-[#12111f] border ${
                  errors.class ? 'border-rose-500' : 'border-[#282646] focus:border-[#8b85ff]'
                } rounded-xl text-white text-sm outline-none transition-colors cursor-pointer`}
              >
                <option value="10-A">Class 10-A</option>
                <option value="10-B">Class 10-B</option>
                <option value="9-A">Class 9-A</option>
                <option value="9-B">Class 9-B</option>
              </select>
              {errors.class && (
                <p className="text-xs text-rose-400 mt-1">{errors.class}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#12111f] border border-[#282646] focus:border-[#8b85ff] rounded-xl text-white text-sm outline-none transition-colors cursor-pointer"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Marks & Attendance & Computed Grade Preview Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Marks (0-100) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.marks}
                onChange={(e) => handleChange('marks', e.target.value)}
                placeholder="0 - 100"
                className={`w-full px-3.5 py-2.5 bg-[#12111f] border ${
                  errors.marks ? 'border-rose-500 ring-1 ring-rose-500/40' : 'border-[#282646] focus:border-[#8b85ff]'
                } rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-colors`}
              />
              {errors.marks && (
                <p className="text-xs text-rose-400 mt-1">{errors.marks}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Attendance (%) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.attendance}
                onChange={(e) => handleChange('attendance', e.target.value)}
                placeholder="0 - 100"
                className={`w-full px-3.5 py-2.5 bg-[#12111f] border ${
                  errors.attendance ? 'border-rose-500 ring-1 ring-rose-500/40' : 'border-[#282646] focus:border-[#8b85ff]'
                } rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-colors`}
              />
              {errors.attendance && (
                <p className="text-xs text-rose-400 mt-1">{errors.attendance}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Calculated Grade
              </label>
              <div className="h-[42px] px-3.5 py-2 bg-[#12111f] border border-[#282646] rounded-xl flex items-center justify-between">
                <span className="text-xs text-[#9490b8]">Grade:</span>
                <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${getGradeBadgeClass(calculatedGrade)}`}>
                  {calculatedGrade}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              placeholder="e.g. lakshmi.iyer@vedha.edu.in"
              className={`w-full px-3.5 py-2.5 bg-[#12111f] border ${
                errors.contactEmail ? 'border-rose-500' : 'border-[#282646] focus:border-[#8b85ff]'
              } rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-colors`}
            />
            {errors.contactEmail && (
              <p className="text-xs text-rose-400 mt-1">{errors.contactEmail}</p>
            )}
          </div>

          {/* Guardian Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Guardian Name
            </label>
            <input
              type="text"
              value={formData.guardianName}
              onChange={(e) => handleChange('guardianName', e.target.value)}
              placeholder="e.g. Ramesh Iyer"
              className="w-full px-3.5 py-2.5 bg-[#12111f] border border-[#282646] focus:border-[#8b85ff] rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-colors"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#282646]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-[#282646]/60 hover:bg-[#282646] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-[#8b85ff] hover:bg-[#7b75f5] transition-all shadow-lg shadow-indigo-950/40 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? 'Update Student' : 'Add Student'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
