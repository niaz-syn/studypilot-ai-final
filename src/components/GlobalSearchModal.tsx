import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  FileText,
  BookOpen,
  CheckSquare,
  Sparkles,
  HelpCircle,
  FileSearch,
  Upload,
  ArrowRight,
} from "lucide-react";
import {
  Assignment,
  Subject,
  UploadedFile,
  NoteItem,
  ActiveTab,
  FlashcardDeck,
} from "../types";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignments: Assignment[];
  subjects: Subject[];
  files: UploadedFile[];
  notes: NoteItem[];
  decks: FlashcardDeck[];
  setActiveTab: (tab: ActiveTab) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  assignments,
  subjects,
  files,
  notes,
  decks,
  setActiveTab,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedAssignments = q
    ? (assignments || []).filter(
        (a) => a.title.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q)
      )
    : (assignments || []).slice(0, 3);

  const matchedSubjects = q
    ? (subjects || []).filter(
        (s) => s.name.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
      )
    : (subjects || []).slice(0, 3);

  const matchedFiles = q
    ? (files || []).filter(
        (f) =>
          f.name.toLowerCase().includes(q) || (f.textContent && f.textContent.toLowerCase().includes(q))
      )
    : (files || []).slice(0, 3);

  const matchedNotes = q
    ? (notes || []).filter(
        (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      )
    : (notes || []).slice(0, 3);

  const matchedDecks = q
    ? (decks || []).filter((d) => d.title.toLowerCase().includes(q))
    : (decks || []).slice(0, 3);

  const handleSelect = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-3">
          <Search className="w-5 h-5 text-indigo-500" />
          <input
            type="text"
            autoFocus
            placeholder="Search tasks, documents, notes, flashcards, subjects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {/* Files */}
          {matchedFiles.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Upload className="w-3.5 h-3.5 text-indigo-500" />
                <span>Uploaded Learning Materials ({matchedFiles.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => handleSelect("uploads")}
                    className="w-full p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between text-left transition group"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                        {file.type}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {file.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          Uploaded: {file.uploadDate}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Assignments */}
          {matchedAssignments.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                <span>Assignments & Deadlines ({matchedAssignments.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedAssignments.map((ass) => (
                  <button
                    key={ass.id}
                    onClick={() => handleSelect("assignments")}
                    className="w-full p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between text-left transition group"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                        {ass.priority[0]}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {ass.title}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          Deadline: {ass.deadline} • {ass.status}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {matchedNotes.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-500" />
                <span>Saved Notes & Checklists ({matchedNotes.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => handleSelect("notes")}
                    className="w-full p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between text-left transition group"
                  >
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {note.title}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {note.content}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subjects */}
          {matchedSubjects.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                <span>Enrolled Subjects ({matchedSubjects.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedSubjects.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleSelect("subjects")}
                    className="w-full p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between text-left transition group"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: sub.color }}
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {sub.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          Instructor: {sub.teacher || "N/A"}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Press ESC to exit</span>
          <span className="font-semibold text-indigo-500">StudyPilot AI Search</span>
        </div>
      </div>
    </div>
  );
};
