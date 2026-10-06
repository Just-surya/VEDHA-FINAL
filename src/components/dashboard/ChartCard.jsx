import React from 'react';

export default function ChartCard({ title, subtitle, badge, children }) {
  return (
    <div className="bg-[#1c1b30] border border-[#282646] hover:border-[#38355c] transition-all rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col justify-between">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-[#9490b8] mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {badge && (
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#8b85ff]/15 text-[#8b85ff] border border-[#8b85ff]/30 shrink-0">
            {badge}
          </span>
        )}
      </div>

      <div className="w-full flex-1 min-h-[260px] pt-2">
        {children}
      </div>
    </div>
  );
}
