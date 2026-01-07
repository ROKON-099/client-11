import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logOut = async () => {
    setLoading(true);
    await signOut(auth);
    localStorage.removeItem("token");
    setUser(null);
    setLoading(false);
  };

  // Update profile
  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL,
    });
  };

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/jwt`,
            { email: currentUser.email.toLowerCase() }
          );
          localStorage.setItem("token", res.data.token);
        } catch (error) {
          console.error("JWT error", error);
          // If JWT fails (user not in DB), log out the user
          await signOut(auth);
          localStorage.removeItem("token");
          setUser(null);
        }
      } else {
        localStorage.removeItem("token");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
