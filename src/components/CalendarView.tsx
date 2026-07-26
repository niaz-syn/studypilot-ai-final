import React, { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckSquare,
  Compass,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Assignment, StudySession, Subject } from "../types";

interface CalendarViewProps {
  assignments: Assignment[];
  studySessions: StudySession[];
  subjects: Subject[];
  onOpenCreateSession: () => void;
  onOpenCreateAssignment: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  assignments,
  studySessions,
  subjects,
  onOpenCreateSession,
  onOpenCreateAssignment,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(new Date().toISOString().split("T")[0]);

  const getSubject = (subId: string) => (subjects || []).find((s) => s.id === subId);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Days in month calculation
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Generate calendar days array
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const formattedDay = day.toString().padStart(2, "0");
    const formattedMonth = (month + 1).toString().padStart(2, "0");
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    calendarDays.push({ day, dateStr });
  }

  // Selected date items
  const selectedSessions = (studySessions || []).filter((s) => s.date === selectedDateStr);
  const selectedAssignments = (assignments || []).filter((a) => a.deadline === selectedDateStr);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <CalendarDays className="w-8 h-8 text-indigo-600" />
            <span>Academic Calendar</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Integrated schedule of study sessions, assignment deadlines, and exam milestones.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenCreateSession}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Session</span>
          </button>
          <button
            onClick={onOpenCreateAssignment}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Assignment</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Monthly Calendar Grid (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          {/* Month Header Nav */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {monthNames[month]} {year}
            </h2>

            <div className="flex items-center space-x-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCurrentDate(new Date());
                  setSelectedDateStr(new Date().toISOString().split("T")[0]);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((cell, idx) => {
              if (!cell) {
                return <div key={`empty-${idx}`} className="h-24 bg-slate-50/40 dark:bg-slate-900/40 rounded-2xl" />;
              }

              const { day, dateStr } = cell;
              const isSelected = dateStr === selectedDateStr;
              const isToday = dateStr === new Date().toISOString().split("T")[0];

              const daySessions = (studySessions || []).filter((s) => s.date === dateStr);
              const dayAssignments = (assignments || []).filter((a) => a.deadline === dateStr);

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-24 p-2 rounded-2xl border text-left flex flex-col justify-between transition relative overflow-hidden ${
                    isSelected
                      ? "ring-2 ring-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300"
                      : isToday
                      ? "bg-purple-50/50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800"
                      : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-extrabold ${
                        isToday
                          ? "w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {day}
                    </span>
                  </div>

                  {/* Badges indicators */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {daySessions.slice(0, 2).map((s) => (
                      <div
                        key={s.id}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded truncate bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                      >
                        {s.title || "Study"}
                      </div>
                    ))}
                    {dayAssignments.slice(0, 2).map((a) => (
                      <div
                        key={a.id}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded truncate bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                      >
                        Due: {a.title}
                      </div>
                    ))}
                    {daySessions.length + dayAssignments.length > 2 && (
                      <div className="text-[9px] font-bold text-slate-400 text-right">
                        +{daySessions.length + dayAssignments.length - 2} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Inspector Sidebar (1 Col) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Date Details
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{selectedDateStr}</h2>
          </div>

          {/* Study Sessions on Selected Date */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5 text-indigo-500" />
              <span>Study Sessions ({selectedSessions.length})</span>
            </h3>

            {selectedSessions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No study sessions on this date.</p>
            ) : (
              selectedSessions.map((s) => {
                const sub = getSubject(s.subjectId);
                return (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub?.color || "#4F46E5" }} />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{sub?.name}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {s.title || "Study Block"}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>{s.durationMinutes} mins • Priority: {s.priority}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Assignments Due on Selected Date */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
              <CheckSquare className="w-3.5 h-3.5 text-purple-500" />
              <span>Assignments Due ({selectedAssignments.length})</span>
            </h3>

            {selectedAssignments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No deadlines on this date.</p>
            ) : (
              selectedAssignments.map((a) => {
                const sub = getSubject(a.subjectId);
                return (
                  <div
                    key={a.id}
                    className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/60"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-700 dark:text-purple-300">{sub?.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                        {a.priority}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">{a.title}</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Status: {a.status}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
