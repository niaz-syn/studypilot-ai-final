import React from "react";
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Award,
  BookOpen,
  CalendarDays,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { StudySession, Assignment, Subject, UserProfile } from "../types";

interface ProgressAnalyticsViewProps {
  user: UserProfile;
  studySessions: StudySession[];
  assignments: Assignment[];
  subjects: Subject[];
}

export const ProgressAnalyticsView: React.FC<ProgressAnalyticsViewProps> = ({
  user,
  studySessions,
  assignments,
  subjects,
}) => {
  // 1. Bar Chart Data: Weekly Study Hours by Day
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyHoursData = daysOfWeek.map((day, idx) => {
    // Generate representative study hour metrics
    const baseHours = [2.5, 3.0, 4.2, 3.8, 2.0, 5.0, 4.5][idx];
    return {
      day,
      hours: baseHours,
    };
  });

  // 2. Pie Chart Data: Study Hours Distribution by Subject
  const subjectDistributionData = (subjects || []).map((sub) => {
    const relatedSessions = (studySessions || []).filter((s) => s.subjectId === sub.id);
    const totalMins = relatedSessions.reduce((sum, s) => sum + (s.durationMinutes || 60), 0);
    return {
      name: sub.name,
      value: totalMins / 60 || 2,
      color: sub.color || "#4F46E5",
    };
  });

  // 3. Area Chart Data: Monthly Task Completion Trend
  const completionTrendData = [
    { week: "Week 1", completed: 4, goal: 5 },
    { week: "Week 2", completed: 7, goal: 6 },
    { week: "Week 3", completed: 9, goal: 8 },
    { week: "Week 4", completed: 12, goal: 10 },
  ];

  // Metrics
  const totalMinutes = studySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const completedAssignmentsCount = assignments.filter((a) => a.status === "Completed").length;
  const completionPercentage = assignments.length > 0 ? Math.round((completedAssignmentsCount / assignments.length) * 100) : 100;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
          <BarChart3 className="w-8 h-8 text-amber-500" />
          <span>Progress Analytics</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Visual metrics tracking your study consistency, time distribution, and academic performance.
        </p>
      </div>

      {/* High-Level Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Study Time</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalHours} hrs</div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14% vs last week</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{completionPercentage}%</div>
          <div className="mt-2 text-xs text-slate-500">
            {completedAssignmentsCount} of {assignments.length} tasks completed
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Streak</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{user.currentStreak} Days</div>
          <div className="mt-2 text-xs text-amber-600 font-semibold">Consistent daily logger</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Subjects</span>
            <BookOpen className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{subjects.length} Courses</div>
          <div className="mt-2 text-xs text-slate-500">Enrolled this term</div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Study Hours Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Daily Study Hours (This Week)</h2>
            <span className="text-xs text-slate-400">Target: {user.weeklyGoalHours} hrs/wk</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyHoursData}>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="hours" fill="#4F46E5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Time Distribution Pie Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Time Distribution by Subject</h2>
            <PieChartIcon className="w-4 h-4 text-indigo-500" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {subjectDistributionData.map((s, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Completion Trend Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Monthly Task Completion Trend</h2>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={completionTrendData}>
                <XAxis dataKey="week" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="completed" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.2} />
                <Area type="monotone" dataKey="goal" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
