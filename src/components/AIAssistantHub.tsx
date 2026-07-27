import React, { useState } from "react";
import {
  Sparkles,
  MessageSquare,
  Compass,
  FileSearch,
  Layers,
  Send,
  BookOpen,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  RotateCcw,
  Zap,
  Upload,
  GitFork,
  HelpCircle,
  FileText,
  Key,
  Flame,
} from "lucide-react";
import {
  ChatMessage,
  StudyPlanResult,
  Subject,
  UploadedFile,
  FlashcardDeck,
  Flashcard,
} from "../types";

interface AIAssistantHubProps {
  subjects: Subject[];
  files?: UploadedFile[];
  decks?: FlashcardDeck[];
  currentStreak: number;
  initialFileForDocChat?: UploadedFile | null;
}

export const AIAssistantHub: React.FC<AIAssistantHubProps> = ({
  subjects,
  files = [],
  decks = [],
  currentStreak,
  initialFileForDocChat,
}) => {
  const [activeTab, setActiveTab] = useState<"chat" | "doc_chat" | "flashcards" | "plan" | "mindmap">(
    initialFileForDocChat ? "doc_chat" : "chat"
  );

  // ---------------- 1. AI Tutor Chat State ----------------
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      role: "assistant",
      content:
        "Hello! I am StudyPilot AI, your academic companion. Ask me any complex theory, formula, code bug, or study strategy question!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          chatHistory: (chatMessages || []).slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.error) {
        throw new Error(data.error || `Server returned HTTP ${res.status}`);
      }

      const assistantReply = data.reply || "I couldn't process that query. Please try asking again!";

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: "assistant",
        content: assistantReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error("Chat error:", error);
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: "assistant",
        content: error.message || "Unable to reach the backend. Please check your connection or API configuration.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // ---------------- 2. Document Q&A Chat State ----------------
  const [selectedDocId, setSelectedDocId] = useState<string>(
    initialFileForDocChat ? initialFileForDocChat.id : files[0]?.id || ""
  );
  const [docQuestion, setDocQuestion] = useState("");
  const [docChatMessages, setDocChatMessages] = useState<ChatMessage[]>([]);
  const [docLoading, setDocLoading] = useState(false);

  const handleSendDocChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!docQuestion.trim() || docLoading) return;

    const chosenFile = files.find((f) => f.id === selectedDocId) || initialFileForDocChat;

    const userMsg: ChatMessage = {
      id: `usr-doc-${Date.now()}`,
      role: "user",
      content: docQuestion,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setDocChatMessages((prev) => [...prev, userMsg]);
    const currentQ = docQuestion;
    setDocQuestion("");
    setDocLoading(true);

    try {
      const res = await fetch("/api/ai/doc-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docText: chosenFile?.textContent || "",
          docName: chosenFile?.name || "Document",
          question: currentQ,
          chatHistory: (docChatMessages || []).slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.error) {
        throw new Error(data.error || `Server returned HTTP ${res.status}`);
      }

      const reply = data.reply || "I was unable to analyze the document context.";

      const assistantMsg: ChatMessage = {
        id: `ast-doc-${Date.now()}`,
        role: "assistant",
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setDocChatMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error("Doc chat error:", error);
      const assistantMsg: ChatMessage = {
        id: `ast-doc-${Date.now()}`,
        role: "assistant",
        content: error.message || "Unable to reach the backend. Please check your document or API configuration.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setDocChatMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setDocLoading(false);
    }
  };

  // ---------------- 3. Flashcards Deck Studio State ----------------
  const [selectedDeckId, setSelectedDeckId] = useState<string>(decks[0]?.id || "");
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const activeDeck = decks.find((d) => d.id === selectedDeckId) || decks[0];
  const currentCard = activeDeck?.cards[activeCardIndex];

  // ---------------- 4. Study Plan Generator State ----------------
  const [selectedPlanSubjects, setSelectedPlanSubjects] = useState<string[]>(
    subjects.length > 0 ? [subjects[0].name] : ["Computer Science", "Mathematics"]
  );
  const [planHours, setPlanHours] = useState(3);
  const [planExamDate, setPlanExamDate] = useState("In 2 weeks");
  const [planResult, setPlanResult] = useState<StudyPlanResult | null>(null);
  const [planLoading, setPlanLoading] = useState(false);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlanLoading(true);
    setPlanResult(null);

    try {
      const res = await fetch("/api/ai/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjects: selectedPlanSubjects,
          availableHours: planHours,
          examDate: planExamDate,
        }),
      });

      const data = await res.json();
      setPlanResult(data);
    } catch (error) {
      console.error("Plan generation error:", error);
    } finally {
      setPlanLoading(false);
    }
  };

  // ---------------- 5. AI Mind Map State ----------------
  const [mindmapFileId, setMindmapFileId] = useState<string>(files[0]?.id || "");
  const [mindmapResult, setMindmapResult] = useState<any>(null);
  const [mindmapLoading, setMindmapLoading] = useState(false);

  const handleGenerateMindmap = async () => {
    const file = files.find((f) => f.id === mindmapFileId);
    if (!file) return;

    setMindmapLoading(true);
    setMindmapResult(null);

    try {
      const res = await fetch("/api/ai/mindmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: file.textContent,
          topic: file.name,
        }),
      });

      const data = await res.json();
      setMindmapResult(data);
    } catch (e) {
      console.error("Mindmap error:", e);
    } finally {
      setMindmapLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>StudyPilot AI Assistant Hub</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Your centralized AI academic companion: Tutor Chat, Document Q&A, Mind Map Generator, Flashcards Studio, and Adaptive Study Plan Engine.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto custom-scrollbar">
        {[
          { id: "chat", label: "AI Academic Tutor", icon: MessageSquare },
          { id: "doc_chat", label: "Ask AI About Document", icon: FileSearch, badge: files.length },
          { id: "mindmap", label: "AI Mind Map Outline", icon: GitFork },
          { id: "flashcards", label: "Flashcards Studio", icon: Layers, badge: decks.length },
          { id: "plan", label: "Study Plan Engine", icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-extrabold text-slate-700 dark:text-slate-300">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: AI Academic Tutor Chat */}
      {activeTab === "chat" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 h-[580px] flex flex-col justify-between w-full">
          <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar p-2 min-h-0">
            {(chatMessages || []).map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] sm:max-w-[70%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white font-medium rounded-tr-none shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                  <span className="text-[10px] opacity-60 block mt-2 text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>StudyPilot AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendChat} className="flex items-center space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask a question or explain a complex concept..."
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center space-x-1 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Document Q&A Chat */}
      {activeTab === "doc_chat" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Select Document to Chat With
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full sm:w-72 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
            >
              {(files || []).map((file) => (
                <option key={file.id} value={file.id}>
                  📄 {file.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar p-2 min-h-[250px]">
            {(!docChatMessages || docChatMessages.length === 0) ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Ask any question regarding the selected course file (e.g. "What is Chapter 3 about?", "Summarize key formulas").
              </div>
            ) : (
              (docChatMessages || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white font-medium"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                    <span className="text-[10px] opacity-60 block mt-2 text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))
            )}
            {docLoading && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center space-x-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Reading document and analyzing context...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSendDocChat} className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <input
              type="text"
              value={docQuestion}
              onChange={(e) => setDocQuestion(e.target.value)}
              placeholder="Ask a question about this document..."
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
            <button
              type="submit"
              disabled={docLoading || !docQuestion.trim()}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center space-x-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: AI Mind Map Outline */}
      {activeTab === "mindmap" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <select
              value={mindmapFileId}
              onChange={(e) => setMindmapFileId(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
            >
              {(files || []).map((file) => (
                <option key={file.id} value={file.id}>
                  📄 {file.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleGenerateMindmap}
              disabled={mindmapLoading || !mindmapFileId}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-2"
            >
              <GitFork className="w-4 h-4" />
              <span>{mindmapLoading ? "Generating Mind Map..." : "Generate Mind Map Outline"}</span>
            </button>
          </div>

          {mindmapResult ? (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-center">
                <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  Central Topic
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {mindmapResult.centralTopic}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mindmapResult.nodes?.map((node: any, idx: number) => (
                  <div
                    key={node.id || idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                  >
                    <div className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center space-x-2">
                      <GitFork className="w-3.5 h-3.5" />
                      <span>{node.title}</span>
                    </div>

                    <ul className="space-y-1.5 pl-4 border-l-2 border-indigo-500/30 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {node.subnodes?.map((sub: string, sIdx: number) => (
                        <li key={sIdx}>• {sub}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select a document above to generate a hierarchical text mind map.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Flashcards Studio */}
      {activeTab === "flashcards" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <select
              value={selectedDeckId}
              onChange={(e) => {
                setSelectedDeckId(e.target.value);
                setActiveCardIndex(0);
                setIsFlipped(false);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
            >
              {(decks || []).map((deck) => (
                <option key={deck.id} value={deck.id}>
                  🎴 {deck.title} ({deck.cards?.length || 0} cards)
                </option>
              ))}
            </select>

            <span className="text-xs font-bold text-slate-500">
              Card {activeCardIndex + 1} of {activeDeck?.cards?.length || 0}
            </span>
          </div>

          {currentCard ? (
            <div className="max-w-xl mx-auto space-y-6">
              {/* Flip Card Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="h-64 sm:h-72 w-full rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-tr from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800/80 p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-lg hover:shadow-xl transition-all relative group"
              >
                <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {isFlipped ? "Answer (Back)" : "Question / Concept (Front)"}
                </span>

                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed max-w-md">
                  {isFlipped ? currentCard.back : currentCard.front}
                </p>

                <span className="absolute bottom-4 text-[11px] text-slate-400 group-hover:text-indigo-600 transition">
                  Click to flip card 🔄
                </span>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setActiveCardIndex((prev) => Math.max(0, prev - 1));
                  }}
                  disabled={activeCardIndex === 0}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40 hover:bg-slate-50 transition"
                >
                  Previous Card
                </button>

                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
                >
                  Flip Card
                </button>

                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setActiveCardIndex((prev) =>
                      Math.min((activeDeck?.cards.length || 1) - 1, prev + 1)
                    );
                  }}
                  disabled={activeCardIndex === (activeDeck?.cards.length || 1) - 1}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40 hover:bg-slate-50 transition"
                >
                  Next Card
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              No flashcards in this deck yet. Generate new cards from Upload Center!
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Study Plan Engine */}
      {activeTab === "plan" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <form onSubmit={handleGeneratePlan} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Hours / Day
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={planHours}
                onChange={(e) => setPlanHours(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Exam Date
              </label>
              <input
                type="text"
                value={planExamDate}
                onChange={(e) => setPlanExamDate(e.target.value)}
                placeholder="In 10 days"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold dark:text-white"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={planLoading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
              >
                <Compass className={`w-4 h-4 ${planLoading ? "animate-spin" : ""}`} />
                <span>Generate Schedule</span>
              </button>
            </div>
          </form>

          {planResult && (
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {planResult.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {planResult.overview}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {planResult.schedule?.map((day, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-indigo-600 dark:text-indigo-400">
                      <span>{day.day}</span>
                      <span>{day.durationMinutes} mins</span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      Focus: {day.focusSubject}
                    </div>
                    <ul className="list-disc list-inside text-slate-500 space-y-1">
                      {day.tasks?.map((t, tidx) => (
                        <li key={tidx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
