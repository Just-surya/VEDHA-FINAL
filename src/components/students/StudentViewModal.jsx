import React from 'react';
import { X, User, GraduationCap, Calendar, Mail, Shield, CheckCircle2 } from 'lucide-react';
import { getGradeBadgeClass } from '../../utils/gradeCalculator';

export default function StudentViewModal({
  isOpen,
  student = null,
  onClose,
  onEdit,
}) {
  if (!isOpen || !student) return null;

  const marks = Number(student.marks || 0);
  const attendance = Number(student.attendance || 0);
  const grade = student.grade || 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#1c1b30] border border-[#282646] rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9490b8] hover:text-white p-1 rounded-lg hover:bg-[#282646] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8b85ff] to-[#635bf2] flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-950/40 shrink-0">
            {student.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {student.name}
              </h3>
              <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${getGradeBadgeClass(grade)}`}>
                {grade}
              </span>
            </div>
            <p className="text-xs text-[#9490b8] mt-0.5">
              Class <span className="text-white font-medium">{student.class}</span> • {student.gender || 'Student'}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-[#12111f] border border-[#282646]">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#9490b8] block mb-1">
              Academic Marks
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white font-mono">{marks}%</span>
              <span className="text-xs text-[#8b85ff]">
                {marks >= 40 ? 'Passed' : 'Needs Support'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#12111f] border border-[#282646]">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#9490b8] block mb-1">
              Attendance Record
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white font-mono">{attendance}%</span>
              <span className={`text-xs ${attendance >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {attendance >= 85 ? 'Regular' : 'Borderline'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Information List */}
        <div className="space-y-3 mb-6 text-xs text-slate-300">
          <div className="flex items-center justify-between py-2 border-b border-[#282646]/60">
            <span className="text-[#9490b8] flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              Contact Email
            </span>
            <span className="font-medium text-white truncate max-w-[200px]">
              {student.contactEmail || 'Not registered'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#282646]/60">
            <span className="text-[#9490b8] flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" />
              Guardian / Parent
            </span>
            <span className="font-medium text-white">
              {student.guardianName || 'Parent / Guardian'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-[#9490b8] flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Record Status
            </span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active in Term 2
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#282646]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-[#282646]/60 hover:bg-[#282646] transition-colors"
          >
            Close
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(student);
              }}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#8b85ff] hover:bg-[#7b75f5] transition-colors shadow-md"
            >
              Edit Details
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
