import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from '../config';

const hasConfigValue = (value: string) => typeof value === 'string' && value.trim().length > 0;

export const isFirebaseConfigured = () =>
  hasConfigValue(firebaseConfig.apiKey) &&
  hasConfigValue(firebaseConfig.projectId) &&
  hasConfigValue(firebaseConfig.appId);

let cachedApp: FirebaseApp | null = null;
let cachedDb: Firestore | null = null;

export const getFirebaseApp = (): FirebaseApp | null => {
  if (!isFirebaseConfigured()) return null;

  if (!cachedApp) {
    cachedApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }

  return cachedApp;
};

export const getFirestoreDb = (): Firestore | null => {
  if (!isFirebaseConfigured()) return null;

  if (!cachedDb) {
    const app = getFirebaseApp();
    if (!app) return null;
    cachedDb = getFirestore(app);
  }

  return cachedDb;
};
