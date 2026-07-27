import {
  UserProfile,
  Subject,
  Assignment,
  StudySession,
  AIHistoryItem,
  MotivationalQuote,
  UploadedFile,
  NoteItem,
  FlashcardDeck,
  Achievement,
} from "../types";

export const INITIAL_USER: UserProfile = {
  uid: "student-default",
  email: "student@university.edu",
  displayName: "Alex Rivera",
  photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  university: "Stanford University",
  degreeProgram: "B.S. Computer Science & Data Systems",
  semester: "Fall Semester 2026",
  timeZone: "UTC-8 (Pacific Time)",
  weeklyGoalHours: 25,
  currentStreak: 12,
  darkMode: false,
  notifications: true,
  language: "English",
  createdAt: new Date().toISOString(),
};

// 20+ Subjects across university disciplines
export const INITIAL_SUBJECTS: Subject[] = [
  { id: "sub-1", userId: "student-123", name: "Computer Science", color: "#4F46E5", teacher: "Prof. Davis", credits: 4, description: "Algorithms, Complexity Theory & Data Structures", createdAt: new Date().toISOString() },
  { id: "sub-2", userId: "student-123", name: "Mathematics", color: "#7C3AED", teacher: "Dr. Evans", credits: 4, description: "Linear Algebra, Differential Equations & Vector Calculus", createdAt: new Date().toISOString() },
  { id: "sub-3", userId: "student-123", name: "Physics", color: "#06B6D4", teacher: "Dr. Miller", credits: 4, description: "Quantum Mechanics & Wave Optics", createdAt: new Date().toISOString() },
  { id: "sub-4", userId: "student-123", name: "Psychology", color: "#EC4899", teacher: "Prof. Vance", credits: 3, description: "Cognitive Neuroscience & Memory Systems", createdAt: new Date().toISOString() },
  { id: "sub-5", userId: "student-123", name: "Software Engineering", color: "#3B82F6", teacher: "Prof. Zhang", credits: 4, description: "Microservices, Clean Architecture & Agile Patterns", createdAt: new Date().toISOString() },
  { id: "sub-6", userId: "student-123", name: "Artificial Intelligence", color: "#10B981", teacher: "Dr. Al-Mansoor", credits: 4, description: "Deep Learning, Transformers & Reinforcement Learning", createdAt: new Date().toISOString() },
  { id: "sub-7", userId: "student-123", name: "Data Science", color: "#F59E0B", teacher: "Dr. Chen", credits: 3, description: "Predictive Analytics, Feature Pipelines & Statistical Models", createdAt: new Date().toISOString() },
  { id: "sub-8", userId: "student-123", name: "Cyber Security", color: "#EF4444", teacher: "Prof. Kowalski", credits: 3, description: "Cryptography, Threat Modeling & Network Security", createdAt: new Date().toISOString() },
  { id: "sub-9", userId: "student-123", name: "Operating Systems", color: "#8B5CF6", teacher: "Dr. Thorne", credits: 4, description: "Kernel Threading, Virtual Memory & Concurrency", createdAt: new Date().toISOString() },
  { id: "sub-10", userId: "student-123", name: "Computer Networks", color: "#14B8A6", teacher: "Prof. Patel", credits: 3, description: "TCP/IP, Distributed Protocols & SDN", createdAt: new Date().toISOString() },
  { id: "sub-11", userId: "student-123", name: "Database Systems", color: "#F97316", teacher: "Dr. O'Connor", credits: 3, description: "Relational Algebra, Distributed Storage & Query Optimization", createdAt: new Date().toISOString() },
  { id: "sub-12", userId: "student-123", name: "Web Development", color: "#0284C7", teacher: "Prof. Silva", credits: 3, description: "Modern React, Next.js, WebAssembly & WebSockets", createdAt: new Date().toISOString() },
  { id: "sub-13", userId: "student-123", name: "Mobile Development", color: "#6366F1", teacher: "Dr. Nakamura", credits: 3, description: "Flutter, React Native & Native iOS/Android Architecture", createdAt: new Date().toISOString() },
  { id: "sub-14", userId: "student-123", name: "Cloud Computing", color: "#0D9488", teacher: "Prof. Lindqvist", credits: 4, description: "Kubernetes, Serverless & Cloud Infrastructure", createdAt: new Date().toISOString() },
  { id: "sub-15", userId: "student-123", name: "Calculus & Analysis", color: "#A855F7", teacher: "Dr. Bernstein", credits: 4, description: "Multivariable Integrals & Infinite Series", createdAt: new Date().toISOString() },
  { id: "sub-16", userId: "student-123", name: "Statistics & Probability", color: "#D97706", teacher: "Prof. Gupta", credits: 3, description: "Bayesian Inference, Markov Chains & Hypothesis Testing", createdAt: new Date().toISOString() },
  { id: "sub-17", userId: "student-123", name: "Organic Chemistry", color: "#059669", teacher: "Dr. Rossi", credits: 4, description: "Reaction Mechanisms, Synthesis & NMR Spectroscopy", createdAt: new Date().toISOString() },
  { id: "sub-18", userId: "student-123", name: "Molecular Biology", color: "#DB2777", teacher: "Dr. Watson", credits: 4, description: "Genomics, Gene Regulation & CRISPR Tech", createdAt: new Date().toISOString() },
  { id: "sub-19", userId: "student-123", name: "Microeconomics", color: "#CA8A04", teacher: "Prof. Keynes", credits: 3, description: "Market Equilibrium, Game Theory & Mechanism Design", createdAt: new Date().toISOString() },
  { id: "sub-20", userId: "student-123", name: "Constitutional Law", color: "#475569", teacher: "Prof. Marshall", credits: 3, description: "Judicial Review, Due Process & Civil Liberties", createdAt: new Date().toISOString() },
];

