// enforces that this code can only be called on the server
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment
import "server-only";

import {
  getApp,
  getApps,
  initializeApp,
  initializeServerApp,
} from "firebase/app";

import { cookies } from "next/headers";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase App Hosting supplies the options for no-argument initialization.
// For local development, replace initializeApp() below with initializeApp(firebaseConfig).
const app = getApps().length ? getApp() : initializeApp();

// Returns an authenticated client SDK instance for use in Server Side Rendering
// and Static Site Generation
export async function getAuthenticatedAppForUser() {
  // Read the ID token cookie set by the client so server Firebase requests use the user's identity.
  const authIdToken = (await cookies()).get("__session")?.value;

  // Reuse the initialized app so server auth uses the same Firebase project options.
  const firebaseServerApp = initializeServerApp(app, {
    authIdToken,
  });

  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  return { firebaseServerApp, currentUser: auth.currentUser };
}
