import React from 'react';
import { Trophy, Award, Medal, TrendingUp, Sparkles } from 'lucide-react';

export default function TopPerformersList({ performers = [] }) {
  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-xs flex items-center justify-center shrink-0 shadow-sm shadow-amber-950/40">
            1
          </span>
        );
      case 2:
        return (
          <span className="w-7 h-7 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/30 font-bold text-xs flex items-center justify-center shrink-0">
            2
          </span>
        );
      case 3:
        return (
          <span className="w-7 h-7 rounded-full bg-amber-700/25 text-amber-500 border border-amber-600/30 font-bold text-xs flex items-center justify-center shrink-0">
            3
          </span>
        );
      default:
        return (
          <span className="w-7 h-7 rounded-full bg-[#282646] text-[#9490b8] font-semibold text-xs flex items-center justify-center shrink-0">
            {rank}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#1c1b30] border border-[#282646] hover:border-[#38355c] transition-all rounded-2xl p-5 sm:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Top Performers
            </h3>
            <p className="text-xs text-[#9490b8]">
              Term 2 Highest Scoring Students
            </p>
          </div>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-[#8b85ff]/10 text-[#8b85ff] border border-[#8b85ff]/20 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Top 5
        </span>
      </div>

      <div className="divide-y divide-[#282646]/60">
        {performers.map((student) => (
          <div
            key={student.id || student.rank}
            className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3 group hover:bg-[#23223c]/40 px-2 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              {getRankBadge(student.rank)}
              <div className="truncate">
                <span className="text-sm font-medium text-slate-100 group-hover:text-white transition-colors">
                  {student.name}
                </span>
                <span className="ml-2 text-xs text-[#9490b8]">
                  ({student.class})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Score bar */}
              <div className="hidden sm:block w-20 bg-[#282646] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#8b85ff] h-full rounded-full transition-all"
                  style={{ width: `${student.marks}%` }}
                />
              </div>

              {/* Accent colored percentage */}
              <span className="font-bold text-base text-[#8b85ff] min-w-[42px] text-right font-mono">
                {student.marks}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
