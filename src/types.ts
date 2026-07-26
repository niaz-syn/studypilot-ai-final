export type Priority = 'High' | 'Medium' | 'Low';
export type AssignmentStatus = 'Not Started' | 'In Progress' | 'Completed';
export type SessionStatus = 'Scheduled' | 'Completed' | 'Cancelled';
export type AIFeatureType = 'chat' | 'plan' | 'quiz' | 'summary' | 'coach' | 'doc_chat' | 'flashcards';

export type SummaryMode =
  | 'short'
  | 'detailed'
  | 'bullet'
  | 'chapter'
  | 'exam'
  | 'key_concepts'
  | 'definitions'
  | 'formulas'
  | 'dates'
  | 'people'
  | 'glossary'
  | 'action_items'
  | 'study_notes'
  | 'revision_notes';

export type QuizType = 'multiple_choice' | 'true_false' | 'short_answer' | 'fill_blank';
export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  university?: string;
  degreeProgram?: string;
  semester?: string;
  timeZone?: string;
  dailyGoalHours?: number;
  weeklyGoalHours: number;
  monthlyGoalHours?: number;
  currentStreak: number;
  darkMode: boolean;
  notifications: boolean;
  language: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  userId: string;
  name: string;
  color: string;
  teacher?: string;
  credits?: number;
  description?: string;
  attendancePercent?: number;
  targetGrade?: string;
  progressPercent?: number;
  createdAt: string;
}

export interface Assignment {
  id: string;
  userId: string;
  title: string;
  subjectId: string;
  deadline: string; // YYYY-MM-DD
  priority: Priority;
  status: AssignmentStatus;
  description?: string;
  isExam?: boolean;
  createdAt: string;
}

export interface StudySession {
  id: string;
  userId: string;
  subjectId: string;
  title?: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  priority: Priority;
  status: SessionStatus;
  notes?: string;
  createdAt: string;
}

export interface UploadedFile {
  id: string;
  userId: string;
  name: string;
  subjectId: string;
  type: string; // 'PDF' | 'DOCX' | 'TXT' | 'MD' | 'PPTX' | 'CSV' | 'PNG' | 'JPG'
  size: number; // bytes
  uploadDate: string;
  status: 'Ready' | 'Processing' | 'Error';
  textContent: string; // extracted text content for AI
  extractedSummary?: string;
  notes?: string;
}

export interface NoteItem {
  id: string;
  userId: string;
  subjectId: string;
  title: string;
  content: string;
  isPinned: boolean;
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AIHistoryItem {
  id: string;
  userId: string;
  type: AIFeatureType;
  title: string;
  payload: string; // JSON string or markdown
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface StudyPlanDay {
  day: string;
  focusSubject: string;
  durationMinutes: number;
  tasks: string[];
  tips: string;
}

export interface StudyPlanResult {
  title: string;
  totalDays: number;
  overview: string;
  schedule: StudyPlanDay[];
  weeklyStrategy: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options?: string[];
  correctAnswer: string; // string or index
  correctAnswerIndex?: number;
  explanation: string;
}

export interface QuizResult {
  id?: string;
  topic: string;
  difficulty: QuizDifficulty;
  quizType: QuizType;
  questions: QuizQuestion[];
  score?: number;
  createdAt?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  mastered?: boolean;
}

export interface FlashcardDeck {
  id: string;
  userId: string;
  title: string;
  subjectId: string;
  cards: Flashcard[];
  createdAt: string;
}

export interface NoteSummaryResult {
  title: string;
  summaryMode?: SummaryMode;
  conciseSummary: string;
  keyPoints: string[];
  definitions?: { term: string; definition: string }[];
  formulas?: { name: string; formula: string; description: string }[];
  dates?: { date: string; event: string }[];
  people?: { name: string; role: string }[];
  actionItems?: string[];
  flashcards?: Flashcard[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface MotivationalQuote {
  quote: string;
  author: string;
  category: string;
}

export type ActiveTab = 
  | 'landing'
  | 'dashboard' 
  | 'planner' 
  | 'assignments' 
  | 'subjects' 
  | 'calendar' 
  | 'ai-assistant'
  | 'quiz'
  | 'notes'
  | 'summarizer'
  | 'uploads'
  | 'analytics' 
  | 'settings';

