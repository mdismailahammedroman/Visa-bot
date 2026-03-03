import admin from "firebase-admin";
import { envVar } from "./EnvVar"; // or use process.env directly

let initialized = false;

export const initFirebase = () => {
  if (initialized) return;
  if (admin.apps.length) {
    initialized = true;
    return;
  }

  if (
    !envVar.FIREBASE?.FIREBASE_PROJECT_ID ||
    !envVar.FIREBASE?.FIREBASE_CLIENT_EMAIL ||
    !envVar.FIREBASE?.FIREBASE_PRIVATE_KEY
  ) {
    throw new Error("Firebase environment variables are missing!");
  }

  const firebaseConfig = {
    projectId: envVar.FIREBASE.FIREBASE_PROJECT_ID,
    clientEmail: envVar.FIREBASE.FIREBASE_CLIENT_EMAIL,
    privateKey: envVar.FIREBASE.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };

  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });

  initialized = true;
};

export const fcmMessaging = (): admin.messaging.Messaging => {
  initFirebase();
  return admin.messaging();
};