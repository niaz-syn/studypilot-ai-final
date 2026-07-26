import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  User,
  Award,
  FileText,
  Edit2,
  Trash2,
  X,
  Palette,
} from "lucide-react";
import { Subject, Assignment, StudySession } from "../types";

interface SubjectsViewProps {
  subjects: Subject[];
  assignments: Assignment[];
  studySessions: StudySession[];
  onCreateSubject: (subject: Omit<Subject, "id" | "createdAt" | "userId">) => void;
  onUpdateSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  subjects,
  assignments,
  studySessions,
  onCreateSubject,
  onUpdateSubject,
  onDeleteSubject,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [color, setColor] = useState("#4F46E5");
  const [teacher, setTeacher] = useState("");
  const [credits, setCredits] = useState(3);
  const [description, setDescription] = useState("");

  const presetColors = [
    "#4F46E5", // Indigo
    "#7C3AED", // Violet
    "#06B6D4", // Cyan
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#EC4899", // Pink
    "#EF4444", // Red
    "#3B82F6", // Blue
  ];

  const handleOpenCreate = () => {
    setEditingSubject(null);
    setName("");
    setColor("#4F46E5");
    setTeacher("");
    setCredits(3);
    setDescription("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub: Subject) => {
    setEditingSubject(sub);
    setName(sub.name);
    setColor(sub.color);
    setTeacher(sub.teacher || "");
    setCredits(sub.credits || 3);
    setDescription(sub.description || "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubject) {
      onUpdateSubject({
        ...editingSubject,
        name,
        color,
        teacher,
        credits,
        description,
      });
    } else {
      onCreateSubject({
        name,
        color,
        teacher,
        credits,
        description,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <span>Academic Subjects</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage course modules, professors, credit weighting, and color themes.
          </p>
        </div>

        <button
          id="subjects-create-btn"
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Subjects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(subjects || []).map((sub) => {
          const relatedAssignments = (assignments || []).filter((a) => a.subjectId === sub.id);
          const relatedSessions = (studySessions || []).filter((s) => s.subjectId === sub.id);
          const totalMinutes = relatedSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

          return (
            <div
              key={sub.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              {/* Top Accent Color Strip */}
              <div
                className="absolute top-0 left-0 right-0 h-2"
                style={{ backgroundColor: sub.color }}
              />

              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm"
                    style={{ backgroundColor: sub.color }}
                  >
                    {sub.name.slice(0, 2).toUpperCase()}
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {sub.credits || 3} Credit Hours
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{sub.name}</h3>

                {sub.teacher && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Prof. {sub.teacher}</span>
                  </p>
                )}

                {sub.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                    {sub.description}
                  </p>
                )}
              </div>

              {/* Stats Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{relatedAssignments.length}</span> Tasks
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{(totalMinutes / 60).toFixed(1)}</span> Hrs
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenEdit(sub)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteSubject(sub.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Create / Edit Subject */}
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
              {editingSubject ? "Edit Subject" : "Add New Subject"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cognitive Psychology"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Professor / Teacher</label>
                  <input
                    type="text"
                    value={teacher}
                    onChange={(e) => setTeacher(e.target.value)}
                    placeholder="e.g. Dr. Oliver Sacks"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Credit Points</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Color Theme</label>
                <div className="flex items-center space-x-2">
                  {presetColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition ${
                        color === c ? "border-slate-900 dark:border-white scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description / Syllabus</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Course summary or syllabus highlights..."
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
                  {editingSubject ? "Save Subject" : "Add Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
