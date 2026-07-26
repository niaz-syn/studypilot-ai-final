import React from "react";
import {
  Sparkles,
  Compass,
  CheckSquare,
  HelpCircle,
  FileText,
  BarChart3,
  CalendarDays,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Brain,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import { ActiveTab } from "../types";

interface LandingPageProps {
  onStartFree: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  darkMode: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartFree,
  setActiveTab,
  darkMode,
}) => {
  const features = [
    {
      icon: <Compass className="w-6 h-6 text-indigo-500" />,
      title: "AI Study Planner",
      description: "Generates tailored daily study schedules based on exam dates, subjects, and available hours.",
    },
    {
      icon: <CheckSquare className="w-6 h-6 text-purple-500" />,
      title: "Assignment Tracking",
      description: "Manage upcoming deadlines, priorities, and task status in one clear central dashboard.",
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-cyan-500" />,
      title: "AI Quiz Generator",
      description: "Turn course topics or notes into instant multiple-choice practice quizzes with explanations.",
    },
    {
      icon: <FileText className="w-6 h-6 text-emerald-500" />,
      title: "Notes Summarizer",
      description: "Extract core concepts, key takeaways, and flashcards from long textbook or lecture notes.",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-amber-500" />,
      title: "Progress Dashboard",
      description: "Track study streaks, weekly study hours, and task completion metrics visually.",
    },
    {
      icon: <CalendarDays className="w-6 h-6 text-rose-500" />,
      title: "Study Calendar",
      description: "Visual monthly overview combining assignments, study blocks, and exam dates.",
    },
  ];

  const testimonials = [
    {
      quote: "StudyPilot AI transformed my exam prep. The AI generated a study schedule that fit my exact routine, and I boosted my GPA from 3.2 to 3.9!",
      name: "Sophia Chen",
      role: "Computer Science Major, Stanford",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
    {
      quote: "The Quiz Generator and Notes Summarizer cut my study time in half while improving my test retention. I can't study without it now.",
      name: "Marcus Miller",
      role: "Pre-Med Student, Johns Hopkins",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
    {
      quote: "As a high school senior juggling 5 AP classes, keeping deadlines organized used to give me anxiety. StudyPilot keeps me calm and focused.",
      name: "Elena Rostova",
      role: "High School Senior, NY",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    },
  ];

  return (
    <div id="landing-page-root" className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-indigo-50/70 via-purple-50/30 to-transparent dark:from-slate-900 dark:via-slate-900/50 dark:to-slate-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-100/80 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Powered by Google Gemini 3.6 Flash</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
            Study Smarter. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Plan Better.
            </span>{" "}
            Achieve More.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            StudyPilot AI helps students organize their schedule, manage assignments, generate personalized study plans, and learn faster using AI.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-start-free-btn"
              onClick={onStartFree}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-base shadow-lg shadow-indigo-500/30 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
            >
              <span>Start Free Today</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              id="hero-demo-btn"
              onClick={() => setActiveTab("dashboard")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-base hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Open Interactive Dashboard</span>
            </button>
          </div>

          {/* Key Stat Badges */}
          <div className="mt-14 pt-8 border-t border-slate-200/60 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div>
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">50K+</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">98%</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">On-Time Assignments</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">3.8+</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Average GPA Boost</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Free & Open Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section id="features-section" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
              ALL-IN-ONE ACADEMIC ENGINE
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Everything You Need To Master Your Studies
            </p>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Replace multiple disjoined apps with one intelligent, unified workspace built for modern learning.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 hover:-translate-y-1 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section id="preview-section" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
              INTERACTIVE DASHBOARD PREVIEW
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Designed For Focus, Clarity, And Productivity
            </p>
          </div>

          <div className="relative rounded-3xl p-4 sm:p-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white shadow-2xl overflow-hidden border border-slate-700">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs text-slate-400 font-mono">studypilot.ai/dashboard</span>
              </div>
              <button
                onClick={() => setActiveTab("dashboard")}
                className="px-3 py-1 rounded-lg bg-indigo-600 text-xs font-semibold hover:bg-indigo-500 transition"
              >
                Launch Live App
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-indigo-400 uppercase">Today's Schedule</span>
                  <span className="text-xs text-slate-400">2 Sessions</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">Algorithms BFS & DFS</div>
                      <div className="text-xs text-slate-400">10:00 AM • 90 mins</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                      High
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">Linear Algebra Practice</div>
                      <div className="text-xs text-slate-400">02:30 PM • 60 mins</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/20 text-violet-300">
                      Medium
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-purple-400 uppercase">Upcoming Deadlines</span>
                  <span className="text-xs text-rose-400 font-semibold">In 2 Days</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700">
                  <div className="text-sm font-bold text-white">CS301 Homework 4</div>
                  <div className="text-xs text-slate-400 mt-1">Dynamic Programming & Graph Complexity</div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-amber-400">In Progress (60%)</span>
                    <button
                      onClick={() => setActiveTab("assignments")}
                      className="text-xs text-indigo-400 underline font-semibold"
                    >
                      View Assignment
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-cyan-400 uppercase">AI Learning Hub</span>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-xs text-slate-300 italic mb-4">
                  "Explain Quantum Tunneling in simple terms with a real-world analogy."
                </p>
                <button
                  onClick={() => setActiveTab("ai-assistant")}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-xs font-bold hover:opacity-90 transition text-center"
                >
                  Ask Gemini AI Assistant
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials-section" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
              STUDENT REVIEWS
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Loved By Students Worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">"{t.quote}"</p>
                </div>
                <div className="mt-8 flex items-center space-x-3 pt-4 border-t border-slate-200/60 dark:border-slate-700">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold">Ready To Revolutionize Your Study Workflow?</h2>
          <p className="mt-4 text-indigo-100 text-lg max-w-2xl mx-auto">
            Join thousands of students achieving top grades with less stress. Free to use forever.
          </p>
          <div className="mt-8 flex items-center justify-center space-x-4">
            <button
              onClick={onStartFree}
              className="px-8 py-4 rounded-2xl bg-white text-indigo-600 font-bold text-base hover:bg-slate-100 shadow-xl transition"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">StudyPilot AI</span>
          </div>
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} StudyPilot AI. Your AI-Powered Study Companion. Built for academic success.
          </p>
          <div className="flex items-center space-x-4 text-xs">
            <button onClick={() => setActiveTab("dashboard")} className="hover:text-white transition">
              Dashboard
            </button>
            <button onClick={() => setActiveTab("ai-assistant")} className="hover:text-white transition">
              AI Assistant
            </button>
            <button onClick={() => setActiveTab("settings")} className="hover:text-white transition">
              Settings
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
