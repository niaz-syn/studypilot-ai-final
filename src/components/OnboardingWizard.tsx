import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  CheckSquare,
  UploadCloud,
  Target,
  Compass,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import { UserProfile, Subject } from "../types";

interface OnboardingWizardProps {
  user: UserProfile;
  onUpdateUser: (props: Partial<UserProfile>) => void;
  onCreateSubject: (sub: Omit<Subject, "id" | "createdAt" | "userId">) => void;
  onCreateAssignment: (ass: any) => void;
  onFinishOnboarding: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  user,
  onUpdateUser,
  onCreateSubject,
  onCreateAssignment,
  onFinishOnboarding,
}) => {
  const [step, setStep] = useState(1);

  // Step 1: Profile
  const [displayName, setDisplayName] = useState(user.displayName || "Student");
  const [university, setUniversity] = useState(user.university || "State University");
  const [degreeProgram, setDegreeProgram] = useState(user.degreeProgram || "Computer Science");
  const [semester, setSemester] = useState(user.semester || "Fall Semester");
  const [weeklyGoalHours, setWeeklyGoalHours] = useState(user.weeklyGoalHours || 15);

  // Step 2: Subject
  const [subjectName, setSubjectName] = useState("Computer Science");
  const [teacher, setTeacher] = useState("Prof. Davis");
  const [credits, setCredits] = useState(4);
  const [subjectColor, setSubjectColor] = useState("#4F46E5");

  // Step 3: Assignment
  const [assignmentTitle, setAssignmentTitle] = useState("Course Reading & Assignment 1");
  const [assignmentDeadline, setAssignmentDeadline] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0]
  );
  const [assignmentPriority, setAssignmentPriority] = useState<"High" | "Medium" | "Low">("High");

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      displayName,
      university,
      degreeProgram,
      semester,
      weeklyGoalHours,
    });
    setStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (subjectName.trim()) {
      onCreateSubject({
        name: subjectName,
        teacher,
        credits,
        color: subjectColor,
        description: `Primary subject for ${degreeProgram}`,
      });
    }
    setStep(3);
  };

  const handleStep3Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (assignmentTitle.trim()) {
      onCreateAssignment({
        title: assignmentTitle,
        deadline: assignmentDeadline,
        priority: assignmentPriority,
        status: "Not Started",
        description: "Initial coursework assignment created during onboarding",
      });
    }
    setStep(4);
  };

  const handleCompleteOnboarding = () => {
    onFinishOnboarding();
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-indigo-500/30 space-y-8 animate-fade-in my-4">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Welcome to StudyPilot AI • Step {step} of 4</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {step === 1 && "Complete Your Scholar Profile"}
            {step === 2 && "Add Your First Subject"}
            {step === 3 && "Create Your First Assignment"}
            {step === 4 && "You're All Set!"}
          </h2>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-8 h-2.5 rounded-full transition-all ${
                i <= step ? "bg-indigo-400" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1 Form */}
      {step === 1 && (
        <form onSubmit={handleStep1Next} className="space-y-6">
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
            Let's personalize your academic hub with your real university details and weekly target.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-indigo-200 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-indigo-200 mb-1">University / Institute</label>
              <input
                type="text"
                required
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-indigo-200 mb-1">Degree Program / Major</label>
              <input
                type="text"
                required
                value={degreeProgram}
                onChange={(e) => setDegreeProgram(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-indigo-200 mb-1">Weekly Target Hours</label>
              <input
                type="number"
                min={1}
                max={60}
                required
                value={weeklyGoalHours}
                onChange={(e) => setWeeklyGoalHours(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-lg transition flex items-center space-x-2"
            >
              <span>Continue to Subjects</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Step 2 Form */}
      {step === 2 && (
        <form onSubmit={handleStep2Next} className="space-y-6">
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
            Add a course or module you are studying this semester.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-indigo-200 mb-1">Subject Name</label>
              <input
                type="text"
                required
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-indigo-200 mb-1">Professor / Instructor</label>
              <input
                type="text"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-indigo-200 mb-1">Credits</label>
              <input
                type="number"
                min={1}
                max={10}
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-indigo-200 mb-1">Color Theme</label>
              <div className="flex items-center space-x-3 pt-1">
                {["#4F46E5", "#7C3AED", "#06B6D4", "#EC4899", "#10B981"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSubjectColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition ${
                      subjectColor === c ? "border-white scale-110" : "border-transparent opacity-80"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-lg transition flex items-center space-x-2"
            >
              <span>Continue to Assignment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Step 3 Form */}
      {step === 3 && (
        <form onSubmit={handleStep3Next} className="space-y-6">
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
            Add an upcoming exam, homework, or paper deadline.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-indigo-200 mb-1">Assignment Title</label>
              <input
                type="text"
                required
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-indigo-200 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={assignmentDeadline}
                onChange={(e) => setAssignmentDeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-lg transition flex items-center space-x-2"
            >
              <span>Finish Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Step 4 Form */}
      {step === 4 && (
        <div className="text-center py-6 space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Your Study Pilot Dashboard is Ready!</h3>
            <p className="text-xs text-indigo-200 max-w-md mx-auto">
              Your custom subjects, targets, and upcoming deadlines are loaded. You can now use AI Summarization, Quizzes, Flashcards, and Study Plans!
            </p>
          </div>

          <button
            onClick={handleCompleteOnboarding}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-indigo-600 text-white font-bold text-sm shadow-xl hover:opacity-95 transition"
          >
            Launch My Dashboard
          </button>
        </div>
      )}
    </div>
  );
};
