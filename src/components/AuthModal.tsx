import React, { useState } from "react";
import { X, Mail, Lock, User, Sparkles, GraduationCap, ArrowRight } from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "../lib/firebase";
import { UserProfile } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGuestLogin = () => {
    const guestUser: UserProfile = {
      uid: "guest-student-123",
      email: "guest.student@university.edu",
      displayName: "Guest Student",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      weeklyGoalHours: 15,
      currentStreak: 7,
      darkMode: false,
      notifications: true,
      language: "English",
      createdAt: new Date().toISOString(),
    };
    onSuccess(guestUser);
    onClose();
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (!isFirebaseConfigured()) {
      // Fallback to demo login if Firebase keys not configured
      handleGuestLogin();
      return;
    }

    try {
      if (mode === "login") {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const user: UserProfile = {
          uid: res.user.uid,
          email: res.user.email || email,
          displayName: res.user.displayName || "Student",
          photoURL: res.user.photoURL || undefined,
          weeklyGoalHours: 15,
          currentStreak: 1,
          darkMode: false,
          notifications: true,
          language: "English",
          createdAt: new Date().toISOString(),
        };
        onSuccess(user);
        onClose();
      } else if (mode === "register") {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user: UserProfile = {
          uid: res.user.uid,
          email: res.user.email || email,
          displayName: name || "New Student",
          weeklyGoalHours: 15,
          currentStreak: 1,
          darkMode: false,
          notifications: true,
          language: "English",
          createdAt: new Date().toISOString(),
        };
        onSuccess(user);
        onClose();
      } else if (mode === "forgot") {
        await sendPasswordResetEmail(auth, email);
        setMessage("Password reset email sent! Check your inbox.");
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    if (!isFirebaseConfigured()) {
      handleGuestLogin();
      return;
    }

    try {
      setLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      const user: UserProfile = {
        uid: res.user.uid,
        email: res.user.email || "student@google.com",
        displayName: res.user.displayName || "Student",
        photoURL: res.user.photoURL || undefined,
        weeklyGoalHours: 15,
        currentStreak: 1,
        darkMode: false,
        notifications: true,
        language: "English",
        createdAt: new Date().toISOString(),
      };
      onSuccess(user);
      onClose();
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 mb-3">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {mode === "login" && "Welcome Back!"}
            {mode === "register" && "Create Your Account"}
            {mode === "forgot" && "Reset Password"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            StudyPilot AI — Your AI-Powered Study Companion
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-600 dark:text-emerald-300">
            {message}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Vance"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>
            </div>
          )}

          {mode === "login" && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>
                  {mode === "login" && "Log In"}
                  {mode === "register" && "Create Account"}
                  {mode === "forgot" && "Send Reset Link"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-center space-y-3">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Guest / Demo Mode Button */}
          <button
            onClick={handleGuestLogin}
            type="button"
            className="w-full py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 font-semibold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Mode (Guest Access)</span>
          </button>

          <div className="text-xs text-slate-500">
            {mode === "login" && (
              <>
                Don't have an account?{" "}
                <button onClick={() => setMode("register")} className="text-indigo-600 font-bold hover:underline">
                  Sign up
                </button>
              </>
            )}
            {mode === "register" && (
              <>
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-indigo-600 font-bold hover:underline">
                  Log in
                </button>
              </>
            )}
            {mode === "forgot" && (
              <button onClick={() => setMode("login")} className="text-indigo-600 font-bold hover:underline">
                Back to Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
