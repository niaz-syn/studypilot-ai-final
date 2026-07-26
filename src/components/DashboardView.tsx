import React, { useState } from "react";
import {
  Sparkles,
  Compass,
  CheckSquare,
  BookOpen,
  CalendarDays,
  Flame,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  TrendingUp,
  Quote,
  HelpCircle,
  FileText,
  AlertCircle,
  Brain,
  Target,
  Zap,
  RotateCw,
  Award,
  UploadCloud,
  ChevronRight,
  BarChart3,
  ListTodo,
  Layers,
  GraduationCap,
} from "lucide-react";
import {
  UserProfile,
  Subject,
  Assignment,
  StudySession,
  AIHistoryItem,
  ActiveTab,
  UploadedFile,
  NoteItem,
  FlashcardDeck,
} from "../types";
import { MOTIVATIONAL_QUOTES } from "../lib/store";
import { OnboardingWizard } from "./OnboardingWizard";

interface DashboardViewProps {
  user: UserProfile;
  subjects: Subject[];
  assignments: Assignment[];
  studySessions: StudySession[];
  files: UploadedFile[];
  notes: NoteItem[];
  decks: FlashcardDeck[];
  aiHistory: AIHistoryItem[];
  setActiveTab: (tab: ActiveTab) => void;
  onToggleSessionComplete: (id: string) => void;
  onToggleAssignmentComplete: (id: string) => void;
  onOpenCreateSession: () => void;
  onOpenCreateAssignment: () => void;
  onUpdateUser?: (props: Partial<UserProfile>) => void;
  onCreateSubject?: (sub: Omit<Subject, "id" | "createdAt" | "userId">) => void;
  onCreateAssignment?: (ass: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  subjects,
  assignments,
  studySessions,
  files,
  notes,
  decks,
  aiHistory,
  setActiveTab,
  onToggleSessionComplete,
  onToggleAssignmentComplete,
  onOpenCreateSession,
  onOpenCreateAssignment,
  onUpdateUser,
  onCreateSubject,
  onCreateAssignment,
}) => {
  const [showOnboarding, setShowOnboarding] = useState(subjects.length === 0);

  // Quote Index
  const [quoteIndex, setQuoteIndex] = useState(0);
  const dailyQuote = MOTIVATIONAL_QUOTES[quoteIndex % MOTIVATIONAL_QUOTES.length];

  // AI Productivity & Exam Readiness state
  const [examReadinessData, setExamReadinessData] = useState<any>(null);
  const [isLoadingExamReadiness, setIsLoadingExamReadiness] = useState(false);

  const [productivityInsights, setProductivityInsights] = useState<any>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  // Assignment breakdown modal
  const [breakdownModalAssignment, setBreakdownModalAssignment] = useState<Assignment | null>(null);
  const [assignmentBreakdown, setAssignmentBreakdown] = useState<any>(null);
  const [isLoadingBreakdown, setIsLoadingBreakdown] = useState(false);

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Formatted date string
  const formattedTodayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Derived metrics
  const todayStr = new Date().toISOString().split("T")[0];
  const todaySessions = (studySessions || []).filter((s) => s.date === todayStr);

  const pendingAssignments = (assignments || []).filter((a) => a.status !== "Completed");
  const upcomingDeadlines = [...pendingAssignments]
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 4);

  const completedAssignmentsCount = (assignments || []).filter((a) => a.status === "Completed").length;

  const totalMinutesThisWeek = (studySessions || []).reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const totalHoursThisWeek = (totalMinutesThisWeek / 60).toFixed(1);

  const getSubject = (subId: string) => (subjects || []).find((s) => s.id === subId);

  // Calculate default exam readiness score
  const overallReadiness = Math.min(
    96,
    Math.max(62, Math.round((completedAssignmentsCount / (assignments.length || 1)) * 40 + (user.currentStreak * 3) + 35))
  );

  // Handle AI Exam Readiness call
  const handleFetchExamReadiness = async () => {
    setIsLoadingExamReadiness(true);
    try {
      const subjectsPayload = subjects.map((sub) => {
        const subAssignments = assignments.filter((a) => a.subjectId === sub.id);
        const subSessions = studySessions.filter((s) => s.subjectId === sub.id);
        return {
          subjectName: sub.name,
          completedTasks: subAssignments.filter((a) => a.status === "Completed").length,
          totalTasks: subAssignments.length,
          studySessionsCount: subSessions.length,
        };
      });

      const res = await fetch("/api/ai/exam-readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectsData: subjectsPayload }),
      });
      const data = await res.json();
      if (res.ok) {
        setExamReadinessData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingExamReadiness(false);
    }
  };

  // Handle AI Productivity Insights
  const handleFetchProductivityInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const res = await fetch("/api/ai/productivity-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          streak: user.currentStreak,
          totalHours: totalHoursThisWeek,
          completedAssignments: completedAssignmentsCount,
          pendingAssignments: pendingAssignments.length,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProductivityInsights(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  // Handle Assignment Breakdown
  const handleBreakdownAssignment = async (assignment: Assignment) => {
    setBreakdownModalAssignment(assignment);
    setIsLoadingBreakdown(true);
    setAssignmentBreakdown(null);

    try {
      const subject = getSubject(assignment.subjectId)?.name || "General";
      const res = await fetch("/api/ai/assignment-breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentTitle: assignment.title,
          description: assignment.description,
          deadline: assignment.deadline,
          subject,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAssignmentBreakdown(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingBreakdown(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-7xl mx-auto">
      {showOnboarding && onUpdateUser && onCreateSubject && onCreateAssignment && (
        <OnboardingWizard
          user={user}
          onUpdateUser={onUpdateUser}
          onCreateSubject={onCreateSubject}
          onCreateAssignment={onCreateAssignment}
          onFinishOnboarding={() => setShowOnboarding(false)}
        />
      )}

      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 md:p-10 shadow-2xl border border-indigo-900/40">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Row: Date & Streak Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <CalendarDays className="w-4 h-4 text-indigo-400" />
              <span>{formattedTodayDate}</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold backdrop-blur-md">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                <span>{user.currentStreak} Day Study Streak</span>
              </div>
              <button
                onClick={() => setQuoteIndex((prev) => prev + 1)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition"
                title="Next Quote"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Main Greeting & Motivational Quote */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
                {getGreeting()}, <span className="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">{user.displayName || "Scholar"}</span>
              </h1>

              <div className="flex items-start space-x-3 pt-1 text-indigo-100 max-w-2xl bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <Quote className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs sm:text-sm italic font-medium text-slate-200">
                    "{dailyQuote.quote}"
                  </p>
                  <p className="text-[11px] font-bold text-indigo-300">
                    — {dailyQuote.author} <span className="opacity-60">({dailyQuote.category})</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Current Study Goal Widget */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-200">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span>Current Study Goal</span>
                </div>
                <span className="text-xs font-bold text-emerald-400">
                  {totalHoursThisWeek} / {user.weeklyGoalHours} hrs
                </span>
              </div>
              <div className="w-full bg-slate-900/60 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (parseFloat(totalHoursThisWeek) / user.weeklyGoalHours) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-300 text-right font-medium">
                {(user.weeklyGoalHours - parseFloat(totalHoursThisWeek)).toFixed(1)} hrs remaining this week
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="dash-start-session-btn"
              onClick={onOpenCreateSession}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs sm:text-sm hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/30 transition flex items-center space-x-2"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Start Study Session</span>
            </button>

            <button
              id="dash-upload-notes-btn"
              onClick={() => setActiveTab("uploads")}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition flex items-center space-x-2"
            >
              <UploadCloud className="w-4 h-4 text-cyan-300" />
              <span>Upload Notes & Docs</span>
            </button>

            <button
              id="dash-generate-quiz-btn"
              onClick={() => setActiveTab("quiz")}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition flex items-center space-x-2"
            >
              <HelpCircle className="w-4 h-4 text-purple-300" />
              <span>Generate AI Quiz</span>
            </button>

            <button
              id="dash-ask-ai-btn"
              onClick={() => setActiveTab("ai-assistant")}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-pink-300" />
              <span>Ask AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Weekly Hours</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalHoursThisWeek} <span className="text-xs font-normal text-slate-400">hrs</span>
          </div>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
            Target: {user.weeklyGoalHours} hrs/week
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Study Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {user.currentStreak} <span className="text-xs font-normal text-slate-400">Days</span>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
            Active Momentum
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Exam Readiness</span>
            <GraduationCap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {examReadinessData ? examReadinessData.overallReadinessScore : overallReadiness}%
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Estimated Mastery
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pending Tasks</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {pendingAssignments.length} <span className="text-xs font-normal text-slate-400">Tasks</span>
          </div>
          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">
            {upcomingDeadlines.length > 0 ? `Next: ${upcomingDeadlines[0].deadline}` : "All clear"}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {completedAssignmentsCount} <span className="text-xs font-normal text-slate-400">Done</span>
          </div>
          <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold mt-1">
            Course Milestones
          </p>
        </div>
      </div>

      {/* Main 2-Column Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Spans) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Study Plan */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-indigo-600" />
                  <span>Today's Study Plan</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {todaySessions.length} session{todaySessions.length !== 1 ? "s" : ""} scheduled for today
                </p>
              </div>
              <button
                onClick={() => setActiveTab("planner")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center space-x-1"
              >
                <span>View Full Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todaySessions.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <Compass className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No study sessions scheduled for today.</p>
                <button
                  onClick={onOpenCreateSession}
                  className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
                >
                  Schedule A Study Session
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {todaySessions.map((s) => {
                  const subject = getSubject(s.subjectId);
                  const isCompleted = s.status === "Completed";
                  return (
                    <div
                      key={s.id}
                      className={`p-4 rounded-2xl border transition flex items-center justify-between ${
                        isCompleted
                          ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50"
                          : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => onToggleSessionComplete(s.id)}
                          className={`mt-0.5 p-1 rounded-lg border transition ${
                            isCompleted
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "border-slate-300 dark:border-slate-600 text-transparent hover:border-indigo-500"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4 fill-current" />
                        </button>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: subject?.color || "#4F46E5" }}
                            />
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                              {subject?.name || "General"}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {s.durationMinutes} min
                            </span>
                          </div>
                          <h3
                            className={`text-sm font-bold mt-1 ${
                              isCompleted ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {s.title || "Study Session"}
                          </h3>
                          {s.notes && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.notes}</p>}
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          s.priority === "High"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                            : s.priority === "Medium"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {s.priority}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 🎓 Exam Readiness Score Breakdown */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <span>Exam Readiness Score</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  AI estimation of subject readiness based on completed tasks & study logs
                </p>
              </div>

              <button
                onClick={handleFetchExamReadiness}
                disabled={isLoadingExamReadiness}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoadingExamReadiness ? "Analyzing..." : "AI Recalculate"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map((sub) => {
                const subReadiness = examReadinessData?.subjectScores?.find(
                  (s: any) => s.subjectName.toLowerCase() === sub.name.toLowerCase()
                );
                const score = subReadiness ? subReadiness.score : Math.min(95, Math.max(60, 75 + sub.name.length * 3));

                return (
                  <div
                    key={sub.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: sub.color }} />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{sub.name}</span>
                      </div>
                      <span
                        className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                          score >= 80
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : score >= 70
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        }`}
                      >
                        {score}% Ready
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${score}%`,
                          backgroundColor: sub.color,
                        }}
                      />
                    </div>

                    {subReadiness?.actionableAdvice && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                        💡 {subReadiness.actionableAdvice}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Assignments & AI Subtask Assistant */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                  <CheckSquare className="w-5 h-5 text-purple-600" />
                  <span>Upcoming Assignments</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {pendingAssignments.length} pending task{pendingAssignments.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenCreateAssignment}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
                <button
                  onClick={() => setActiveTab("assignments")}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  View All
                </button>
              </div>
            </div>

            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">All assignments completed! 🎉</p>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((a) => {
                  const subject = getSubject(a.subjectId);
                  return (
                    <div
                      key={a.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => onToggleAssignmentComplete(a.id)}
                          className="mt-0.5 p-1 rounded-lg border border-slate-300 dark:border-slate-600 text-transparent hover:border-purple-500 transition"
                        >
                          <CheckCircle2 className="w-4 h-4 fill-current" />
                        </button>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: subject?.color || "#7C3AED" }}
                            />
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                              {subject?.name || "General"}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{a.title}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Due: {a.deadline}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 justify-end">
                        <button
                          onClick={() => handleBreakdownAssignment(a)}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-bold transition flex items-center space-x-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Breakdown</span>
                        </button>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            a.priority === "High"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                              : "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                          }`}
                        >
                          {a.priority}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Span) */}
        <div className="space-y-8">
          {/* 📈 Productivity Insights Widget */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>Productivity Insights</span>
              </h2>
              <button
                onClick={handleFetchProductivityInsights}
                disabled={isLoadingInsights}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                {isLoadingInsights ? "Updating..." : "Refresh"}
              </button>
            </div>

            {productivityInsights ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                  <div className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    Focus Score: {productivityInsights.focusScore}/100
                  </div>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1 font-medium">
                    {productivityInsights.insightHeadline}
                  </p>
                </div>

                <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                  <p><span className="font-bold text-slate-900 dark:text-white">Top Habit:</span> {productivityInsights.topHabit}</p>
                  <p><span className="font-bold text-slate-900 dark:text-white">Time Block:</span> {productivityInsights.suggestedTimeBlock}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center space-y-2">
                <p className="text-xs text-slate-500">Get tailored habit feedback from Gemini AI.</p>
                <button
                  onClick={handleFetchProductivityInsights}
                  disabled={isLoadingInsights}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
                >
                  {isLoadingInsights ? "Generating..." : "Generate AI Insights"}
                </button>
              </div>
            )}
          </div>

          {/* Your Subjects */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Your Subjects</span>
              </h2>
              <button
                onClick={() => setActiveTab("subjects")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {(subjects || []).map((sub) => {
                const subTasks = (assignments || []).filter((a) => a.subjectId === sub.id);
                return (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 transition flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm"
                        style={{ backgroundColor: sub.color }}
                      >
                        {sub.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{sub.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{sub.teacher || "Faculty"}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {subTasks.length} Task{subTasks.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Uploaded Files */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-cyan-600" />
                <span>Recent Uploads</span>
              </h2>
              <button
                onClick={() => setActiveTab("uploads")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Upload Center
              </button>
            </div>

            <div className="space-y-2">
              {(files || []).slice(0, 3).map((file) => (
                <div
                  key={file.id}
                  onClick={() => setActiveTab("uploads")}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <FileText className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {file.name}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Breakdown Modal */}
      {breakdownModalAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  AI Assignment Assistant
                </h3>
              </div>
              <button
                onClick={() => setBreakdownModalAssignment(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="text-sm font-bold text-purple-600">{breakdownModalAssignment.title}</h4>
              <p className="text-xs text-slate-500 mt-1">Due Date: {breakdownModalAssignment.deadline}</p>
            </div>

            {isLoadingBreakdown ? (
              <div className="py-12 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Gemini AI is generating step-by-step subtasks...
                </p>
              </div>
            ) : assignmentBreakdown ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Estimated Total Effort: <span className="font-bold text-purple-600">{assignmentBreakdown.estimatedTotalMinutes} mins</span>
                </p>

                <div className="space-y-2">
                  {assignmentBreakdown.subtasks?.map((st: any, idx: number) => (
                    <div
                      key={st.id || idx}
                      className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/50 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                        <span>{idx + 1}. {st.title}</span>
                        <span className="text-purple-600 dark:text-purple-300">{st.estimatedMinutes} mins</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">{st.details}</p>
                    </div>
                  ))}
                </div>

                {assignmentBreakdown.proTip && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-200">
                    <span className="font-bold">Pro Tip:</span> {assignmentBreakdown.proTip}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Failed to load breakdown. Try again.</p>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setBreakdownModalAssignment(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
