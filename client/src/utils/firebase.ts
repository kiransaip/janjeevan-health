// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBooybN7wxghd3DmTdaVMdM5Cl6AH38KME",
    authDomain: "janjeevan-health-database.firebaseapp.com",
    projectId: "janjeevan-health-database",
    storageBucket: "janjeevan-health-database.firebasestorage.app",
    messagingSenderId: "1005435398769",
    appId: "1:1005435398769:web:831e99b0359b7902ab09d0",
    measurementId: "G-6W2ZHHC59B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services only on client-side to avoid SSR issues
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
