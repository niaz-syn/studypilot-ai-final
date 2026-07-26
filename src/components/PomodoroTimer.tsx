import React, { useState, useEffect } from "react";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Coffee,
  Brain,
  X,
  Volume2,
  Sparkles,
} from "lucide-react";
import { Subject } from "../types";

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onCompleteSession: (durationMinutes: number, subjectId?: string, title?: string) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  isOpen,
  onClose,
  subjects,
  onCompleteSession,
}) => {
  const [mode, setMode] = useState<"focus" | "shortBreak" | "longBreak">("focus");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || "");
  const [sessionTitle, setSessionTitle] = useState("Focus Sprint");

  // Duration in seconds according to mode
  const getModeDuration = (m: "focus" | "shortBreak" | "longBreak") => {
    if (m === "focus") return 25 * 60;
    if (m === "shortBreak") return 5 * 60;
    return 15 * 60;
  };

  const [secondsLeft, setSecondsLeft] = useState(getModeDuration("focus"));
  const [isRunning, setIsRunning] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  // Synchronize when mode changes
  const switchMode = (newMode: "focus" | "shortBreak" | "longBreak") => {
    setMode(newMode);
    setIsRunning(false);
    setSecondsLeft(getModeDuration(newMode));
  };

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === "focus") {
        setCompletedCount((prev) => prev + 1);
        onCompleteSession(25, selectedSubjectId, sessionTitle);
        alert("🎉 Excellent focus! 25-minute study session completed and added to your study logs.");
        switchMode("shortBreak");
      } else {
        alert("Break over! Ready to return to deep work?");
        switchMode("focus");
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, mode, selectedSubjectId, sessionTitle, onCompleteSession]);

  if (!isOpen) return null;

  const totalModeDuration = getModeDuration(mode);
  const progressPercent = ((totalModeDuration - secondsLeft) / totalModeDuration) * 100;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Pomodoro Focus Timer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <button
            onClick={() => switchMode("focus")}
            className={`py-2 rounded-xl transition ${
              mode === "focus"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Focus (25m)
          </button>
          <button
            onClick={() => switchMode("shortBreak")}
            className={`py-2 rounded-xl transition ${
              mode === "shortBreak"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => switchMode("longBreak")}
            className={`py-2 rounded-xl transition ${
              mode === "longBreak"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Subject & Title Selection */}
        {mode === "focus" && (
          <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                Study Session Title
              </label>
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {subjects.length > 0 && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Tag Subject
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Circular Display */}
        <div className="flex flex-col items-center justify-center py-4 space-y-3">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-100 dark:text-slate-800 fill-none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * progressPercent) / 100}
                strokeLinecap="round"
                className={`fill-none transition-all duration-1000 ${
                  mode === "focus"
                    ? "text-indigo-600"
                    : mode === "shortBreak"
                    ? "text-emerald-500"
                    : "text-purple-600"
                }`}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
                {formatTime(secondsLeft)}
              </span>
              <span className="text-xs font-bold text-slate-400 capitalize mt-1">
                {mode === "focus" ? "Deep Focus Mode" : "Rest & Recharge"}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center">
            Completed Pomodoros Today: <span className="font-bold text-indigo-600 dark:text-indigo-400">{completedCount}</span>
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-3 pt-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3.5 rounded-2xl text-white font-bold text-sm transition shadow-lg flex items-center space-x-2 ${
              mode === "focus"
                ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25"
                : mode === "shortBreak"
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25"
                : "bg-purple-600 hover:bg-purple-700 shadow-purple-500/25"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current ml-0.5" />
                <span>Start Timer</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setSecondsLeft(getModeDuration(mode));
            }}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
