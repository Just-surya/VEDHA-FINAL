import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, AlertCircle } from 'lucide-react';

export default function StatCard({
  title,
  value,
  comparisonText,
  isPositive = true,
  isWarning = false,
  icon: Icon,
  badgeText
}) {
  // Determine delta color scheme
  // Green for positive deltas, red/coral for negative or warning
  const isRed = !isPositive || isWarning;

  return (
    <div className="bg-[#1c1b30] border border-[#282646] hover:border-[#38355c] transition-all rounded-2xl p-5 shadow-lg relative overflow-hidden group">
      {/* Background accent glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#8b85ff]/5 rounded-bl-full pointer-events-none group-hover:bg-[#8b85ff]/10 transition-colors" />

      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-[#9490b8]">
          {title}
        </span>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-[#8b85ff]/10 border border-[#8b85ff]/20 flex items-center justify-center text-[#8b85ff] shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          {value}
        </span>
        {badgeText && (
          <span className="text-xs text-[#9490b8] font-medium">{badgeText}</span>
        )}
      </div>

      <div className="flex items-center gap-1.5 pt-2 border-t border-[#282646]/60">
        <div
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
            isRed
              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
          }`}
        >
          {isWarning ? (
            <AlertCircle className="w-3 h-3" />
          ) : isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          <span>{comparisonText}</span>
        </div>
      </div>
    </div>
  );
}
