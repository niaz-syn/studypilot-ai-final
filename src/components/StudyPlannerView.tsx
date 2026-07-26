import React, { useState } from "react";
import {
  Compass,
  Plus,
  CalendarDays,
  Clock,
  CheckCircle2,
  Trash2,
  Edit2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Filter,
  X,
  Flame,
} from "lucide-react";
import { StudySession, Subject, Priority, SessionStatus } from "../types";

interface StudyPlannerViewProps {
  studySessions: StudySession[];
  subjects: Subject[];
  onCreateSession: (session: Omit<StudySession, "id" | "createdAt" | "userId">) => void;
  onUpdateSession: (session: StudySession) => void;
  onDeleteSession: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  studySessions,
  subjects,
  onCreateSession,
  onUpdateSession,
  onDeleteSession,
  onToggleComplete,
}) => {
  const [filterSubject, setFilterSubject] = useState<string>("ALL");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [priority, setPriority] = useState<Priority>("Medium");
  const [notes, setNotes] = useState("");

  // Pomodoro Focus Timer State
  const [activePomodoroSession, setActivePomodoroSession] = useState<StudySession | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (activePomodoroSession) {
        onToggleComplete(activePomodoroSession.id);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, activePomodoroSession]);

  const startPomodoro = (session: StudySession) => {
    setActivePomodoroSession(session);
    setTimerSeconds((session.durationMinutes || 25) * 60);
    setIsTimerRunning(true);
  };

  const handleOpenCreate = () => {
    setEditingSession(null);
    setTitle("");
    setSubjectId(subjects[0]?.id || "");
    setDate(new Date().toISOString().split("T")[0]);
    setDurationMinutes(60);
    setPriority("Medium");
    setNotes("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (session: StudySession) => {
    setEditingSession(session);
    setTitle(session.title || "");
    setSubjectId(session.subjectId);
    setDate(session.date);
    setDurationMinutes(session.durationMinutes);
    setPriority(session.priority);
    setNotes(session.notes || "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSession) {
      onUpdateSession({
        ...editingSession,
        title,
        subjectId,
        date,
        durationMinutes,
        priority,
        notes,
      });
    } else {
      onCreateSession({
        title: title || "Study Session",
        subjectId,
        date,
        durationMinutes,
        priority,
        status: "Scheduled",
        notes,
      });
    }
    setIsModalOpen(false);
  };

  const filteredSessions = (studySessions || []).filter((s) => {
    if (filterSubject !== "ALL" && s.subjectId !== filterSubject) return false;
    if (filterPriority !== "ALL" && s.priority !== filterPriority) return false;
    return true;
  });

  const getSubject = (subId: string) => (subjects || []).find((s) => s.id === subId);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <Compass className="w-8 h-8 text-indigo-600" />
            <span>Study Planner</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize study blocks, track durations, and run focus Pomodoro sessions.
          </p>
        </div>

        <button
          id="planner-create-btn"
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Study Session</span>
        </button>
      </div>

      {/* Active Pomodoro Timer Widget Banner (if open) */}
      {activePomodoroSession && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-2xl border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 flex items-center justify-center text-indigo-400 border border-indigo-400/30">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-indigo-300">Live Pomodoro Session</span>
              <h3 className="text-lg font-bold text-white">{activePomodoroSession.title || "Focus Block"}</h3>
              <p className="text-xs text-slate-300">Subject: {getSubject(activePomodoroSession.subjectId)?.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-4xl sm:text-5xl font-mono font-extrabold text-white tracking-widest">
              {formatTimer(timerSeconds)}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg transition"
              >
                {isTimerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button
                onClick={() => {
                  setTimerSeconds((activePomodoroSession.durationMinutes || 25) * 60);
                  setIsTimerRunning(false);
                }}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActivePomodoroSession(null)}
                className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">All Subjects</option>
            {(subjects || []).map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Study Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((session) => {
          const subject = getSubject(session.subjectId);
          const isCompleted = session.status === "Completed";

          return (
            <div
              key={session.id}
              className={`p-6 rounded-3xl border transition flex flex-col justify-between space-y-4 ${
                isCompleted
                  ? "bg-slate-50/50 dark:bg-slate-900/40 border-emerald-200 dark:border-emerald-900/40 opacity-75"
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:shadow-lg"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: subject?.color || "#4F46E5" }}
                    />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {subject?.name || "General"}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      session.priority === "High"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        : session.priority === "Medium"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {session.priority}
                  </span>
                </div>

                <h3
                  className={`text-base font-bold ${
                    isCompleted ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white"
                  }`}
                >
                  {session.title || "Study Block"}
                </h3>

                {session.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{session.notes}</p>
                )}

                <div className="mt-4 flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center space-x-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>{session.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{session.durationMinutes} mins</span>
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onToggleComplete(session.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                      isCompleted
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isCompleted ? "Completed" : "Mark Done"}</span>
                  </button>

                  {!isCompleted && (
                    <button
                      onClick={() => startPomodoro(session)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold transition flex items-center space-x-1"
                    >
                      <Play className="w-3 h-3" />
                      <span>Pomodoro</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEdit(session)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteSession(session.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Create/Edit Session */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {editingSession ? "Edit Study Session" : "Schedule New Study Session"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Graph Algorithms BFS & DFS Review"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    {(subjects || []).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="15"
                    max="300"
                    step="15"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Notes / Goals</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specific topics to cover or goals for this block..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25"
                >
                  {editingSession ? "Save Changes" : "Schedule Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
