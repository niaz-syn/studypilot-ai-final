# StudyPilot AI

> **An Intelligent AI-Powered Educational Assistant & University Final Project**

StudyPilot AI is a comprehensive AI-powered academic companion designed to help university and high school students manage their studies, organize assignments, create personalized study plans, analyze course materials, and improve learning through artificial intelligence.

---

# 📚 Table of Contents

- Overview
- Features
- Live Demo
- Technologies Used
- AI Architecture
- System Architecture
- Local Storage
- Installation & Setup
- Folder Structure
- Screenshots
- Deployment
- Future Improvements
- License

---

# 📖 Overview

## The Problem

Students often struggle to manage multiple courses, assignments, deadlines, lecture notes, and study schedules simultaneously. Traditional productivity applications organize tasks but rarely provide intelligent academic assistance. Likewise, generic AI chatbots answer questions without helping students actively learn or retain information.

---

## Target Audience

StudyPilot AI is designed for:

- University students
- College students
- High school students
- Self-directed learners
- Researchers
- Competitive exam candidates

---

## The Solution

StudyPilot AI combines academic organization with artificial intelligence into one unified platform.

The application provides:

- AI tutoring for difficult concepts
- Assignment management
- Personalized study planning
- Course document summarization
- Quiz generation
- Flashcard generation
- Subject management
- Study analytics
- Calendar scheduling
- Pomodoro productivity timer
- Cloud synchronization using Firebase

---

# ✨ Key Features

## 🤖 Artificial Intelligence

- AI Academic Tutor
- AI Document Chat
- AI Document Summarizer
- AI Quiz Generator
- AI Flashcard Generator
- AI Study Planner
- AI Assignment Breakdown
- AI Exam Readiness Assistant
- AI Productivity Insights
- AI Mind Map Outline Generator

---

## 📚 Academic Management

- Assignment Manager
- Subject Manager
- Calendar
- Study Planner
- Notes Manager
- Upload Center
- Dashboard
- Progress Analytics

---

## 👤 User Features

- Firebase Authentication
- Firestore Cloud Sync
- Offline Local Storage
- Dark Theme
- Light Theme
- Responsive Design
- Mobile Friendly Interface

---

# 🌐 Live Demo

## Production Deployment

https://studypilot-ai-final.vercel.app/

---

# 🚀 Technologies Used

## Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Recharts

---

## Backend

- Node.js
- Express.js

---

## Artificial Intelligence

- Google Gemini API
- @google/genai SDK

---

## Database

- Firebase Firestore
- Local Storage

---

## Authentication

- Firebase Authentication

---

## Deployment

- Vercel

---

## Version Control

- Git
- GitHub

---

# 🤖 AI Architecture

StudyPilot AI securely communicates with the Google Gemini API through an Express backend.

The backend protects the API key by ensuring all AI requests are processed server-side.

Current AI capabilities include:

- Intelligent tutoring
- Concept explanations
- Document summarization
- Flashcard generation
- Quiz generation
- Study plan generation
- Assignment breakdown
- Exam readiness estimation
- Productivity insights
- Mind map generation

---

## AI Model

Google Gemini Flash

SDK:

```
@google/genai
```

---

## AI System Prompt

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

# 🏗️ System Architecture

```text
                React + Vite
                     │
                     ▼
             Express Backend API
                     │
                     ▼
              Google Gemini API
                     │
                     ▼
              JSON API Response
                     │
                     ▼
             StudyPilot AI Interface

Authentication
└── Firebase Authentication

Database
├── Local Storage
└── Firebase Firestore
```

---

# 💾 Local Storage

StudyPilot AI stores the following data locally:

- User preferences
- Theme
- Dashboard settings
- Study sessions
- Subjects
- Assignments
- Notes
- Flashcards
- Quiz history
- Chat history

When Firebase is configured, local data can also be synchronized with Firestore.

---

# ⚙️ Installation & Local Setup

## Prerequisites

Before running StudyPilot AI locally, ensure the following software is installed:

- Node.js (v18 or later)
- npm (v9 or later)
- Git
- Google Gemini API Key (from Google AI Studio)
- Firebase Project (Optional)

---

## 1. Clone the Repository

```bash
git clone https://github.com/niaz-syn/studypilot-ai-final.git
cd studypilot-ai-final
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project root.

You can copy the example configuration:

```bash
cp .env.example .env
```

Replace the placeholder values with your own configuration.

```env
# =====================================
# Google Gemini API
# =====================================

GEMINI_API_KEY=your_gemini_api_key

# =====================================
# Firebase Configuration
# =====================================

VITE_FIREBASE_API_KEY=your_firebase_api_key

VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com

VITE_FIREBASE_PROJECT_ID=your-project-id

VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app

VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id

VITE_FIREBASE_APP_ID=your_app_id

VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> **Important**
>
> Never commit your `.env` file or API keys to GitHub.
> Store all secrets securely using local environment variables or your hosting platform (e.g., Vercel Environment Variables).

---

## 4. Start the Development Server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

## 5. Build for Production

```bash
npm run build
```

---

## 6. Preview the Production Build

```bash
npm run preview
```

