import React from 'react';
import { Eye, Edit3, Trash2, ArrowUpDown } from 'lucide-react';
import { getGradeBadgeClass } from '../../utils/gradeCalculator';

export default function StudentTable({
  students = [],
  onView,
  onEdit,
  onDelete,
}) {
  if (students.length === 0) {
    return (
      <div className="bg-[#1c1b30] border border-[#282646] rounded-2xl p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#8b85ff]/10 border border-[#8b85ff]/20 mx-auto flex items-center justify-center text-[#8b85ff] mb-3">
          <ArrowUpDown className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">No students found</h3>
        <p className="text-xs text-[#9490b8] max-w-sm mx-auto mt-1">
          No student records match your search or filter criteria. Try adjusting your query or add a new student.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#1c1b30] border border-[#282646] rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#282646] bg-[#16152a]/60 text-[11px] font-semibold uppercase tracking-wider text-[#9490b8]">
              <th className="py-3.5 px-4 sm:px-6">Student</th>
              <th className="py-3.5 px-4">Class</th>
              <th className="py-3.5 px-4 text-center">Marks</th>
              <th className="py-3.5 px-4 text-center">Attendance</th>
              <th className="py-3.5 px-4 text-center">Grade</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#282646]/60 text-sm">
            {students.map((student) => {
              const marks = Number(student.marks);
              const attendance = Number(student.attendance);
              const grade = student.grade || 'N/A';

              return (
                <tr
                  key={student.id}
                  className="hover:bg-[#23223c]/50 transition-colors group"
                >
                  {/* Name & Avatar */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8b85ff]/20 to-[#635bf2]/10 border border-[#8b85ff]/30 flex items-center justify-center text-[#8b85ff] font-semibold text-xs shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-white truncate group-hover:text-[#8b85ff] transition-colors">
                          {student.name}
                        </div>
                        {student.contactEmail && (
                          <div className="text-[11px] text-[#9490b8] truncate">
                            {student.contactEmail}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Class */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#12111f] text-slate-200 border border-[#282646]">
                      {student.class}
                    </span>
                  </td>

                  {/* Marks */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="font-semibold text-white font-mono">
                        {marks}%
                      </span>
                      <div className="w-14 bg-[#282646] h-1 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            marks >= 75 ? 'bg-[#8b85ff]' : marks >= 50 ? 'bg-amber-400' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(marks, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Attendance */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-semibold font-mono text-xs px-2 py-0.5 rounded-md ${
                        attendance >= 85
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-amber-400 bg-amber-500/10'
                      }`}
                    >
                      {attendance}%
                    </span>
                  </td>

                  {/* Grade */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${getGradeBadgeClass(
                        grade
                      )}`}
                    >
                      {grade}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView(student)}
                        className="p-1.5 rounded-lg text-[#9490b8] hover:text-white hover:bg-[#282646] transition-colors"
                        title="View student details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(student)}
                        className="p-1.5 rounded-lg text-[#9490b8] hover:text-[#8b85ff] hover:bg-[#8b85ff]/10 transition-colors"
                        title="Edit record"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(student)}
                        className="p-1.5 rounded-lg text-[#9490b8] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
