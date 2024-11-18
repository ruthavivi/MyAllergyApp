import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBRJ3uKjtRre0PXaAUgavzRqgVweGnL3hM",
  authDomain: "allergyapp-ef422.firebaseapp.com",
  projectId: "allergyapp-ef422",
  storageBucket: "allergyapp-ef422.appspot.com",
  messagingSenderId: "252626585550",
  appId: "1:252626585550:android:388fc315887e3005e4cd9f",
};

const app = initializeApp(firebaseConfig);

// Initialize Auth conditionally based on environment
let auth;
if (typeof window !== 'undefined') {
  auth = getAuth(app);  // Web environment
} else if (getReactNativePersistence) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Initialize Firestore
const firestore = getFirestore(app);

export { auth, firestore };
