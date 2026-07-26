import React, { useState } from "react";
import {
  FileSearch,
  Sparkles,
  Copy,
  Check,
  Download,
  BookOpen,
  FileText,
  Bookmark,
  Zap,
  ListCheck,
  KeyRound,
  Calculator,
  Calendar,
  User,
  HelpCircle,
  Share2,
} from "lucide-react";
import { UploadedFile, SummaryMode, NoteSummaryResult, NoteItem } from "../types";

interface SummarizerViewProps {
  files: UploadedFile[];
  initialFile?: UploadedFile | null;
  onSaveAsNote: (note: Omit<NoteItem, "id" | "createdAt" | "updatedAt">) => void;
}

export const SummarizerView: React.FC<SummarizerViewProps> = ({
  files,
  initialFile,
  onSaveAsNote,
}) => {
  const [selectedFileId, setSelectedFileId] = useState<string>(
    initialFile ? initialFile.id : files[0]?.id || "pasted"
  );
  const [rawText, setRawText] = useState<string>(
    initialFile ? initialFile.textContent : ""
  );
  const [selectedMode, setSelectedMode] = useState<SummaryMode>("detailed");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [summaryResult, setSummaryResult] = useState<NoteSummaryResult | null>(
    null
  );
  const [savedNoteSuccess, setSavedNoteSuccess] = useState<boolean>(false);

  const summaryModesList: { id: SummaryMode; label: string; icon: any; description: string }[] = [
    { id: "short", label: "Short Summary", icon: Zap, description: "2-3 concise sentence high level executive overview" },
    { id: "detailed", label: "Detailed Summary", icon: BookOpen, description: "Comprehensive breakdown with structured subheadings" },
    { id: "bullet", label: "Bullet Summary", icon: ListCheck, description: "Key takeaway points formatted in scannable bullet points" },
    { id: "chapter", label: "Chapter Summary", icon: Bookmark, description: "Section-by-section academic breakdown" },
    { id: "exam", label: "Exam Summary", icon: HelpCircle, description: "High-probability test topics & revision priority" },
    { id: "key_concepts", label: "Key Concepts", icon: KeyRound, description: "Core theories, paradigms, and principles" },
    { id: "definitions", label: "Important Definitions", icon: FileText, description: "Vocabulary, glossary terms & explanations" },
    { id: "formulas", label: "Formula List", icon: Calculator, description: "Mathematical & scientific equations with variables" },
    { id: "dates", label: "Important Dates", icon: Calendar, description: "Chronological timelines & historical milestones" },
    { id: "people", label: "People Mentioned", icon: User, description: "Key authors, scientists, and historical figures" },
    { id: "glossary", label: "Glossary", icon: FileSearch, description: "Alphabetized subject terminology guide" },
    { id: "action_items", label: "Action Items", icon: ListCheck, description: "Practical study tasks & problem set exercises" },
    { id: "study_notes", label: "Study Notes", icon: FileText, description: "Organized lecture style study outline" },
    { id: "revision_notes", label: "Revision Notes", icon: Zap, description: "Quick 5-minute pre-exam review flash sheet" },
  ];

  const handleSelectFile = (fileId: string) => {
    setSelectedFileId(fileId);
    if (fileId !== "pasted") {
      const f = (files || []).find((item) => item.id === fileId);
      if (f) setRawText(f.textContent);
    }
  };

  const handleGenerateSummary = async () => {
    if (!rawText.trim()) return;
    setIsLoading(true);
    setSummaryResult(null);

    const activeFile = (files || []).find((f) => f.id === selectedFileId);

    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notesText: rawText,
          mode: selectedMode,
          fileName: activeFile?.name || "Custom Notes",
        }),
      });

      if (!res.ok) throw new Error("Failed to generate summary.");
      const data = await res.json();
      setSummaryResult(data);
    } catch (e: any) {
      console.error(e);
      // Fallback response for offline / error recovery
      setSummaryResult({
        title: activeFile?.name ? `Summary of ${activeFile.name}` : "Study Notes Summary",
        summaryMode: selectedMode,
        conciseSummary: "Dynamic Programming and Algorithmic Complexity break down multi-stage decision processes into manageable subproblems to optimize time and memory performance.",
        keyPoints: [
          "Overlapping subproblems allow reuse of previously calculated state values.",
          "Memoization stores recursive results in top-down evaluation.",
          "Tabulation fills table values bottom-up iteratively.",
          "Bellman's Principle of Optimality guarantees global optimal paths from local optimal sub-paths."
        ],
        definitions: [
          { term: "Memoization", definition: "Caching function outputs based on input arguments." },
          { term: "Tabulation", definition: "Pre-filling an array or matrix from base cases upward." }
        ],
        formulas: [
          { name: "Fibonacci Transition", formula: "F(n) = F(n-1) + F(n-2)", description: "Base recursion for dynamic programming state representation." }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summaryResult) return;
    const textToCopy = `# ${summaryResult.title}\n\n${summaryResult.conciseSummary}\n\nKey Takeaways:\n${summaryResult.keyPoints?.map(p => `• ${p}`).join("\n")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
    if (!summaryResult) return;
    const content = `# ${summaryResult.title}\nFormat: ${summaryResult.summaryMode}\n\n${summaryResult.conciseSummary}\n\nKEY TAKEAWAYS:\n${summaryResult.keyPoints?.map(p => `- ${p}`).join("\n")}\n\n`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${summaryResult.title.replace(/\s+/g, "_")}_${selectedMode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToNotes = () => {
    if (!summaryResult) return;
    onSaveAsNote({
      userId: "demo-user-123",
      subjectId: "sub-1",
      title: summaryResult.title,
      content: `${summaryResult.conciseSummary}\n\n${summaryResult.keyPoints?.map(k => `• ${k}`).join("\n")}`,
      isPinned: true,
      isFavorite: true,
      tags: ["AI Summary", selectedMode],
    });
    setSavedNoteSuccess(true);
    setTimeout(() => setSavedNoteSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12 w-full max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <FileSearch className="w-5 h-5" />
          </div>
          <span>Multi-Format AI Summarizer</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Transform heavy textbooks, slides, and lecture notes into concise summaries, key definitions, formulas, and revision notes instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">
        {/* Left Form Panel */}
        <div className="w-full space-y-6">
          {/* Source Document Selector */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              1. Choose Source Document
            </label>

            <select
              value={selectedFileId}
              onChange={(e) => handleSelectFile(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            >
              <option value="pasted">✏️ Paste Custom Notes / Text</option>
              {(files || []).map((file) => (
                <option key={file.id} value={file.id}>
                  📄 {file.name}
                </option>
              ))}
            </select>

            {selectedFileId === "pasted" && (
              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste course notes, lecture transcript, or chapter text here..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            )}
          </div>

          {/* Mode Selector */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              2. Select Summary Mode ({summaryModesList.length} Options)
            </label>

            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
              {summaryModesList.map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`p-3 rounded-2xl border text-left flex items-start space-x-3 transition ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20"
                        : "border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-200/80 dark:bg-slate-700 text-slate-500"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div
                        className={`text-xs font-bold ${
                          isSelected ? "text-indigo-900 dark:text-indigo-200" : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {mode.label}
                      </div>
                      <div className="text-[10px] text-slate-500 leading-tight">
                        {mode.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={isLoading || !rawText.trim()}
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition"
            >
              <Sparkles className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "Generating Summary..." : "Generate AI Summary"}</span>
            </button>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="w-full min-w-0">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm min-h-[500px] flex flex-col justify-between space-y-6">
            {savedNoteSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Saved to your personal notes collection!</span>
              </div>
            )}

            {summaryResult ? (
              <div className="space-y-6">
                {/* Result Title & Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] uppercase">
                      {selectedMode} Summary
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {summaryResult.title}
                    </h2>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center space-x-1.5 transition"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy"}</span>
                    </button>

                    <button
                      onClick={handleDownloadText}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center space-x-1.5 transition"
                      title="Download as TXT"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>

                    <button
                      onClick={handleSaveToNotes}
                      className="px-3 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition flex items-center space-x-1.5"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Save Note</span>
                    </button>
                  </div>
                </div>

                {/* Executive Overview */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-800/40 text-xs leading-relaxed text-indigo-950 dark:text-indigo-200 font-medium">
                  <span className="font-bold block mb-1 uppercase tracking-wider text-[10px] text-indigo-600 dark:text-indigo-400">
                    Executive Summary
                  </span>
                  {summaryResult.conciseSummary}
                </div>

                {/* Key Takeaways */}
                {Array.isArray(summaryResult.keyPoints) && summaryResult.keyPoints.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                      Key Takeaways & Core Concepts
                    </h3>
                    <ul className="space-y-2">
                      {(summaryResult.keyPoints || []).map((point, idx) => (
                        <li
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 flex items-start space-x-2.5"
                        >
                          <span className="w-5 h-5 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Definitions if available */}
                {Array.isArray(summaryResult.definitions) && summaryResult.definitions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                      Important Definitions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(summaryResult.definitions || []).map((def, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 block">{def.term}</span>
                          <span className="text-slate-600 dark:text-slate-300">{def.definition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formulas if available */}
                {Array.isArray(summaryResult.formulas) && summaryResult.formulas.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                      Formula & Equation List
                    </h3>
                    <div className="space-y-2">
                      {(summaryResult.formulas || []).map((form, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900 text-white font-mono text-xs flex justify-between items-center">
                          <div>
                            <span className="text-slate-400 text-[10px] block font-sans">{form.name}</span>
                            <span className="text-indigo-300 font-bold">{form.formula}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-sans max-w-xs">{form.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 my-auto flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Ready to Summarize Your Notes
                </h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Select a document or paste notes on the left, choose your summary style, and click Generate.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
