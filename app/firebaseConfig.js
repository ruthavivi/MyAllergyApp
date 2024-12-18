import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const firebaseConfig = Constants.expoConfig.extra.firebaseConfig;

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
