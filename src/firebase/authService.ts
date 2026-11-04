import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './config';
import { BloodGroup, Donor, UserRole } from '../types';

export interface FirebaseUserData {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  bloodGroup?: BloodGroup;
  createdAt: string;
}

// Save or update user profile document in Firestore
export async function saveUserProfileToFirestore(userData: FirebaseUserData): Promise<void> {
  const path = `users/${userData.uid}`;
  try {
    await setDoc(doc(db, 'users', userData.uid), userData, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

// Fetch user profile from Firestore
export async function getUserProfileFromFirestore(uid: string): Promise<FirebaseUserData | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as FirebaseUserData;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

// Register user with Email and Password
export async function registerWithEmail(
  name: string,
  email: string,
  pass: string,
  role: UserRole = 'donor',
  phone?: string,
  bloodGroup?: BloodGroup
): Promise<{ user: User; profile: FirebaseUserData }> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  const profile: FirebaseUserData = {
    uid: user.uid,
    name,
    email: user.email || email,
    role,
    phone: phone || '',
    bloodGroup: bloodGroup || 'O+',
    createdAt: new Date().toISOString(),
  };

  await saveUserProfileToFirestore(profile);
  return { user, profile };
}

// Sign in with Email and Password
export async function loginWithEmail(
  email: string,
  pass: string
): Promise<{ user: User; profile: FirebaseUserData | null }> {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;
  const profile = await getUserProfileFromFirestore(user.uid);
  return { user, profile };
}

// Sign in with Google Popup
export async function loginWithGoogle(
  defaultRole: UserRole = 'donor'
): Promise<{ user: User; profile: FirebaseUserData }> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;

  let profile = await getUserProfileFromFirestore(user.uid);
  if (!profile) {
    profile = {
      uid: user.uid,
      name: user.displayName || 'Google User',
      email: user.email || '',
      role: defaultRole,
      phone: user.phoneNumber || '',
      createdAt: new Date().toISOString(),
    };
    await saveUserProfileToFirestore(profile);
  }

  return { user, profile };
}

// Sign out
export async function logOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// Save Donor record to Firestore
export async function saveDonorToFirestore(donor: Donor): Promise<void> {
  const path = `donors/${donor.id}`;
  try {
    await setDoc(doc(db, 'donors', donor.id), donor, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

// Fetch all donors from Firestore
export async function fetchDonorsFromFirestore(): Promise<Donor[]> {
  const path = 'donors';
  try {
    const snap = await getDocs(collection(db, path));
    const items: Donor[] = [];
    snap.forEach((doc) => {
      items.push(doc.data() as Donor);
    });
    return items;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}
