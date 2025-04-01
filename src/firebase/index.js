// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzxNeY9XOdAI8a9PGKclWrlxj2ETZorq0",
  authDomain: "messenger-1e94f.firebaseapp.com",
  projectId: "messenger-1e94f",
  storageBucket: "messenger-1e94f.firebasestorage.app",
  messagingSenderId: "716566983781",
  appId: "1:716566983781:web:ac8411d2295760b7d1828c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// google sağlayıcısını kur
export const provider = new GoogleAuthProvider();

// aut hizmetini kur
export const auth = getAuth(app);

// database hzimetinin referasını al
export const db = getFirestore(app);