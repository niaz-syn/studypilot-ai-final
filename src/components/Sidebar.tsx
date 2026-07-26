import React from "react";
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  BookOpen,
  Calendar,
  Sparkles,
  HelpCircle,
  FileText,
  FileSearch,
  Upload,
  BarChart3,
  User,
  Settings,
  Flame,
  ChevronRight,
  Clock,
  Award,
  X,
  Plus,
} from "lucide-react";
import { ActiveTab, Subject } from "../types";

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  subjects: Subject[];
  currentStreak: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenCreateSession: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  subjects,
  currentStreak,
  isMobileOpen,
  onCloseMobile,
  onOpenCreateSession,
}) => {
  const mainNav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "planner", label: "Study Planner", icon: CalendarDays },
    { id: "assignments", label: "Assignments", icon: CheckSquare },
    { id: "subjects", label: "Subjects", icon: BookOpen },
    { id: "calendar", label: "Calendar", icon: Calendar },
  ];

  const aiToolsNav = [
    { id: "uploads", label: "Upload Center", icon: Upload, badge: "Docs" },
    { id: "summarizer", label: "AI Summarizer", icon: FileSearch, badge: "AI" },
    { id: "quiz", label: "Quiz Generator", icon: HelpCircle, badge: "AI" },
    { id: "notes", label: "Notes & Checklists", icon: FileText },
    { id: "ai-assistant", label: "AI Assistant", icon: Sparkles, badge: "Pro" },
  ];

  const secondaryNav = [
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => handleNavClick("dashboard")}
            className="flex items-center space-x-3 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white block leading-tight">
                StudyPilot <span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block tracking-wider uppercase">
                Student OS
              </span>
            </div>
          </button>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              onOpenCreateSession();
              onCloseMobile();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center space-x-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Study Session</span>
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {/* Main Workspace Section */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Workspace
            </div>
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as ActiveTab)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* AI Tools Section */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              AI & Learning Tools
            </div>
            <nav className="space-y-1">
              {aiToolsNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as ActiveTab)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Subjects Shortcuts */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Enrolled Subjects
              </span>
              <button
                onClick={() => handleNavClick("subjects")}
                className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Manage
              </button>
            </div>
            <div className="space-y-1">
              {(subjects || []).map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleNavClick("subjects")}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sub.color || "#6366F1" }}
                  />
                  <span className="truncate text-left font-medium">{sub.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Performance & Account */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Account & Performance
            </div>
            <nav className="space-y-1">
              {secondaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as ActiveTab)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Streak Badge */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {currentStreak} Day Streak!
                </div>
                <div className="text-[10px] text-slate-500">Keep learning daily</div>
              </div>
            </div>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
        </div>
      </aside>
    </>
  );
};
