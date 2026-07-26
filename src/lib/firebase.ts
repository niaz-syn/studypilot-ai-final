import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";

// Fallback configuration if firebase-applet-config.json is not present
const defaultFirebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "studypilot-ai.firebaseapp.com",
  projectId: "studypilot-ai",
  storageBucket: "studypilot-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
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
