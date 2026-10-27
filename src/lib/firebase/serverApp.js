// enforces that this code can only be called on the server
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment
import "server-only";

import { getApp, getApps, initializeApp, initializeServerApp } from "firebase/app";// this is to utilize local dev code:1*

import { cookies } from "next/headers";
//import { initializeServerApp, initializeApp } from "firebase/app"; // this will be for server upload, swap the local dev code with this line

import { getAuth } from "firebase/auth";

//this is to establish the local auth for dev code:1*
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};



// end local auth

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Returns an authenticated client SDK instance for use in Server Side Rendering
// and Static Site Generation
export async function getAuthenticatedAppForUser() {
  // Read the ID token cookie set by the client so server Firebase requests use the user's identity.
  const authIdToken = (await cookies()).get("__session")?.value;

  // Create a server-compatible Firebase app instance associated with the current user's token.
  const firebaseServerApp = initializeServerApp(

    // the below code is used for local dev and will need to be commented out and replaced with the initapp func below.
    //code 1*
    app, { 
      authIdToken,
    });
    
    // https://github.com/firebase/firebase-js-sdk/issues/8863#issuecomment-2751401913
    // this should be uncommented for server deployment code 1*
    //initializeApp(),
    //{
    //  authIdToken,
    //}
    //);

  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  return { firebaseServerApp, currentUser: auth.currentUser };
}