const getFutureDate = (daysAhead: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split("T")[0];
};

// Generate 52 Uploaded Files across subjects
const fileCategories = [
  { type: "PDF", name: "Lecture_Notes", size: 2400000 },
  { type: "DOCX", name: "Cheatsheet", size: 1200000 },
  { type: "PPTX", name: "Slides_Deck", size: 4500000 },
  { type: "TXT", name: "Lab_Summary", size: 350000 },
  { type: "MD", name: "Revision_Guide", size: 180000 },
  { type: "CSV", name: "Dataset_Sample", size: 890000 },
  { type: "PNG", name: "Diagram_Schema", size: 1500000 },
  { type: "JPG", name: "Whiteboard_Capture", size: 2100000 },
];

const fileTopics = [
  "Dynamic_Programming_Fundamentals", "Linear_Algebra_Eigenvalues", "Quantum_Wave_Mechanics",
  "Cognitive_Memory_Consolidation", "Microservices_Event_Driven_Design", "Attention_Mechanism_Transformers",
  "Feature_Selection_XGBoost", "RSA_Public_Key_Cryptography", "Kernel_Process_Scheduling",
  "BGP_Routing_Protocol_Overview", "BTree_Indexing_Query_Engine", "React_18_Concurrent_Rendering",
  "Flutter_State_Management_Riverpod", "Kubernetes_Pod_Autoscaling", "Fourier_Transform_Applications",
  "Bayesian_MCMC_Sampling", "Stereochemistry_Sn1_Sn2_Mechanisms", "CRISPR_Cas9_Genome_Editing",
  "Nash_Equilibrium_Game_Theory", "Supreme_Court_Precedents_Summary", "Binary_Search_Tree_Balancing",
  "Singular_Value_Decomposition", "Photoelectric_Effect_Experiments", "Neuroplasticity_Cortical_Mapping",
  "Domain_Driven_Design_Aggregate_Roots", "CNN_Image_Classification_ResNet", "Pandas_Dataframe_Wrangling",
  "Zero_Knowledge_Proofs_ZK_SNARKs", "Page_Fault_Handler_In_Linux", "TCP_Reno_Congestion_Control"
];

export const INITIAL_FILES: UploadedFile[] = Array.from({ length: 52 }, (_, i) => {
  const sub = INITIAL_SUBJECTS[i % INITIAL_SUBJECTS.length];
  const cat = fileCategories[i % fileCategories.length];
  const topic = fileTopics[i % fileTopics.length] || `Topic_Module_${i + 1}`;
  return {
    id: `file-${i + 1}`,
    userId: "demo-user-123",
    name: `${sub.name.replace(/\s+/g, "_")}_${topic}.${cat.type.toLowerCase()}`,
    subjectId: sub.id,
    type: cat.type,
    size: cat.size + (i * 35000),
    uploadDate: getFutureDate(-Math.floor(i / 2)),
    status: "Ready",
    textContent: `Comprehensive study material for ${sub.name}: ${topic.replace(/_/g, " ")}. Contains key mathematical theorems, code examples, definitions, laboratory procedures, and exam review notes.`,
    extractedSummary: `Core summary for ${sub.name}: Key focus on ${topic.replace(/_/g, " ")}, including architectural principles, formulas, and critical problem-solving techniques.`,
    notes: `Reviewed for ${sub.name} course assessment.`,
  };
});

