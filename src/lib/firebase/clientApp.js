"use client";

//the below line is for server development uncomment for server up and remove the local dev comment below code 1*
import { initializeApp } from "firebase/app";
//****** */


import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

//this was added for local dev code 1*
//import { getApps, initializeApp } from "firebase/app";
// *****

// Use automatic initialization
// https://firebase.google.com/docs/app-hosting/firebase-sdks#initialize-with-no-arguments
// this needs to be uncommented when moving to server build code 1*
 export const firebaseApp = initializeApp();

// this is being used for local dev, code 1* the above line will be uncommented and below removed when uploaded
//const firebaseConfig = {
//  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//};

//export const firebaseApp =
//  getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  //**** */

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
