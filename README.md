# StudyPilot AI

> **An Intelligent AI-Powered Educational Assistant & Final University Project**

StudyPilot AI is a comprehensive study management and academic assistant platform designed to help university and high school students optimize their learning, organize assignments, generate personalized study schedules, track study habits, and leverage state-of-the-art AI to master difficult subjects.

---

## Overview

### The Problem
Modern students face academic burnout and information overload. Juggling multiple subjects, tight assignment deadlines, complex lecture slides, and unorganized study schedules leads to ineffective passive learning and last-minute cramming. Standard task managers lack educational intelligence, while standard AI chatbots give direct answers without fostering genuine concept comprehension.

### Target Audience
- University and college students managing heavy course loads.
- High school students preparing for standardized exams.
- Self-directed learners and academic researchers needing intelligent document synthesis and structured study planning.

### The Solution
**StudyPilot AI** bridges academic organization and cognitive learning:
1. **Centralized Academic Hub**: Tracks assignments, study sessions, course subjects, and calendars with interactive Kanban boards and Pomodoro timers.
2. **AI Learning Engine**: Uses Google Gemini API (`gemini-3.6-flash`) with pedagogical system instructions designed to guide students step-by-step through Socratic questioning, active recall quizzes, interactive flashcards, and multi-mode document summarization (PDF/DOCX/TXT).
3. **Hybrid Persistence**: Features immediate local state storage backed by optional Firebase Firestore cloud synchronization and authentication.

---

## Live Demo

