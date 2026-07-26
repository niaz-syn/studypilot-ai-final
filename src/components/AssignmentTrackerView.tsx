import React, { useState } from "react";
import {
  CheckSquare,
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit2,
  Search,
  Filter,
  X,
  Clock,
  LayoutGrid,
  List,
} from "lucide-react";
import { Assignment, Subject, Priority, AssignmentStatus } from "../types";

interface AssignmentTrackerViewProps {
  assignments: Assignment[];
  subjects: Subject[];
  onCreateAssignment: (assignment: Omit<Assignment, "id" | "createdAt" | "userId">) => void;
  onUpdateAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const AssignmentTrackerView: React.FC<AssignmentTrackerViewProps> = ({
  assignments,
  subjects,
  onCreateAssignment,
  onUpdateAssignment,
  onDeleteAssignment,
  onToggleComplete,
}) => {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "");
  const [deadline, setDeadline] = useState(new Date().toISOString().split("T")[0]);
  const [priority, setPriority] = useState<Priority>("Medium");
  const [status, setStatus] = useState<AssignmentStatus>("Not Started");
  const [description, setDescription] = useState("");

  const handleOpenCreate = () => {
    setEditingAssignment(null);
    setTitle("");
    setSubjectId(subjects[0]?.id || "");
    setDeadline(new Date().toISOString().split("T")[0]);
    setPriority("Medium");
    setStatus("Not Started");
    setDescription("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: Assignment) => {
    setEditingAssignment(a);
    setTitle(a.title);
    setSubjectId(a.subjectId);
    setDeadline(a.deadline);
    setPriority(a.priority);
    setStatus(a.status);
    setDescription(a.description || "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAssignment) {
      onUpdateAssignment({
        ...editingAssignment,
        title,
        subjectId,
        deadline,
        priority,
        status,
        description,
      });
    } else {
      onCreateAssignment({
        title,
        subjectId,
        deadline,
        priority,
        status,
        description,
      });
    }
    setIsModalOpen(false);
  };

  const filteredAssignments = (assignments || []).filter((a) => {
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterSubject !== "ALL" && a.subjectId !== filterSubject) return false;
    if (filterStatus !== "ALL" && a.status !== filterStatus) return false;
    if (filterPriority !== "ALL" && a.priority !== filterPriority) return false;
    return true;
  });

  const getSubject = (subId: string) => (subjects || []).find((s) => s.id === subId);

  const getUrgencyBadge = (deadlineStr: string, status: AssignmentStatus) => {
    if (status === "Completed") return null;
    const today = new Date().toISOString().split("T")[0];
    if (deadlineStr < today) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white">OVERDUE</span>;
    } else if (deadlineStr === today) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">DUE TODAY</span>;
    }
    return null;
  };

  const kanbanStatuses: AssignmentStatus[] = ["Not Started", "In Progress", "Completed"];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <CheckSquare className="w-8 h-8 text-purple-600" />
            <span>Assignment Tracker</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track course projects, homework deadlines, and exam preparations.
          </p>
        </div>

        <button
          id="assignment-create-btn"
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-500/25 transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Assignment</span>
        </button>
      </div>

      {/* Filter & View Mode Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assignments..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">All Subjects</option>
            {(subjects || []).map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "list"
                  ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "kanban"
                  ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {filteredAssignments.map((a) => {
            const subject = getSubject(a.subjectId);
            const isDone = a.status === "Completed";

            return (
              <div
                key={a.id}
                className={`p-5 rounded-3xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDone
                    ? "bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 opacity-70"
                    : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:shadow-md"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => onToggleComplete(a.id)}
                    className={`mt-1 p-1.5 rounded-xl border transition ${
                      isDone
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-300 dark:border-slate-600 text-transparent hover:border-purple-500"
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5 fill-current" />
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: subject?.color || "#7C3AED" }} />
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {subject?.name || "General"}
                      </span>
                      {getUrgencyBadge(a.deadline, a.status)}
                    </div>

                    <h3
                      className={`text-base font-bold mt-1 ${
                        isDone ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {a.title}
                    </h3>

                    {a.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">{a.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end space-x-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left md:text-right">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center md:justify-end space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{a.deadline}</span>
                    </div>
                    <span
                      className={`inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        a.priority === "High"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          : a.priority === "Medium"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {a.priority} Priority
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(a)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteAssignment(a.id)}
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
      )}

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kanbanStatuses.map((columnStatus) => {
            const statusItems = filteredAssignments.filter((a) => a.status === columnStatus);

            return (
              <div
                key={columnStatus}
                className="p-5 rounded-3xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {columnStatus}
                  </h3>
                  <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                    {statusItems.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {statusItems.map((a) => {
                    const subject = getSubject(a.subjectId);
                    return (
                      <div
                        key={a.id}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow transition space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                            style={{ backgroundColor: subject?.color || "#7C3AED" }}
                          >
                            {subject?.name || "General"}
                          </span>
                          {getUrgencyBadge(a.deadline, a.status)}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{a.title}</h4>

                        {a.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{a.description}</p>
                        )}

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500">
                          <span>Due: {a.deadline}</span>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleOpenEdit(a)}
                              className="p-1 hover:text-slate-900 dark:hover:text-white"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => onDeleteAssignment(a.id)} className="p-1 hover:text-rose-600">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Create/Edit Assignment */}
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
              {editingAssignment ? "Edit Assignment" : "Add New Assignment"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., CS301 Dynamic Programming Homework"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
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
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AssignmentStatus)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description / Guidelines</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task instructions or guidelines..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
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
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/25"
                >
                  {editingAssignment ? "Save Assignment" : "Add Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
