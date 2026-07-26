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

export const INITIAL_FILES: UploadedFile[] = [
  {
    id: "file-1",
    userId: "demo-user-123",
    name: "CS301_Dynamic_Programming_Lecture_Notes.pdf",
    subjectId: "sub-1",
    type: "PDF",
    size: 2450000,
    uploadDate: new Date(Date.now() - 3600000 * 48).toISOString().split("T")[0],
    status: "Ready",
    textContent: `Dynamic Programming (DP) is an algorithmic paradigm that solves complex problems by breaking them down into simpler subproblems. It is applicable when subproblems overlap and possess optimal substructure. Key concepts include Top-Down Memoization, Bottom-Up Tabulation, Bellman's principle of optimality, and state transition equations. Common examples include Fibonacci, Knapsack problem, Longest Common Subsequence (LCS), and Matrix Chain Multiplication.`,
    extractedSummary: "Dynamic Programming breaks complex problems into overlapping subproblems using memoization or tabulation for optimal efficiency.",
    notes: "Review Bellman equation prior to Thursday's midterm."
  },
  {
    id: "file-2",
    userId: "demo-user-123",
    name: "Linear_Algebra_Eigenvectors_Cheatsheet.docx",
    subjectId: "sub-2",
    type: "DOCX",
    size: 1120000,
    uploadDate: new Date(Date.now() - 3600000 * 24).toISOString().split("T")[0],
    status: "Ready",
    textContent: `An eigenvector of a linear transformation is a non-zero vector that changes at most by a scalar factor when that linear transformation is applied to it. The corresponding scalar factor is known as the eigenvalue (lambda). Equation: A * v = lambda * v. The characteristic equation is det(A - lambda * I) = 0. Diagonalization requires n linearly independent eigenvectors for an n x n matrix.`,
    extractedSummary: "Eigenvectors satisfy A*v = lambda*v. Found by solving det(A - lambda*I) = 0.",
    notes: "Key formula list included for matrix transformation."
  },
  {
    id: "file-3",
    userId: "demo-user-123",
    name: "Quantum_Physics_Wave_Mechanics.txt",
    subjectId: "sub-3",
    type: "TXT",
    size: 480000,
    uploadDate: new Date(Date.now() - 3600000 * 12).toISOString().split("T")[0],
    status: "Ready",
    textContent: `Schrodinger Equation describes how the quantum state of a physical system changes over time. Wavefunction (Psi) represents probability density |Psi|^2. Heisenberg Uncertainty Principle states delta_x * delta_p >= hbar / 2. Quantum tunneling enables particles to pass through potential energy barriers higher than their kinetic energy.`,
    extractedSummary: "Foundational wave mechanics: Schrodinger equation, Heisenberg uncertainty, and quantum tunneling probability.",
    notes: "Prepare for lab experiment on wave interference."
  }
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: "note-1",
    userId: "demo-user-123",
    subjectId: "sub-1",
    title: "Graph Algorithms Quick Reference",
    content: "Dijkstra's Algorithm uses a priority queue with time complexity O((V + E) log V). Bellman-Ford handles negative edge weights in O(V * E). Topological sort applies to Directed Acyclic Graphs (DAGs).",
    isPinned: true,
    isFavorite: true,
    tags: ["Algorithms", "Midterm Prep", "Graphs"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "note-2",
    userId: "demo-user-123",
    subjectId: "sub-4",
    title: "Cognitive Memory & Spaced Repetition",
    content: "Ebbinghaus Forgetting Curve shows memory retention drops by 60% within 24 hours without review. Spaced repetition actively reinforces neural connections before decay occurs.",
    isPinned: true,
    isFavorite: false,
    tags: ["Psychology", "Study Tips", "Memory"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_DECKS: FlashcardDeck[] = [
  {
    id: "deck-1",
    userId: "demo-user-123",
    title: "Data Structures & Complexity Essentials",
    subjectId: "sub-1",
    createdAt: new Date().toISOString(),
    cards: [
      { id: "fc-1", front: "What is the time complexity of searching in a Balanced Binary Search Tree?", back: "O(log N)", mastered: true },
      { id: "fc-2", front: "Define Memoization in Dynamic Programming.", back: "Caching results of expensive function calls to avoid recomputing overlapping subproblems.", mastered: false },
      { id: "fc-3", front: "What is the primary difference between Stack and Queue?", back: "Stack is Last-In-First-Out (LIFO); Queue is First-In-First-Out (FIFO).", mastered: true },
      { id: "fc-4", front: "What is a Hash Collision?", back: "When two distinct keys produce the exact same hash index value in a hash table.", mastered: false }
    ]
  },
  {
    id: "deck-2",
    userId: "demo-user-123",
    title: "Linear Algebra Definitions & Theorems",
    subjectId: "sub-2",
    createdAt: new Date().toISOString(),
    cards: [
      { id: "fc-5", front: "What is the Characteristic Equation for eigenvalues?", back: "det(A - lambda * I) = 0", mastered: false },
      { id: "fc-6", front: "When is a square matrix invertible?", back: "When its determinant is non-zero (det(A) != 0) and its columns are linearly independent.", mastered: true }
    ]
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-1",
    title: "12-Day Study Streak",
    description: "Maintained a continuous daily study session for over 10 consecutive days.",
    icon: "Flame",
    unlocked: true,
    unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "ach-2",
    title: "Document Scholar",
    description: "Uploaded and processed 3+ course study materials in the Upload Center.",
    icon: "FileText",
    unlocked: true,
    unlockedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "ach-3",
    title: "Quiz Master",
    description: "Scored 80%+ on an AI-generated adaptive subject quiz.",
    icon: "Award",
    unlocked: true,
    unlockedAt: new Date().toISOString(),
  },
  {
    id: "ach-4",
    title: "Pomodoro Champion",
    description: "Completed 10 full Pomodoro focus study sprints.",
    icon: "Clock",
    unlocked: false,
  },
  {
    id: "ach-5",
    title: "AI Power User",
    description: "Utilized all AI study tools: Summarizer, Quiz, Study Plan, and Doc Chat.",
    icon: "Zap",
    unlocked: false,
  }
];
export const INITIAL_USER: UserProfile = {
  uid: "student-default",
  email: "student@university.edu",
  displayName: "Student",
  photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  university: "University",
  degreeProgram: "Degree Program",
  semester: "Current Semester",
  timeZone: "UTC-5 (Eastern Time)",
  weeklyGoalHours: 15,
  currentStreak: 1,
  darkMode: false,
  notifications: true,
  language: "English",
  createdAt: new Date().toISOString(),
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: "sub-1",
    userId: "student-123",
    name: "Computer Science",
    color: "#4F46E5", // Indigo
    teacher: "Prof. Davis",
    credits: 4,
    description: "Algorithms, Data Structures & Complexity Theory",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sub-2",
    userId: "student-123",
    name: "Mathematics",
    color: "#7C3AED", // Violet
    teacher: "Dr. Evans",
    credits: 3,
    description: "Linear Algebra & Multivariable Calculus",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sub-3",
    userId: "student-123",
    name: "Physics",
    color: "#06B6D4", // Cyan
    teacher: "Dr. Miller",
    credits: 4,
    description: "Quantum Mechanics & Electricity & Magnetism",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sub-4",
    userId: "student-123",
    name: "Psychology",
    color: "#EC4899", // Pink
    teacher: "Prof. Vance",
    credits: 3,
    description: "Cognitive Science, Memory & Learning Pathways",
    createdAt: new Date().toISOString(),
  },
];

const getFutureDate = (daysAhead: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split("T")[0];
};

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: "ass-1",
    userId: "demo-user-123",
    title: "CS301 Homework 4 - Dynamic Programming",
    subjectId: "sub-1",
    deadline: getFutureDate(2),
    priority: "High",
    status: "In Progress",
    description: "Implement Knapsack and Shortest Path algorithms in C++ with complexity analysis.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ass-2",
    userId: "demo-user-123",
    title: "MATH202 Linear Algebra Midterm Prep",
    subjectId: "sub-2",
    deadline: getFutureDate(5),
    priority: "High",
    status: "Not Started",
    description: "Solve Problem Set 6: Eigenvalues, Eigenvectors, and Matrix Diagonalization.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ass-3",
    userId: "demo-user-123",
    title: "PSY101 Memory Retrieval Synthesis Essay",
    subjectId: "sub-4",
    deadline: getFutureDate(-1), // Completed yesterday
    priority: "Medium",
    status: "Completed",
    description: "Analyze the spacing effect vs massed practice in long-term memory consolidation.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ass-4",
    userId: "demo-user-123",
    title: "PHYS105 Lab Report - Photoelectric Effect",
    subjectId: "sub-3",
    deadline: getFutureDate(4),
    priority: "Medium",
    status: "In Progress",
    description: "Plot kinetic energy vs light frequency and calculate Planck's constant from lab data.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ass-5",
    userId: "demo-user-123",
    title: "CS301 Group Project Milestones",
    subjectId: "sub-1",
    deadline: getFutureDate(10),
    priority: "Low",
    status: "Not Started",
    description: "Finalize system architecture diagram and API schema specs for course project.",
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_SESSIONS: StudySession[] = [
  {
    id: "ses-1",
    userId: "demo-user-123",
    subjectId: "sub-1",
    title: "Graph Traversal BFS & DFS Deep Dive",
    date: getFutureDate(0), // Today
    durationMinutes: 90,
    priority: "High",
    status: "Scheduled",
    notes: "Focus on queue vs stack memory implementations and cycle detection.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ses-2",
    userId: "demo-user-123",
    subjectId: "sub-2",
    title: "Determinants & Matrix Inversion Drills",
    date: getFutureDate(0), // Today
    durationMinutes: 60,
    priority: "Medium",
    status: "Scheduled",
    notes: "Practice Cramer's Rule and Gaussian Elimination speed drills.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ses-3",
    userId: "demo-user-123",
    subjectId: "sub-3",
    title: "Schrödinger Wave Equation Problems",
    date: getFutureDate(1), // Tomorrow
    durationMinutes: 120,
    priority: "High",
    status: "Scheduled",
    notes: "Review 1D infinite potential well boundary conditions.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ses-4",
    userId: "demo-user-123",
    subjectId: "sub-4",
    title: "Working Memory & Neural Plasticity Reading",
    date: getFutureDate(-1), // Yesterday
    durationMinutes: 45,
    priority: "Low",
    status: "Completed",
    notes: "Completed chapter 4 reading and flashcards summary.",
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_AI_HISTORY: AIHistoryItem[] = [
  {
    id: "ai-1",
    userId: "demo-user-123",
    type: "chat",
    title: "Understanding Dynamic Programming Overlapping Subproblems",
    payload: JSON.stringify({
      messages: [
        { role: "user", content: "Can you explain the difference between Top-Down Memoization and Bottom-Up Tabulation in Dynamic Programming?" },
        { role: "assistant", content: "Great question! Let's break down Dynamic Programming step-by-step:\n\n1. **Top-Down (Memoization)**: You start with the main problem and recursively break it down. When you compute a subproblem, you store its result in a lookup table (e.g., hash map or array) so you never re-compute it.\n\n2. **Bottom-Up (Tabulation)**: You start by solving the smallest base subproblems first, building a table iteratively up to the final solution.\n\n**Example**: Calculating Fibonacci numbers. Memoization uses recursion + caching; Tabulation fills an array from index 0 to N with a loop." }
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

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    quote: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
    category: "Persistence",
  },
  {
    quote: "The mind is not a vessel to be filled, but a fire to be kindled.",
    author: "Plutarch",
    category: "Curiosity",
  },
  {
    quote: "Future belongs to those who prepare for it today.",
    author: "Malcolm X",
    category: "Focus",
  },
  {
    quote: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    category: "Motivation",
  },
  {
    quote: "Continuous learning is the minimum requirement for success in any field.",
    author: "Brian Tracy",
    category: "Growth",
  },
];

// LocalStorage Persistence Helpers
const STORAGE_KEYS = {
  USER: "studypilot_user",
  SUBJECTS: "studypilot_subjects",
  ASSIGNMENTS: "studypilot_assignments",
  SESSIONS: "studypilot_sessions",
  AI_HISTORY: "studypilot_ai_history",
};

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    const parsed = JSON.parse(item);
    if (parsed === null || parsed === undefined) return defaultValue;
    if (Array.isArray(defaultValue) && !Array.isArray(parsed)) return defaultValue;
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