🚀 **Production Deployment**: [https://studypilot-ai.vercel.app](https://studypilot-ai.vercel.app)  
⚡ **Development App**: [https://ais-dev-2uj6u6qcpxkp5iys2d7zak-452567585443.asia-east1.run.app](https://ais-dev-2uj6u6qcpxkp5iys2d7zak-452567585443.asia-east1.run.app)

---

## Features

- **User Authentication**: Google OAuth and Email/Password sign-in powered by Firebase Authentication with local guest session support.
- **Interactive Dashboard**: High-level academic overview showing daily study targets, active study streak, upcoming assignment deadlines, and quick navigation.
- **Study Planner & Pomodoro Timer**: Multi-session study planner with integrated Pomodoro timer, break cycles, audio alerts, and subject tagging.
- **Assignment Manager**: Full Kanban and list views for tracking assignment status (To Do, In Progress, Completed), priority levels, and urgency badges.
- **Academic Calendar**: Monthly visual calendar with date-filtered study sessions and upcoming assignment deadlines.
- **Subject Manager**: Custom subject creation with custom color codes, target weekly study hours, and linked resource tracking.
- **AI Study Assistant (AI Hub)**: Interactive multi-turn chat supporting general academic inquiries, Socratic concept explanations, step-by-step problem solving, and study hacks.
- **Document Chat**: Upload and interrogate course documents (PDF, DOCX, TXT) with context-bounded AI retrieval.
- **AI Notes & Document Summarizer**: Generate structured summaries from uploaded lecture notes and slide decks in multiple modes (Concise, Detailed, Bullet Points, Exam Review, Executive, Formula Sheet).
- **Quiz Generator**: Generate custom multiple-choice quizzes with instant grading, score analytics, and step-by-step answer explanations.
- **Flashcard Generator**: Generate digital flashcard decks with active recall flip animations and review progress tracking.
- **Progress Analytics**: Visual analytics powered by Recharts showing weekly study hour trends, subject distribution charts, and completion rates.
- **Study Streak Counter**: Daily activity tracking with motivational coaching messages.
- **Pomodoro Timer**: Customizable focus and break intervals with sound synthesis and confetti celebrations.
- **Notifications System**: Real-time top navigation bell with urgent deadline alerts and study reminders.
- **Local Storage & Firebase Synchronization**: Dual persistence engine supporting immediate offline local usage and secure Firestore cloud sync.
- **Profile & Settings Management**: Manage user profiles, academic goals, daily target study hours, and data export/import.
- **Dark Mode**: Full system dark and light theme switching with persistent user preference.
- **Responsive Design**: Desktop-first and mobile-optimized layouts built with Tailwind CSS.

---

## AI Feature & System Prompt

### How the AI Works
StudyPilot AI communicates with the Google Gemini API (`gemini-3.6-flash`) via a secure Express backend (`/api/ai/*`). The AI is explicitly configured with a pedagogical system prompt to guide students toward active recall and deep understanding rather than simply outputting raw solutions.

- **Model Used**: `gemini-3.6-flash` via `@google/genai` TypeScript SDK
- **Backend Architecture**: Express.js proxy ensuring API key secrecy
- **Capabilities**: Socratic AI tutoring, PDF/DOCX/TXT document analysis, flashcards synthesis, multi-mode note summarization, structured JSON quiz generation, and adaptive study schedule creation.

### Exact System Prompt
```text
You are StudyPilot AI.

You are an intelligent educational assistant whose goal is to help students learn effectively instead of simply giving answers.

Always:

• Explain concepts clearly.
• Break difficult topics into smaller steps.
• Use simple language.
• Give practical examples.
• Generate personalized study plans.
• Summarize notes accurately.
• Generate quizzes and flashcards.
• Encourage active learning.
• Ask follow-up questions if needed.
• Never encourage cheating or academic dishonesty.
• When answering questions about uploaded documents, rely on the uploaded content whenever possible.
• If information is missing, clearly state that instead of making it up.
```

---

## Technologies Used

- **Frontend Framework**: React 18 with TypeScript and Vite
- **UI & Styling**: Tailwind CSS, Lucide React Icons, Framer Motion
- **Data Visualization**: Recharts, Canvas-Confetti
- **Backend Server**: Node.js & Express
- **AI Integration**: Google Gemini API (`@google/genai` SDK)
- **Database & Authentication**: Firebase Firestore & Firebase Auth
- **Deployment & Hosting**: Vercel & Google Cloud Run

---

## Installation & Local Setup

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)
- Google Gemini API Key (from Google AI Studio)

### Step-by-Step Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/studypilot-ai.git
   cd studypilot-ai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY="AIzaSyYourActualGeminiApiKey"
   PORT=3000
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

---

## Folder Structure

```
studypilot-ai/
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Modular React UI components
│   │   ├── AIAssistantHub.tsx
│   │   ├── AssignmentTrackerView.tsx
│   │   ├── AuthModal.tsx
│   │   ├── CalendarView.tsx
│   │   ├── DashboardView.tsx
│   │   ├── GlobalSearchModal.tsx
│   │   ├── LandingPage.tsx
│   │   ├── Navbar.tsx
│   │   ├── NotesView.tsx
│   │   ├── ProgressAnalyticsView.tsx
│   │   ├── QuizGeneratorView.tsx
│   │   ├── SettingsView.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StudyPlannerView.tsx
│   │   ├── SubjectsView.tsx
│   │   ├── SummarizerView.tsx
│   │   ├── TopNav.tsx
│   │   └── UploadCenterView.tsx
│   ├── lib/                # Storage, Firebase & utility helpers
│   │   ├── firebase.ts
│   │   └── store.ts
│   ├── App.tsx             # Root React Application Component
│   ├── main.tsx            # React DOM Entrypoint
│   ├── types.ts            # Shared TypeScript Types & Interfaces
│   └── index.css           # Global Tailwind CSS Entrypoint
├── server.ts               # Express Backend Proxy for Gemini API
├── vercel.json             # Vercel Deployment Configuration
├── .env.example            # Environment Variable Specification
├── package.json            # Manifest & Dependency Specifications
└── README.md               # Project Documentation
```

---

## Screenshots

*(Screenshots can be captured and inserted below after deployment)*

### Home Page / Landing
![Home Page](https://via.placeholder.com/800x450.png?text=StudyPilot+AI+-+Home+Landing+Page)

### Dashboard
![Dashboard](https://via.placeholder.com/800x450.png?text=StudyPilot+AI+-+Dashboard+Overview)

### AI Assistant & Document Chat
![AI Assistant](https://via.placeholder.com/800x450.png?text=StudyPilot+AI+-+AI+Assistant+Hub)

### Study Planner & Pomodoro
![Study Planner](https://via.placeholder.com/800x450.png?text=StudyPilot+AI+-+Study+Planner)

### Document Summarizer
![Document Summarizer](https://via.placeholder.com/800x450.png?text=StudyPilot+AI+-+Document+Summarizer)

---

## Deployment to Vercel

1. **Push Code to GitHub**:
   Ensure all changes are committed and pushed to a public or private GitHub repository.

2. **Connect to Vercel**:
   - Log in to your [Vercel Dashboard](https://vercel.com).
   - Click **Add New** > **Project** and select your GitHub repository.

3. **Configure Environment Variables**:
   In Vercel project settings, add:
   - `GEMINI_API_KEY`: Your Gemini API key from Google AI Studio.

4. **Deploy**:
   - Vercel automatically detects Vite and uses `npm run build`.
   - Click **Deploy**. Vercel will build static assets into `dist/` and route API calls seamlessly.

---

## License

This project is open-source and created as a **University Final Project**. Feel free to use, modify, and distribute under the MIT License.
