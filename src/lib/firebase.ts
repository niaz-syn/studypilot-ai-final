import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";

// Fallback configuration if firebase-applet-config.json is not present
const defaultFirebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || "studypilot-ai.firebaseapp.com",
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || "studypilot-ai",
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || "studypilot-ai.appspot.com",
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
};

let firebaseConfig: any = defaultFirebaseConfig;

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export const isFirebaseConfigured = () => {
  return firebaseConfig && firebaseConfig.apiKey !== "demo-api-key";
};

// Test firestore connection on boot safely
export async function testFirestoreConnection() {
  if (!isFirebaseConfigured()) return false;
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    return true;
  } catch (error: any) {
    if (error?.message?.includes("client is offline")) {
      console.warn("Firestore client is offline or missing credentials.");
    }
    return false;
  }
}
