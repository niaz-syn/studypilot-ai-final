import React, { useState } from "react";
import {
  FileText,
  Plus,
  Pin,
  Star,
  Trash2,
  Edit2,
  Search,
  Download,
  Tag,
  CheckSquare,
  Sparkles,
  BookOpen,
  X,
  Check,
} from "lucide-react";
import { NoteItem, Subject } from "../types";

interface NotesViewProps {
  notes: NoteItem[];
  subjects: Subject[];
  onCreateNote: (note: Omit<NoteItem, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateNote: (updatedNote: NoteItem) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  subjects,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "sub-1");
  const [tagsInput, setTagsInput] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  const handleOpenCreateModal = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setSubjectId(subjects[0]?.id || "sub-1");
    setTagsInput("");
    setIsPinned(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: NoteItem) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setSubjectId(note.subjectId);
    setTagsInput((note.tags || []).join(", "));
    setIsPinned(note.isPinned);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tagsArr = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingNote) {
      onUpdateNote({
        ...editingNote,
        title,
        content,
        subjectId,
        tags: tagsArr,
        isPinned,
        updatedAt: new Date().toISOString(),
      });
    } else {
      onCreateNote({
        userId: "demo-user-123",
        subjectId,
        title,
        content,
        isPinned,
        isFavorite: false,
        tags: tagsArr.length > 0 ? tagsArr : ["Note"],
      });
    }

    setIsModalOpen(false);
  };

  const handleDownloadNote = (note: NoteItem) => {
    const text = `# ${note.title}\n\n${note.content}\n\nTags: ${note.tags.join(", ")}`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${note.title.replace(/\s+/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubjectId === "all" || n.subjectId === selectedSubjectId;
    return matchesSearch && matchesSubject;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <FileText className="w-5 h-5" />
            </div>
            <span>Quick Notes & Revision Checklists</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Keep quick study thoughts, revision checklists, formula notes, and AI summaries organized in one place.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition flex items-center space-x-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Note</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search notes & tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
        </div>

        <select
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          className="w-full sm:w-56 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
        >
          <option value="all">All Subjects ({(notes || []).length})</option>
          {(subjects || []).map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* Pinned Notes Section */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center space-x-1.5">
            <Pin className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />
            <span>Pinned & Featured Notes ({pinnedNotes.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                subjects={subjects}
                onEdit={handleOpenEditModal}
                onDelete={onDeleteNote}
                onTogglePin={(n) => onUpdateNote({ ...n, isPinned: !n.isPinned })}
                onDownload={handleDownloadNote}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Notes Section */}
      <div className="space-y-4">
        {pinnedNotes.length > 0 && (
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            All Study Notes ({otherNotes.length})
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              subjects={subjects}
              onEdit={handleOpenEditModal}
              onDelete={onDeleteNote}
              onTogglePin={(n) => onUpdateNote({ ...n, isPinned: !n.isPinned })}
              onDownload={handleDownloadNote}
            />
          ))}

          {filteredNotes.length === 0 && (
            <div className="col-span-full text-center py-16 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-400 text-xs">
              No notes found. Click "Create New Note" to write your first quick revision summary!
            </div>
          )}
        </div>
      </div>

      {/* Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {editingNote ? "Edit Note" : "Create New Note"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Dynamic Programming Key State Formula"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    {(subjects || []).map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Exam, Formula, Chapter 3"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Note Content
                </label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write detailed revision notes, key formulas, or checklists..."
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="pinCheck" className="text-xs text-slate-700 dark:text-slate-300 font-bold">
                  Pin to top of notes dashboard
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

interface NoteCardProps {
  note: NoteItem;
  subjects: Subject[];
  onEdit: (note: NoteItem) => void;
  onDelete: (id: string) => void;
  onTogglePin: (note: NoteItem) => void;
  onDownload: (note: NoteItem) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  subjects,
  onEdit,
  onDelete,
  onTogglePin,
  onDownload,
}) => {
  const subject = subjects.find((s) => s.id === note.subjectId);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 group">
      <div className="space-y-3">
        {/* Subject & Pin */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] flex items-center space-x-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: subject?.color || "#6366F1" }}
            />
            <span>{subject?.name || "General"}</span>
          </span>

          <button
            onClick={() => onTogglePin(note)}
            className={`p-1.5 rounded-lg transition ${
              note.isPinned
                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60"
                : "text-slate-300 hover:text-slate-500"
            }`}
            title={note.isPinned ? "Unpin Note" : "Pin Note"}
          >
            <Pin className={`w-3.5 h-3.5 ${note.isPinned ? "fill-indigo-600 dark:fill-indigo-400" : ""}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
          {note.title}
        </h3>

        {/* Body snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4 whitespace-pre-line">
          {note.content}
        </p>
      </div>

      {/* Footer Tags & Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {(note.tags || []).map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-semibold">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onDownload(note)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            title="Download TXT"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(note)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
