// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnQkTii3hD2MuTkw68T_Wf4fFjt8oahA0",
  authDomain: "messagingappwithfirebase.firebaseapp.com",
  projectId: "messagingappwithfirebase",
  storageBucket: "messagingappwithfirebase.firebasestorage.app",
  messagingSenderId: "450801364139",
  appId: "1:450801364139:web:b3ccb5f1881700cd11dbee",
  measurementId: "G-6P7G6DEF3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);