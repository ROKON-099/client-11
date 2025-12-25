// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDK5Z6xdb9IHqsFgnw5tmz3EHZ4lk30DtE",
  authDomain: "blood-donation-applicati-d1819.firebaseapp.com",
  projectId: "blood-donation-applicati-d1819",
  storageBucket: "blood-donation-applicati-d1819.firebasestorage.app",
  messagingSenderId: "10362634560",
  appId: "1:10362634560:web:cbdc527061de566b8dfaa5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Export auth
export const auth = getAuth(app);
export default app;