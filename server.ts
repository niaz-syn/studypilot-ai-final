import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const SYSTEM_PROMPT = `You are StudyPilot AI.

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
• If information is missing, clearly state that instead of making it up.`;

export const app = express();

app.use(express.json({ limit: "10mb" }));

// Enable CORS for Vercel and local deployments
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Initialize Gemini AI SDK safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "StudyPilot AI API" });
});

async function startServer() {

  // 1. AI Chat Assistant Route
  const chatHandler = async (req: express.Request, res: express.Response) => {
    try {
      const { message, chatHistory = [] } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message string is required." });
      }

      const ai = getGeminiClient();

      // Format previous history into prompt context
      const formattedHistory = chatHistory
        .map((m: { role: string; content: string }) => `${m.role.toUpperCase()}: ${m.content}`)
        .join("\n\n");

      const prompt = `${formattedHistory ? `Previous Conversation:\n${formattedHistory}\n\n` : ""}Student: ${message}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
        },
      });

      const reply = response.text || "I apologize, I could not process that query. Could you rephrase your question?";
      res.json({ reply });
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate response from Gemini AI" });
    }
  };

  app.post("/api/ai/chat", chatHandler);
  app.post("/api/chat", chatHandler);

  // 2. Study Plan Generator Route
  const planHandler = async (req: express.Request, res: express.Response) => {
    try {
      const { subjects, availableHours = 3, examDate, goals = "" } = req.body;

      const ai = getGeminiClient();
      const prompt = `Generate a customized multi-day study schedule for a student studying the following subjects: ${Array.isArray(subjects) ? subjects.join(", ") : subjects}.
Available study time: ${availableHours} hours per day.
Upcoming exam/deadline date: ${examDate || "In 1 week"}.
Student's goals/notes: ${goals || "General preparation"}.

Return a JSON object matching this structure strictly:
{
  "title": "Study Plan Title",
  "totalDays": 7,
  "overview": "High level study strategy overview",
  "schedule": [
    {
      "day": "Day 1 (e.g. Monday)",
      "focusSubject": "Subject Name",
      "durationMinutes": 120,
      "tasks": ["Task 1", "Task 2", "Task 3"],
      "tips": "Specific learning tip for this day"
    }
  ],
  "weeklyStrategy": "Overall summary of review strategy"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const planData = JSON.parse(text);
      res.json(planData);
    } catch (error: any) {
      console.error("AI Plan Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate study plan" });
    }
  };

  app.post("/api/ai/plan", planHandler);
  app.post("/api/ai-roadmap", planHandler);

  // 3. Quiz Generator Route
  const quizHandler = async (req: express.Request, res: express.Response) => {
    try {
      const { topic, difficulty = "Medium", questionCount = 5 } = req.body;

      if (!topic) {
        return res.status(400).json({ error: "Topic is required for generating a quiz." });
      }

      const ai = getGeminiClient();
      const prompt = `Create a ${questionCount}-question multiple-choice quiz on the topic: "${topic}".
Difficulty level: ${difficulty}.

Return a JSON object matching this schema strictly:
{
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Clear step-by-step explanation why this answer is correct."
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const quizData = JSON.parse(text);
      res.json(quizData);
    } catch (error: any) {
      console.error("AI Quiz Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate quiz" });
    }
  };

  app.post("/api/ai/quiz", quizHandler);
  app.post("/api/generate-quiz", quizHandler);

  // 4. Notes Summarizer Route
  const summarizeHandler = async (req: express.Request, res: express.Response) => {
    try {
      const { notesText, mode = "detailed", fileName = "" } = req.body;
      if (!notesText || typeof notesText !== "string") {
        return res.status(400).json({ error: "notesText string is required." });
      }

      const ai = getGeminiClient();
      const prompt = `You are a world-class academic study summarizer. Summarize the following document content according to the requested mode: "${mode}".
${fileName ? `Document Title: ${fileName}\n` : ""}
Document Content:
"""
${notesText.slice(0, 30000)}
"""

Return a JSON object matching this schema strictly:
{
  "title": "Concise & Accurate Topic Title",
  "summaryMode": "${mode}",
  "conciseSummary": "A 2-4 sentence executive overview.",
  "keyPoints": [
    "Key takeaway point 1",
    "Key takeaway point 2",
    "Key takeaway point 3"
  ],
  "definitions": [
    { "term": "Term 1", "definition": "Clear concise definition" }
  ],
  "formulas": [
    { "name": "Formula Name", "formula": "Mathematical or Scientific notation", "description": "When to apply it" }
  ],
  "dates": [
    { "date": "Historical date or milestone", "event": "Event description" }
  ],
  "people": [
    { "name": "Key Person / Author", "role": "Significance or contribution" }
  ],
  "actionItems": [
    "Study action item or practice step 1"
  ],
  "flashcards": [
    {
      "id": "card-1",
      "front": "Question or term on front of flashcard",
      "back": "Detailed answer or explanation on back"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const summaryData = JSON.parse(text);
      res.json(summaryData);
    } catch (error: any) {
      console.error("AI Summarizer Error:", error);
      res.status(500).json({ error: error.message || "Failed to summarize notes" });
    }
  };

  app.post("/api/ai/summarize", summarizeHandler);
  app.post("/api/summarize-document", summarizeHandler);

  // 4b. AI Chat with Document
  const docChatHandler = async (req: express.Request, res: express.Response) => {
    try {
      const { docText, docName, question, chatHistory = [] } = req.body;
      if (!question) {
        return res.status(400).json({ error: "Question is required." });
      }

      const ai = getGeminiClient();

      const docContext = docText
        ? `DOCUMENT CONTEXT (${docName || "Uploaded File"}):\n"""\n${docText.slice(0, 25000)}\n"""\n\n`
        : "";

      const formattedHistory = chatHistory
        .map((m: { role: string; content: string }) => `${m.role.toUpperCase()}: ${m.content}`)
        .join("\n\n");

      const prompt = `${docContext}${formattedHistory ? `Previous Chat:\n${formattedHistory}\n\n` : ""}Student Question: ${question}\n\nAnswer the question accurately based primarily on the document context provided above.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.5,
        },
      });

      const reply = response.text || "I was unable to analyze the document for this question.";
      res.json({ reply });
    } catch (error: any) {
      console.error("Doc Chat Error:", error);
      res.status(500).json({ error: error.message || "Failed to answer document question" });
    }
  };

  app.post("/api/ai/doc-chat", docChatHandler);
  app.post("/api/document-chat", docChatHandler);

  // 4c. Custom Flashcards Generator
  const flashcardsHandler = async (req: express.Request, res: express.Response) => {
    try {
      const { text, cardCount = 8, subject = "General" } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text content is required." });
      }

      const ai = getGeminiClient();
      const prompt = `Generate ${cardCount} flashcards for studying based on the following text for subject "${subject}":
"""
${text.slice(0, 20000)}
"""

Return a JSON object:
{
  "cards": [
    {
      "id": "fc-1",
      "front": "Question / Key Concept",
      "back": "Answer / Explanation"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
      });

      const textRes = response.text || "{}";
      const data = JSON.parse(textRes);
      res.json(data);
    } catch (error: any) {
      console.error("Flashcards Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate flashcards" });
    }
  };

  app.post("/api/ai/flashcards", flashcardsHandler);
  app.post("/api/generate-flashcards", flashcardsHandler);

  // 5. Motivational Coach Route
  app.post("/api/ai/motivation", async (req, res) => {
    try {
      const { streak = 1, completedTasksCount = 0, goalHours = 10 } = req.body;

      const ai = getGeminiClient();
      const prompt = `Provide an inspiring motivational message and 3 actionable study hacks for a student who has a ${streak}-day study streak and has completed ${completedTasksCount} tasks this week toward a target of ${goalHours} hours. Keep it positive, empathetic, and highly encouraging!`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.8,
        },
      });

      const message = response.text || "Keep pushing forward! Every small step brings you closer to mastery.";
      res.json({ message });
    } catch (error: any) {
      console.error("AI Motivation Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate motivational message" });
    }
  });

  // 6. Assignment Assistant Breakdown Route
  const breakdownHandler = async (req: express.Request, res: express.Response) => {
    try {
      const { assignmentTitle, description, deadline, subject } = req.body;
      if (!assignmentTitle) {
        return res.status(400).json({ error: "Assignment title is required." });
      }

      const ai = getGeminiClient();
      const prompt = `Break down the following academic assignment into 3 to 5 realistic, step-by-step subtasks with estimated duration in minutes and milestone deadlines:
Title: "${assignmentTitle}"
Subject: "${subject || "General"}"
Deadline: "${deadline || "In 3 days"}"
Details: "${description || "Standard assignment requirements"}"

Return JSON:
{
  "assignmentTitle": "${assignmentTitle}",
  "estimatedTotalMinutes": 180,
  "subtasks": [
    {
      "id": "st-1",
      "title": "Subtask title",
      "estimatedMinutes": 45,
      "suggestedDaysBeforeDeadline": 2,
      "details": "Actionable guidance for completing this subtask"
    }
  ],
  "proTip": "Pro tip to avoid procrastination on this assignment"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (error: any) {
      console.error("Assignment Breakdown Error:", error);
      res.status(500).json({ error: error.message || "Failed to breakdown assignment" });
    }
  };

  app.post("/api/ai/assignment-breakdown", breakdownHandler);
  app.post("/api/smart-breakdown", breakdownHandler);

  // 7. Exam Readiness Score Estimation Route
  const examReadinessHandler = async (req: express.Request, res: express.Response) => {
    try {
      const { subjectsData = [] } = req.body;

      const ai = getGeminiClient();
      const prompt = `Analyze a student's performance across their subjects and estimate an Exam Readiness Score (0-100%) for each subject along with key recommendations.
Data: ${JSON.stringify(subjectsData)}

Return JSON:
{
  "overallReadinessScore": 82,
  "readinessSummary": "High readiness in Computer Science, needs review in Quantum Physics.",
  "subjectScores": [
    {
      "subjectName": "Computer Science",
      "score": 88,
      "status": "Ready",
      "strengths": ["Dynamic Programming", "Data Structures"],
      "weaknesses": ["Graph Cycle Detection"],
      "actionableAdvice": "Review Dijkstra's time complexity proofs."
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (error: any) {
      console.error("Exam Readiness Error:", error);
      res.status(500).json({ error: error.message || "Failed to compute exam readiness" });
    }
  };

  app.post("/api/ai/exam-readiness", examReadinessHandler);
  app.post("/api/exam-readiness", examReadinessHandler);

  // 8. Productivity Insights Route
  const productivityHandler = async (req: express.Request, res: express.Response) => {
    try {
      const { streak = 1, totalHours = 0, completedAssignments = 0, pendingAssignments = 0 } = req.body;

      const ai = getGeminiClient();
      const prompt = `Analyze a student's study habits and output personalized productivity insights:
Streak: ${streak} days
Total Study Hours This Week: ${totalHours} hrs
Completed Assignments: ${completedAssignments}
Pending Assignments: ${pendingAssignments}

Return JSON:
{
  "focusScore": 85,
  "insightHeadline": "Consistent Focus & Positive Velocity",
  "topHabit": "Consistent daily study sessions before 8 PM",
  "recommendedAdjustment": "Schedule short 5-minute Pomodoro breaks between math drills",
  "suggestedTimeBlock": "Optimal study window: 10:00 AM - 12:30 PM",
  "tips": [
    "Tip 1 for maximizing retention",
    "Tip 2 for avoiding cognitive burnout",
    "Tip 3 for active recall testing"
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (error: any) {
      console.error("Productivity Insights Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate productivity insights" });
    }
  };

  app.post("/api/ai/productivity-insights", productivityHandler);
  app.post("/api/productivity-insights", productivityHandler);

  // 9. Text Mind Map Outline Generator Route
  const mindmapHandler = async (req: express.Request, res: express.Response) => {
    try {
      const { text, topic = "General" } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text or topic is required." });
      }

      const ai = getGeminiClient();
      const prompt = `Generate a structured hierarchical text mind map / outline for studying topic "${topic}":
Content:
"""
${text.slice(0, 20000)}
"""

Return JSON:
{
  "centralTopic": "Central Topic Title",
  "nodes": [
    {
      "id": "node-1",
      "title": "Main Branch 1",
      "subnodes": [
        "Sub-topic A",
        "Sub-topic B"
      ]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (error: any) {
      console.error("Mindmap Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate mind map" });
    }
  };

  app.post("/api/ai/mindmap", mindmapHandler);
  app.post("/api/mindmap", mindmapHandler);

  // Vite middleware setup
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudyPilot AI Server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
