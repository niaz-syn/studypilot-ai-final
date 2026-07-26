import React from "react";
import {
  Compass,
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  BookOpen,
  Sparkles,
  BarChart3,
  Settings,
  Moon,
  Sun,
  User,
  LogOut,
  GraduationCap,
  Bell,
} from "lucide-react";
import { ActiveTab, UserProfile } from "../types";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) => {
  const isLanding = activeTab === "landing";

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; isAI?: boolean }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "planner", label: "Study Planner", icon: <Compass className="w-4 h-4" /> },
    { id: "assignments", label: "Assignments", icon: <CheckSquare className="w-4 h-4" /> },
    { id: "calendar", label: "Calendar", icon: <CalendarDays className="w-4 h-4" /> },
    { id: "subjects", label: "Subjects", icon: <BookOpen className="w-4 h-4" /> },
    { id: "ai-assistant", label: "AI Assistant", icon: <Sparkles className="w-4 h-4" />, isAI: true },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header
      id="main-app-header"
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        darkMode ? "bg-slate-900/90 border-slate-800 text-slate-100" : "bg-white/90 border-slate-200 text-slate-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("landing")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                StudyPilot AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                PRO
              </span>
            </div>
          </div>

          {/* Desktop Nav Links (When logged in / viewing app) */}
          {!isLanding && (
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? item.isAI
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                          : "bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : item.isAI
                        ? "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className={isActive && !item.isAI ? "text-indigo-600 dark:text-indigo-400" : ""}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Landing Nav Links */}
          {isLanding && (
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <button
                onClick={() => setActiveTab("landing")}
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition"
              >
                Home
              </button>
              <a
                href="#features-section"
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition"
              >
                Features
              </a>
              <a
                href="#preview-section"
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition"
              >
                Preview
              </a>
              <a
                href="#testimonials-section"
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition"
              >
                Testimonials
              </a>
            </nav>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {!isLanding && (
              <button
                id="settings-icon-btn"
                onClick={() => setActiveTab("settings")}
                className={`p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
                  activeTab === "settings" ? "bg-slate-100 dark:bg-slate-800 text-indigo-600" : ""
                }`}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}

            {/* Auth / Profile controls */}
            {user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                {isLanding && (
                  <button
                    id="dashboard-cta-btn"
                    onClick={() => setActiveTab("dashboard")}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition"
                  >
                    Go to Dashboard
                  </button>
                )}
                <div className="flex items-center space-x-2">
                  <img
                    src={user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full border-2 border-indigo-500 object-cover"
                  />
                  <span className="hidden md:inline-block text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                    {user.displayName}
                  </span>
                </div>
                <button
                  id="logout-btn"
                  onClick={onLogout}
                  className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  id="navbar-login-btn"
                  onClick={onOpenAuth}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Log In
                </button>
                <button
                  id="navbar-get-started-btn"
                  onClick={onOpenAuth}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white shadow-md shadow-indigo-500/25 transition"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Nav Submenu for App Tabs */}
        {!isLanding && (
          <div className="lg:hidden flex items-center overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 space-x-1 scrollbar-none">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={`mobile-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