// Generate 105 Assignments
export const INITIAL_ASSIGNMENTS: Assignment[] = Array.from({ length: 105 }, (_, i) => {
  const sub = INITIAL_SUBJECTS[i % INITIAL_SUBJECTS.length];
  const priority: ("High" | "Medium" | "Low")[] = ["High", "Medium", "Low"];
  const status: ("Not Started" | "In Progress" | "Completed")[] = ["Not Started", "In Progress", "Completed"];
  const daysOffset = (i % 30) - 5; // range from -5 to +25 days
  return {
    id: `ass-${i + 1}`,
    userId: "demo-user-123",
    title: `${sub.name} - Problem Set #${(i % 8) + 1}: ${fileTopics[i % fileTopics.length].replace(/_/g, " ")}`,
    subjectId: sub.id,
    deadline: getFutureDate(daysOffset),
    priority: priority[i % 3],
    status: daysOffset < 0 ? "Completed" : status[i % 3],
    description: `Complete comprehensive coursework for ${sub.name}. Covers ${fileTopics[i % fileTopics.length].replace(/_/g, " ")}, theoretical derivations, and practical implementations.`,
    isExam: i % 10 === 0,
    createdAt: new Date().toISOString(),
  };
});

// Generate 52 Notes
export const INITIAL_NOTES: NoteItem[] = Array.from({ length: 52 }, (_, i) => {
  const sub = INITIAL_SUBJECTS[i % INITIAL_SUBJECTS.length];
  const topic = fileTopics[i % fileTopics.length].replace(/_/g, " ");
  return {
    id: `note-${i + 1}`,
    userId: "demo-user-123",
    subjectId: sub.id,
    title: `${sub.name}: ${topic} Study Guide`,
    content: `# ${topic}\n\nKey takeaways and core equations for ${sub.name}.\n\n- Definition: Fundamental concept governing system behavior.\n- Application: Real-world engineering & analytical implementation.\n- Exam Focus: Pay attention to boundary conditions and performance tradeoffs.`,
    isPinned: i < 5,
    isFavorite: i % 3 === 0,
    tags: [sub.name, "Exam Prep", "Key Formulas"],
    createdAt: new Date(Date.now() - 3600000 * (i * 12)).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * (i * 6)).toISOString(),
  };
});

// Generate 30 Flashcard Decks
export const INITIAL_DECKS: FlashcardDeck[] = Array.from({ length: 30 }, (_, i) => {
  const sub = INITIAL_SUBJECTS[i % INITIAL_SUBJECTS.length];
  const topic = fileTopics[i % fileTopics.length].replace(/_/g, " ");
  return {
    id: `deck-${i + 1}`,
    userId: "demo-user-123",
    title: `${sub.name} - ${topic} Master Deck`,
    subjectId: sub.id,
    createdAt: new Date().toISOString(),
    cards: [
      { id: `fc-${i}-1`, front: `What is the core principle of ${topic}?`, back: `It provides an optimal framework for solving ${sub.name} problems efficiently.`, mastered: true },
      { id: `fc-${i}-2`, front: `State the primary equation or theorem for ${topic}.`, back: `Theorem 1: Universal convergence under standard boundary conditions.`, mastered: false },
      { id: `fc-${i}-3`, front: `What is the computational complexity or worst-case bound?`, back: `Typically bounded by O(N log N) or optimal space utilization.`, mastered: true },
      { id: `fc-${i}-4`, front: `Name one key practical edge case to watch for in exams.`, back: `Edge case handling when inputs approach boundary extremes or empty states.`, mastered: false },
    ]
  };
});

// Generate 45 Study Sessions
export const INITIAL_SESSIONS: StudySession[] = Array.from({ length: 45 }, (_, i) => {
  const sub = INITIAL_SUBJECTS[i % INITIAL_SUBJECTS.length];
  const daysOffset = (i % 20) - 5;
  const status: ("Scheduled" | "Completed" | "Cancelled")[] = ["Scheduled", "Completed", "Cancelled"];
  return {
    id: `ses-${i + 1}`,
    userId: "demo-user-123",
    subjectId: sub.id,
    title: `${sub.name} - Deep Focus Review Session #${i + 1}`,
    date: getFutureDate(daysOffset),
    durationMinutes: [45, 60, 90, 120][i % 4],
    priority: ["High", "Medium", "Low"][i % 3] as "High" | "Medium" | "Low",
    status: daysOffset < 0 ? "Completed" : status[i % 2],
    notes: `Focused problem solving and textbook chapter review for ${sub.name}.`,
    createdAt: new Date().toISOString(),
  };
});