---

# 📁 Folder Structure

```text
studypilot-ai-final/
│
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   └── assets/
│
├── src/
│   │
│   ├── components/
│   │   ├── AIAssistantHub.tsx
│   │   ├── AssignmentTrackerView.tsx
│   │   ├── AuthModal.tsx
│   │   ├── CalendarView.tsx
│   │   ├── DashboardView.tsx
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
│   │
│   ├── lib/
│   │   ├── firebase.ts
│   │   ├── store.ts
│   │   └── utils.ts
│   │
│   ├── hooks/
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── server.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json
├── .env.example
├── README.md
└── screenshots/
```

---

# 📸 Application Screenshots

The following screenshots demonstrate the primary features of StudyPilot AI.

---

## Dashboard

![Dashboard](screenshots/dashboard.png)

---

## AI Assistant Hub

![AI Assistant](screenshots/assistant.png)

---

## Study Planner

![Study Planner](screenshots/planner.png)

---

## Upload Center

![Upload Center](screenshots/upload-center.png)

---

## Quiz Generator

![Quiz Generator](screenshots/quiz-generator.png)

---

## Progress Analytics

![Analytics](screenshots/analytics.png)

---

## Calendar

![Calendar](screenshots/calendar.png)

---

## Subject Management

![Subjects](screenshots/subjects.png)

---

## Assignment Manager

![Assignments](screenshots/assignments.png)

---

## Settings

![Settings](screenshots/settings.png)

---

# 🚀 Deployment

StudyPilot AI is deployed using **Vercel**, providing automatic builds, continuous deployment, and global hosting.

## Live Application

**Production Deployment**

https://studypilot-ai-final.vercel.app/

---

## Vercel Build Configuration

| Setting | Value |
|----------|-------|
| Framework Preset | Vite |
| Root Directory | `./` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

---

## Required Environment Variables

Configure the following environment variables in the Vercel Dashboard before deploying.

### Required

```env
GEMINI_API_KEY=your_gemini_api_key
```

### Optional (Firebase)

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key

VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com

VITE_FIREBASE_PROJECT_ID=your-project-id

VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app

VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id

VITE_FIREBASE_APP_ID=your_app_id

VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## Deployment Steps

### 1. Clone the Repository

```bash
git clone https://github.com/niaz-syn/studypilot-ai-final.git
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file using `.env.example`.

---

### 4. Push the Repository to GitHub

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

---

### 5. Import into Vercel

- Sign in to Vercel
- Click **Add New Project**
- Import the GitHub repository
- Configure environment variables
- Click **Deploy**

---

### 6. Continuous Deployment

Every push to the **main** branch automatically triggers a new production deployment.

---

# 🔒 Security

StudyPilot AI follows common security practices.

- Google Gemini API keys remain server-side.
- Environment variables are managed through Vercel.
- Sensitive credentials are excluded from Git using `.gitignore`.
- Firebase Authentication manages user authentication.
- Firestore Security Rules protect cloud data.
- No secrets are stored in the public repository.

---

# 📈 Future Improvements

The following enhancements are planned for future releases.

### Artificial Intelligence

- AI-generated visual mind maps
- Voice-based AI tutoring
- AI lecture transcription
- AI-powered revision recommendations
- Adaptive learning paths
- Personalized study coaching
- AI citation generation
- Research paper assistant

---

### Productivity

- Study groups
- Shared workspaces
- Real-time collaboration
- Smart notifications
- Email reminders
- Mobile application
- Offline document indexing
- Calendar synchronization

---

### Learning Features

- OCR for handwritten notes
- PDF annotation
- Interactive flashcard review
- Spaced repetition algorithm
- Practice examinations
- Performance prediction
- Subject difficulty analysis
- Semester progress tracking

---

# 🤝 Contributing

Contributions are welcome.

If you would like to improve StudyPilot AI:

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/new-feature
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push your branch.

```bash
git push origin feature/new-feature
```

5. Open a Pull Request.

---

# 📝 License

This project was developed as an **individual university final project**.

It is intended for educational, learning, and demonstration purposes.

You are free to study the code, modify it, and build upon it for personal or educational use.

---

# 🙏 Acknowledgements

Special thanks to the following technologies and communities:

- Google Gemini API
- Firebase
- React
- TypeScript
- Vite
- Tailwind CSS
- Express.js
- Vercel
- GitHub
- Lucide React
- Recharts
- Framer Motion

---

# 👨‍💻 Author

**Niaz**

University Final Project

GitHub Repository:

https://github.com/niaz-syn/studypilot-ai-final

Live Demo:

https://studypilot-ai-final.vercel.app/

---

# ⭐ Project Summary

StudyPilot AI is a modern AI-powered educational platform that combines intelligent tutoring, study planning, assignment management, document analysis, quiz generation, flashcards, analytics, and productivity tools into a single application.

Built with **React**, **TypeScript**, **Node.js**, **Express**, **Firebase**, **Google Gemini AI**, and **Vercel**, the project demonstrates a complete full-stack architecture focused on enhancing student learning through artificial intelligence.

---

**Thank you for exploring StudyPilot AI!**
