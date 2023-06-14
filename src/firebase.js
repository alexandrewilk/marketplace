// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPQKJFj0k8yKbKJlwi5K3Olt0blbsVAOs",
  authDomain: "marketplace-57e63.firebaseapp.com",
  projectId: "marketplace-57e63",
  storageBucket: "marketplace-57e63.appspot.com",
  messagingSenderId: "691416854766",
  appId: "1:691416854766:web:76da54d7ba9d40bd8d03ff",
  measurementId: "G-4MLPZ1M06Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);