export const INITIAL_AI_HISTORY: AIHistoryItem[] = [
  {
    id: "ai-1",
    userId: "demo-user-123",
    type: "chat",
    title: "Understanding Dynamic Programming Overlapping Subproblems",
    payload: JSON.stringify({
      messages: [
        { role: "user", content: "Can you explain the difference between Top-Down Memoization and Bottom-Up Tabulation in Dynamic Programming?" },
        { role: "assistant", content: "Great question! Let's break down Dynamic Programming step-by-step:\n\n1. **Top-Down (Memoization)**: You start with the main problem and recursively break it down. When you compute a subproblem, you store its result in a lookup table so you never re-compute it.\n\n2. **Bottom-Up (Tabulation)**: You start by solving the smallest base subproblems first, building a table iteratively up to the final solution." }
      ]
    }),
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "ai-2",
    userId: "demo-user-123",
    type: "quiz",
    title: "Linear Algebra & Eigenvalues Practice Quiz",
    payload: JSON.stringify({
      topic: "Linear Algebra - Eigenvalues",
      score: 4,
      total: 5,
    }),
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "ach-1", title: "12-Day Study Streak", description: "Maintained a continuous daily study session for over 10 consecutive days.", icon: "Flame", unlocked: true, unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "ach-2", title: "Document Scholar", description: "Uploaded and processed 50+ course study materials in the Upload Center.", icon: "FileText", unlocked: true, unlockedAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: "ach-3", title: "Quiz Master", description: "Scored 80%+ on an AI-generated adaptive subject quiz.", icon: "Award", unlocked: true, unlockedAt: new Date().toISOString() },
  { id: "ach-4", title: "Pomodoro Champion", description: "Completed 10 full Pomodoro focus study sprints.", icon: "Clock", unlocked: false },
  { id: "ach-5", title: "AI Power User", description: "Utilized all AI study tools: Summarizer, Quiz, Study Plan, and Doc Chat.", icon: "Zap", unlocked: false }
];

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier", category: "Persistence" },
  { quote: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch", category: "Curiosity" },
  { quote: "Future belongs to those who prepare for it today.", author: "Malcolm X", category: "Focus" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "Motivation" },
  { quote: "Continuous learning is the minimum requirement for success in any field.", author: "Brian Tracy", category: "Growth" },
];

// LocalStorage Persistence Helpers
const STORAGE_KEYS = {
  USER: "studypilot_user",
  SUBJECTS: "studypilot_subjects",
  ASSIGNMENTS: "studypilot_assignments",
  SESSIONS: "studypilot_sessions",
  AI_HISTORY: "studypilot_ai_history",
  FILES: "studypilot_uploaded_files",
  NOTES: "studypilot_notes_data",
  DECKS: "studypilot_flashcard_decks",
};

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    const parsed = JSON.parse(item);
    if (parsed === null || parsed === undefined) return defaultValue;
    if (Array.isArray(defaultValue)) {
      if (!Array.isArray(parsed) || parsed.length === 0) return defaultValue;
    }
    return parsed as T;
  } catch (e) {
    console.error("Error reading key from localStorage", key, e);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error writing key to localStorage", key, e);
  }
}

export const loadStoredData = () => {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const storedSubjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    const storedAssignments = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    const storedSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    const storedAIHistory = localStorage.getItem(STORAGE_KEYS.AI_HISTORY);

    return {
      user: storedUser ? JSON.parse(storedUser) : INITIAL_USER,
      subjects: storedSubjects ? JSON.parse(storedSubjects) : INITIAL_SUBJECTS,
      assignments: storedAssignments ? JSON.parse(storedAssignments) : INITIAL_ASSIGNMENTS,
      studySessions: storedSessions ? JSON.parse(storedSessions) : INITIAL_SESSIONS,
      aiHistory: storedAIHistory ? JSON.parse(storedAIHistory) : INITIAL_AI_HISTORY,
    };
  } catch (e) {
    console.error("Error reading from localStorage", e);
    return {
      user: INITIAL_USER,
      subjects: INITIAL_SUBJECTS,
      assignments: INITIAL_ASSIGNMENTS,
      studySessions: INITIAL_SESSIONS,
      aiHistory: INITIAL_AI_HISTORY,
    };
  }
};

export const saveStoredData = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving to localStorage", e);
  }
};

export { STORAGE_KEYS };
