import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  Timer,
  Play,
  Pause,
  RotateCcw,
  User,
  LogOut,
  Settings,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { ActiveTab, UserProfile, Assignment } from "../types";

interface TopNavProps {
  user: UserProfile;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
  onOpenPomodoro?: () => void;
  assignments: Assignment[];
}

export const TopNav: React.FC<TopNavProps> = ({
  user,
  activeTab,
  setActiveTab,
  darkMode,
  onToggleDarkMode,
  onOpenMobileSidebar,
  onOpenSearch,
  onOpenPomodoro,
  assignments,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Pomodoro Mini Timer State
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTimerPopover, setShowTimerPopover] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      alert("Pomodoro Focus Session Complete! Time for a 5-minute break.");
      setPomodoroSeconds(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroSeconds]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Urgent upcoming assignments for notifications
  const upcomingAssignments = (assignments || []).filter(
    (a) => a.status !== "Completed"
  );

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu + Search Bar */}
        <div className="flex items-center space-x-3 flex-1 max-w-xl">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Global Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="w-full py-2 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-medium flex items-center justify-between transition group"
          >
            <div className="flex items-center space-x-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition" />
              <span>Search assignments, subjects, notes, files & AI...</span>
            </div>
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Pomodoro Quick Timer Widget */}
          <div className="relative">
            <button
              onClick={() => {
                if (onOpenPomodoro) {
                  onOpenPomodoro();
                } else {
                  setShowTimerPopover(!showTimerPopover);
                }
              }}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition"
            >
              <Timer className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="tabular-nums">{formatTimer(pomodoroSeconds)}</span>
            </button>

            {/* Timer Popover */}
            {showTimerPopover && (
              <div className="absolute right-0 mt-2 w-64 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <Timer className="w-4 h-4 text-indigo-500" />
                    <span>Pomodoro Focus Timer</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-bold">
                    25 Min
                  </span>
                </div>

                <div className="text-3xl font-black text-center text-slate-900 dark:text-white my-3 tabular-nums tracking-tight">
                  {formatTimer(pomodoroSeconds)}
                </div>

                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setPomodoroSeconds(25 * 60);
                    }}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Switcher */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
            >
              <Bell className="w-4 h-4" />
              {upcomingAssignments.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Study Notifications ({upcomingAssignments.length})
                  </span>
                  <button
                    onClick={() => setActiveTab("assignments")}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {upcomingAssignments.slice(0, 4).map((a) => (
                    <div
                      key={a.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs flex items-start space-x-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {a.title}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Due: {a.deadline} • Priority: {a.priority}
                        </div>
                      </div>
                    </div>
                  ))}
                  {upcomingAssignments.length === 0 && (
                    <div className="text-center py-4 text-xs text-slate-400">
                      No pending deadlines! You're caught up.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <img
                src={user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                alt={user.displayName}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/20"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50">
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user.displayName}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("settings");
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition font-medium"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Profile & Settings</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("analytics");
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition font-medium"
                >
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Learning Analytics</span>
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setActiveTab("landing");
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
