import React, { useState } from "react";
import {
  Settings,
  User,
  Moon,
  Sun,
  Bell,
  Globe,
  Clock,
  LogOut,
  Save,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { UserProfile } from "../types";

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) => {
  const [displayName, setDisplayName] = useState(user.displayName || "Student");
  const [university, setUniversity] = useState(user.university || "State University");
  const [degreeProgram, setDegreeProgram] = useState(user.degreeProgram || "Computer Science");
  const [semester, setSemester] = useState(user.semester || "Fall Semester");
  const [timeZone, setTimeZone] = useState(user.timeZone || "UTC-5 (Eastern Time)");
  const [photoURL, setPhotoURL] = useState(user.photoURL || "");
  const [weeklyGoalHours, setWeeklyGoalHours] = useState(user.weeklyGoalHours || 15);
  const [notifications, setNotifications] = useState(user.notifications ?? true);
  const [language, setLanguage] = useState(user.language || "English");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      displayName,
      university,
      degreeProgram,
      semester,
      timeZone,
      photoURL,
      weeklyGoalHours,
      notifications,
      language,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
          <Settings className="w-8 h-8 text-indigo-600" />
          <span>Account & App Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your study preferences, targets, theme, and profile parameters.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <User className="w-4 h-4 text-indigo-500" />
            <span>Profile Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">University / College</label>
              <input
                type="text"
                placeholder="e.g. Stanford University"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Degree Program / Major</label>
              <input
                type="text"
                placeholder="e.g. Computer Science"
                value={degreeProgram}
                onChange={(e) => setDegreeProgram(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Semester / Academic Term</label>
              <input
                type="text"
                placeholder="e.g. Spring 2026 / Semester 4"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Time Zone</label>
              <input
                type="text"
                placeholder="e.g. UTC-5 (Eastern Time)"
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Profile Photo URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Study Goals & Preferences */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-500" />
            <span>Study Goals & Preferences</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Weekly Study Hours ({weeklyGoalHours} hrs/week)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={weeklyGoalHours}
                onChange={(e) => setWeeklyGoalHours(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">App Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appearance & Notifications Toggle */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Appearance & Notifications</span>
          </h2>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Dark Theme Mode</div>
                <div className="text-xs text-slate-500">Toggle dark visual mode for eye comfort</div>
              </div>
              <button
                type="button"
                onClick={onToggleDarkMode}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  darkMode ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    darkMode ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Deadline Reminders</div>
                <div className="text-xs text-slate-500">Get notified prior to assignment due dates</div>
              </div>
              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  notifications ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    notifications ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Submit & Logout Buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={onLogout}
            className="px-5 py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 font-bold text-xs hover:bg-rose-100 dark:hover:bg-rose-900/50 transition flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>

          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
