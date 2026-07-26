import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { GlobalSearchModal } from "./components/GlobalSearchModal";
import { LandingPage } from "./components/LandingPage";
import { AuthModal } from "./components/AuthModal";
import { DashboardView } from "./components/DashboardView";
import { StudyPlannerView } from "./components/StudyPlannerView";
import { AssignmentTrackerView } from "./components/AssignmentTrackerView";
import { CalendarView } from "./components/CalendarView";
import { SubjectsView } from "./components/SubjectsView";
import { AIAssistantHub } from "./components/AIAssistantHub";
import { ProgressAnalyticsView } from "./components/ProgressAnalyticsView";
import { SettingsView } from "./components/SettingsView";
import { UploadCenterView } from "./components/UploadCenterView";
import { SummarizerView } from "./components/SummarizerView";
import { QuizGeneratorView } from "./components/QuizGeneratorView";
import { NotesView } from "./components/NotesView";
import { PomodoroTimer } from "./components/PomodoroTimer";

import {
  ActiveTab,
  UserProfile,
  Subject,
  Assignment,
  StudySession,
  AIHistoryItem,
  UploadedFile,
  NoteItem,
  FlashcardDeck,
  QuizResult,
} from "./types";
import {
  INITIAL_USER,
  INITIAL_SUBJECTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SESSIONS,
  INITIAL_AI_HISTORY,
  INITIAL_FILES,
  INITIAL_NOTES,
  INITIAL_DECKS,
  getStorageItem,
  setStorageItem,
} from "./lib/store";

