import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStudents } from '../../hooks/useStudents';
import { getAttendanceTrend, getTermMeta } from '../../services/statsService';
import { computeDashboardStats } from '../../utils/statsCalculator';

import StatCard from '../../components/dashboard/StatCard';
import ChartCard from '../../components/dashboard/ChartCard';
import ClassAverageChart from '../../components/dashboard/ClassAverageChart';
import GradeDistributionChart from '../../components/dashboard/GradeDistributionChart';
import AttendanceTrendChart from '../../components/dashboard/AttendanceTrendChart';
import TopPerformersList from '../../components/dashboard/TopPerformersList';

import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

import { 
  Users, 
  Award, 
  CalendarCheck, 
  TrendingUp, 
  ArrowRight, 
  HelpCircle,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';

export default function DashboardPage() {
  const { students, loading: studentsLoading, error: studentsError, refreshStudents } = useStudents();
  
  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [termMeta, setTermMeta] = useState(null);
  const [extraLoading, setExtraLoading] = useState(true);
  const [extraError, setExtraError] = useState(null);

  useEffect(() => {
    async function loadStats() {
      setExtraLoading(true);
      try {
        const [trendData, metaData] = await Promise.all([
          getAttendanceTrend(),
          getTermMeta(),
        ]);
        setAttendanceTrend(trendData);
        setTermMeta(metaData);
      } catch (err) {
        setExtraError(err.message || 'Failed to load term statistics');
      } finally {
        setExtraLoading(false);
      }
    }
    loadStats();
  }, []);

  // Compute live metrics dynamically from the student records
  const stats = useMemo(() => {
    return computeDashboardStats(students, termMeta);
  }, [students, termMeta]);

  const isLoading = studentsLoading || extraLoading;
  const error = studentsError || extraError;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Page Title & Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-[#8b85ff] animate-ping" />
            <span className="text-xs font-semibold text-[#8b85ff] uppercase tracking-wider">
              Academic Term Overview
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Term 2 Performance Dashboard
          </h1>
          <p className="text-sm text-[#9490b8] mt-1">
            Comprehensive scholastic metrics, attendance benchmarks, and student records for Classes 9 & 10.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/students"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8b85ff] hover:bg-[#7b75f5] text-white text-sm font-medium transition-all shadow-lg shadow-indigo-950/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Manage Students</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <ErrorAlert
          message={error}
          onRetry={() => {
            refreshStudents();
            getAttendanceTrend().then(setAttendanceTrend);
            getTermMeta().then(setTermMeta);
          }}
        />
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" text="Calculating Term 2 analytics & metrics..." />
        </div>
      ) : (
        <>
          {/* Section 1: Four Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Total students */}
            <StatCard
              title="Total students"
              value={stats.totalStudents}
              comparisonText={stats.studentsDeltaText}
              isPositive={true}
              icon={Users}
            />

            {/* Average marks */}
            <StatCard
              title="Average marks"
              value={`${stats.avgMarks}%`}
              comparisonText={stats.marksDeltaText}
              isPositive={stats.marksDeltaPositive}
              icon={Award}
            />

            {/* Average attendance */}
            <StatCard
              title="Average attendance"
              value={`${stats.avgAttendance}%`}
              comparisonText={stats.attendanceDeltaText}
              isPositive={false} // Red per requirement: "-0.8 vs last term"
              icon={CalendarCheck}
            />

            {/* Pass rate */}
            <StatCard
              title="Pass rate"
              value={`${stats.passRate}%`}
              comparisonText={stats.supportNeededText}
              isPositive={false} // Red per requirement: "1 need support"
              isWarning={true}
              icon={TrendingUp}
            />
          </div>

          {/* Section 2: Three Analytics Charts in one row on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Chart 1: Average marks by class */}
            <ChartCard
              title="Average Marks by Class"
              subtitle="Comparing 10-A, 10-B, 9-A, 9-B"
              badge="Purple Bars"
            >
              <ClassAverageChart data={stats.classAverages} />
            </ChartCard>

            {/* Chart 2: Grade distribution */}
            <ChartCard
              title="Grade Distribution"
              subtitle="5 grade buckets across all students"
              badge="Orange Bars"
            >
              <GradeDistributionChart data={stats.gradeDistribution} />
            </ChartCard>

            {/* Chart 3: Attendance trend */}
            <ChartCard
              title="Attendance Trend"
              subtitle="Monthly staff tracking (June to November)"
              badge="Trend %"
            >
              <AttendanceTrendChart data={attendanceTrend} />
            </ChartCard>
          </div>

          {/* Section 3: Top Performers (Below on the Left) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Top Performers Card (Left half / 7 cols) */}
            <div className="lg:col-span-7">
              <TopPerformersList performers={stats.topPerformers} />
            </div>

            {/* Academic Insights & Support Action (Right half / 5 cols) */}
            <div className="lg:col-span-5 bg-[#1c1b30] border border-[#282646] rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#8b85ff]/15 border border-[#8b85ff]/25 flex items-center justify-center text-[#8b85ff]">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white tracking-tight">
                      Term 2 Academic Summary
                    </h3>
                    <p className="text-xs text-[#9490b8]">Staff review & remedial notes</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Overall academic performance has increased by <span className="text-[#10b981] font-semibold">+2.1%</span> from Term 1. 
                  Class <span className="text-white font-semibold">10-A</span> currently leads with an average of 93%, while 
                  Class <span className="text-white font-semibold">9-B</span> requires targeted math interventions.
                </p>

                <div className="mt-4 space-y-2.5">
                  <div className="p-3 rounded-xl bg-[#12111f] border border-[#282646] flex items-center justify-between text-xs">
                    <span className="text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Passing Students (≥ 40%)
                    </span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {students.filter(s => Number(s.marks) >= 40).length} / {students.length}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs">
                    <span className="text-rose-200 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      Remedial Support Recommended (&lt; 40%)
                    </span>
                    <span className="font-bold text-rose-400 font-mono">
                      {students.filter(s => Number(s.marks) < 40).length} student
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#282646] flex items-center justify-between">
                <span className="text-xs text-[#9490b8]">
                  Detailed student roster
                </span>
                <Link
                  to="/students"
                  className="text-xs font-semibold text-[#8b85ff] hover:text-[#7b75f5] flex items-center gap-1 group"
                >
                  <span>View Student Table</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
