/**
 * LIFE OS — Firebase Initialization & Firestore Service
 * Conforms to strict ABAC, Zero-Trust security rules, FirestoreErrorInfo error handling,
 * and persistent storage of user preferences, onboarding status, and settings.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, ModuleId } from '../types';
import { AppConfig } from '../config/appConfig';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Operation Types for Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on Startup
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    // Testing read on a public/test path
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore: the client is offline.');
      return false;
    }
    // If permission denied or missing doc, connection reached the server successfully
    return true;
  }
}

// Sign In With Google Popup
export async function loginWithGoogle(): Promise<User | null> {
  if (!firebaseConfig?.apiKey || !firebaseConfig?.authDomain) {
    throw new Error('Configuração do Firebase para autenticação Google não foi encontrada.');
  }

  try {
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    const popupBlockedCodes = [
      'auth/popup-blocked',
      'auth/cancelled-popup-request',
      'auth/popup-closed-by-user',
    ];

    if (popupBlockedCodes.includes(error?.code)) {
      try {
        await signInWithRedirect(auth, googleProvider);
        return null;
      } catch (redirectError) {
        console.error('Google Redirect Sign-In Error:', redirectError);
      }
    }

    console.error('Google Sign-In Error:', error);
    throw new Error(
      'Não foi possível entrar com o Google. Verifique se o domínio da aplicação está autorizado no Firebase e tente novamente.'
    );
  }
}

export async function handleGoogleAuthRedirect(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    return result?.user ?? null;
  } catch (error) {
    console.error('Google Redirect Result Error:', error);
    throw error;
  }
}

// Logout
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
}

// Fetch user profile from Firestore
export async function fetchUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userDocRef);
    if (snapshot.exists()) {
      return snapshot.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Save or Update user profile in Firestore
export async function saveUserProfileToFirestore(profile: UserProfile): Promise<void> {
  if (!profile.userId && !profile.id) return;
  const uid = profile.userId || profile.id;
  const path = `users/${uid}`;

  const payload: Record<string, any> = {
    id: uid,
    userId: uid,
    name: profile.name || 'Usuário',
    nickname: profile.nickname || profile.name || 'Usuário',
    email: profile.email || auth.currentUser?.email || '',
    avatarUrl: profile.avatarUrl || auth.currentUser?.photoURL || '',
    age: profile.age || 18,
    wakeTime: profile.wakeTime || '06:30',
    sleepTime: profile.sleepTime || '23:00',
    isStudent: profile.isStudent ?? true,
    isWorker: profile.isWorker ?? true,
    forgetReason: profile.forgetReason || 'tenho muitas coisas para fazer',
    primarySubjects: profile.primarySubjects || ['Matemática', 'História'],
    sports: profile.sports || ['Jiu-Jitsu', 'Musculação'],
    workoutDaysCount: profile.workoutDaysCount || '4',
    waterGoalLiters: profile.waterGoalLiters || '3.0',
    incomeSources: profile.incomeSources || 'Projetos e Consultoria',
    financialGoal: profile.financialGoal || '20000',
    activeProjectsText: profile.activeProjectsText || 'KVB System, KAEN Motors',
    selectedHabits: profile.selectedHabits || ['Beber 3L de Água', 'Estudo Focado'],
    enabledModules: profile.enabledModules || [
      'dashboard',
      'estudos',
      'treinos',
      'financas',
      'tarefas',
      'rotina',
      'projetos',
      'habitos',
    ],
    onboardingCompleted: profile.onboardingCompleted ?? true,
    updatedAt: new Date().toISOString(),
  };

  if (profile.createdAt) {
    payload.createdAt = profile.createdAt;
  } else {
    payload.createdAt = new Date().toISOString();
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Save user settings (e.g. customized enabled modules) in Firestore
export async function saveUserSettingsToFirestore(
  userId: string,
  settings: {
    enabledModules: ModuleId[];
    notificationTiming?: string;
  }
): Promise<void> {
  const path = `users/${userId}/settings/config`;
  try {
    const ref = doc(db, 'users', userId, 'settings', 'config');
    await setDoc(
      ref,
      {
        userId,
        enabledModules: settings.enabledModules,
        notificationTiming: settings.notificationTiming || '15',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