export function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);

  // Auth & User Profile State
  const [user, setUser] = useState<UserProfile>(() =>
    getStorageItem("user_profile", INITIAL_USER)
  );
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() =>
    getStorageItem<boolean>("dark_mode", false)
  );

  // App Data States
  const [subjects, setSubjects] = useState<Subject[]>(() =>
    getStorageItem("subjects_data", INITIAL_SUBJECTS)
  );
  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    getStorageItem("assignments_data", INITIAL_ASSIGNMENTS)
  );
  const [studySessions, setStudySessions] = useState<StudySession[]>(() =>
    getStorageItem("sessions_data", INITIAL_SESSIONS)
  );
  const [aiHistory, setAiHistory] = useState<AIHistoryItem[]>(() =>
    getStorageItem("ai_history_data", INITIAL_AI_HISTORY)
  );

  // New Features Data States
  const [files, setFiles] = useState<UploadedFile[]>(() =>
    getStorageItem("uploaded_files", INITIAL_FILES)
  );
  const [notes, setNotes] = useState<NoteItem[]>(() =>
    getStorageItem("notes_data", INITIAL_NOTES)
  );
  const [decks, setDecks] = useState<FlashcardDeck[]>(() =>
    getStorageItem("flashcard_decks", INITIAL_DECKS)
  );
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>(() =>
    getStorageItem("quiz_history", [])
  );

  // Active Cross-Feature Context State
  const [activeFileContext, setActiveFileContext] = useState<UploadedFile | null>(null);

  // Sync dark mode class with root html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setStorageItem("dark_mode", darkMode);
  }, [darkMode]);

  // Sync states to local storage
  useEffect(() => { setStorageItem("user_profile", user); }, [user]);
  useEffect(() => { setStorageItem("subjects_data", subjects); }, [subjects]);
  useEffect(() => { setStorageItem("assignments_data", assignments); }, [assignments]);
  useEffect(() => { setStorageItem("sessions_data", studySessions); }, [studySessions]);
  useEffect(() => { setStorageItem("uploaded_files", files); }, [files]);
  useEffect(() => { setStorageItem("notes_data", notes); }, [notes]);
  useEffect(() => { setStorageItem("flashcard_decks", decks); }, [decks]);
  useEffect(() => { setStorageItem("quiz_history", quizHistory); }, [quizHistory]);

  // Auth Handlers
  const handleAuthSuccess = (loggedUser: UserProfile) => {
    setUser(loggedUser);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    setUser(INITIAL_USER);
    setActiveTab("landing");
  };

  const handleUpdateUser = (updatedProps: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updatedProps }));
  };

  const handlePomodoroCompleteSession = (durationMinutes: number, subjectId?: string, title?: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const session: StudySession = {
      id: `pomo-${Date.now()}`,
      userId: user.uid,
      subjectId: subjectId || subjects[0]?.id || "sub-1",
      title: title || "Pomodoro Focus Sprint",
      date: todayStr,
      durationMinutes: durationMinutes,
      status: "Completed",
      priority: "High",
      createdAt: new Date().toISOString(),
    };
    setStudySessions((prev) => [session, ...prev]);
  };
  const handleCreateSession = (newSession: Omit<StudySession, "id" | "createdAt" | "userId">) => {
    const session: StudySession = {
      ...newSession,
      id: `session-${Date.now()}`,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };
    setStudySessions((prev) => [session, ...prev]);
  };

  const handleUpdateSession = (updatedSession: StudySession) => {
    setStudySessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)));
  };

  const handleDeleteSession = (id: string) => {
    setStudySessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleSessionComplete = (id: string) => {
    setStudySessions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === "Completed" ? "Scheduled" : "Completed" } : s
      )
    );
  };

  // ---------------- Assignment Handlers ----------------
  const handleCreateAssignment = (newAssignment: Omit<Assignment, "id" | "createdAt" | "userId">) => {
    const assignment: Assignment = {
      ...newAssignment,
      id: `assign-${Date.now()}`,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };
    setAssignments((prev) => [assignment, ...prev]);
  };

  const handleUpdateAssignment = (updatedAssignment: Assignment) => {
    setAssignments((prev) => prev.map((a) => (a.id === updatedAssignment.id ? updatedAssignment : a)));
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleToggleAssignmentComplete = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === "Completed" ? "Not Started" : "Completed" } : a
      )
    );
  };

  // ---------------- Subject Handlers ----------------
  const handleCreateSubject = (newSubject: Omit<Subject, "id" | "createdAt" | "userId">) => {
    const subject: Subject = {
      ...newSubject,
      id: `sub-${Date.now()}`,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };
    setSubjects((prev) => [...prev, subject]);
  };

  const handleUpdateSubject = (updatedSubject: Subject) => {
    setSubjects((prev) => prev.map((sub) => (sub.id === updatedSubject.id ? updatedSubject : sub)));
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((sub) => sub.id !== id));
  };

  // ---------------- File Handlers ----------------
  const handleUploadFile = (newFile: UploadedFile) => {
    setFiles((prev) => [newFile, ...prev]);
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleRenameFile = (id: string, newName: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, name: newName } : f)));
  };

  // ---------------- Note Handlers ----------------
  const handleCreateNote = (newNote: Omit<NoteItem, "id" | "createdAt" | "updatedAt">) => {
    const note: NoteItem = {
      ...newNote,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [note, ...prev]);
  };

  const handleUpdateNote = (updatedNote: NoteItem) => {
    setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // ---------------- Cross-Feature Navigation Actions ----------------
  const handleTriggerSummarize = (file: UploadedFile) => {
    setActiveFileContext(file);
    setActiveTab("summarizer");
  };

  const handleTriggerQuiz = (file: UploadedFile) => {
    setActiveFileContext(file);
    setActiveTab("quiz");
  };

  const handleTriggerFlashcards = (file: UploadedFile) => {
    setActiveFileContext(file);
    setActiveTab("ai-assistant");
  };

  const handleTriggerDocChat = (file: UploadedFile) => {
    setActiveFileContext(file);
    setActiveTab("ai-assistant");
  };

  if (activeTab === "landing") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans">
        <LandingPage
          onStartFree={() => setIsAuthOpen(true)}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
        />
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans flex overflow-x-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        currentStreak={user.currentStreak}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopNav
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenPomodoro={() => setIsPomodoroOpen(true)}
          assignments={assignments}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          {activeTab === "dashboard" && (
            <DashboardView
              user={user}
              subjects={subjects}
              assignments={assignments}
              studySessions={studySessions}
              files={files}
              notes={notes}
              decks={decks}
              aiHistory={aiHistory}
              setActiveTab={setActiveTab}
              onToggleSessionComplete={handleToggleSessionComplete}
              onToggleAssignmentComplete={handleToggleAssignmentComplete}
              onOpenCreateSession={() => setActiveTab("planner")}
              onOpenCreateAssignment={() => setActiveTab("assignments")}
              onUpdateUser={handleUpdateUser}
              onCreateSubject={handleCreateSubject}
              onCreateAssignment={handleCreateAssignment}
            />
          )}

          {activeTab === "planner" && (
            <StudyPlannerView
              studySessions={studySessions}
              subjects={subjects}
              onCreateSession={handleCreateSession}
              onUpdateSession={handleUpdateSession}
              onDeleteSession={handleDeleteSession}
              onToggleComplete={handleToggleSessionComplete}
            />
          )}

          {activeTab === "assignments" && (
            <AssignmentTrackerView
              assignments={assignments}
              subjects={subjects}
              onCreateAssignment={handleCreateAssignment}
              onUpdateAssignment={handleUpdateAssignment}
              onDeleteAssignment={handleDeleteAssignment}
              onToggleComplete={handleToggleAssignmentComplete}
            />
          )}

          {activeTab === "subjects" && (
            <SubjectsView
              subjects={subjects}
              assignments={assignments}
              studySessions={studySessions}
              onCreateSubject={handleCreateSubject}
              onUpdateSubject={handleUpdateSubject}
              onDeleteSubject={handleDeleteSubject}
            />
          )}

          {activeTab === "calendar" && (
            <CalendarView
              assignments={assignments}
              studySessions={studySessions}
              subjects={subjects}
              onOpenCreateSession={() => setActiveTab("planner")}
              onOpenCreateAssignment={() => setActiveTab("assignments")}
            />
          )}

          {activeTab === "uploads" && (
            <UploadCenterView
              files={files}
              subjects={subjects}
              onUploadFile={handleUploadFile}
              onDeleteFile={handleDeleteFile}
              onRenameFile={handleRenameFile}
              onTriggerSummarize={handleTriggerSummarize}
              onTriggerQuiz={handleTriggerQuiz}
              onTriggerFlashcards={handleTriggerFlashcards}
              onTriggerDocChat={handleTriggerDocChat}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "summarizer" && (
            <SummarizerView
              files={files}
              initialFile={activeFileContext}
              onSaveAsNote={handleCreateNote}
            />
          )}

          {activeTab === "quiz" && (
            <QuizGeneratorView
              subjects={subjects}
              files={files}
              initialFile={activeFileContext}
              onSaveQuizHistory={(q) => setQuizHistory((prev) => [q, ...prev])}
            />
          )}

          {activeTab === "notes" && (
            <NotesView
              notes={notes}
              subjects={subjects}
              onCreateNote={handleCreateNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
            />
          )}

          {activeTab === "ai-assistant" && (
            <AIAssistantHub
              subjects={subjects}
              files={files}
              decks={decks}
              currentStreak={user.currentStreak}
              initialFileForDocChat={activeFileContext}
            />
          )}

          {activeTab === "analytics" && (
            <ProgressAnalyticsView
              user={user}
              studySessions={studySessions}
              assignments={assignments}
              subjects={subjects}
            />
          )}

          {activeTab === "settings" && (
            <SettingsView
              user={user}
              onUpdateUser={handleUpdateUser}
              onLogout={handleLogout}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
            />
          )}
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        assignments={assignments}
        subjects={subjects}
        files={files}
        notes={notes}
        decks={decks}
        setActiveTab={setActiveTab}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Pomodoro Timer Modal */}
      <PomodoroTimer
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
        subjects={subjects}
        onCompleteSession={handlePomodoroCompleteSession}
      />
    </div>
  );
}

export default App;
