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

  /* ======================
     REGISTER
  ====================== */
  const createUser = async (email, password) => {
    setLoading(true);
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  /* ======================
     LOGIN
  ====================== */
  const signIn = async (email, password) => {
    setLoading(true);
    return await signInWithEmailAndPassword(auth, email, password);
  };

  /* ======================
     LOGOUT
  ====================== */
  const logOut = async () => {
    setLoading(true);
    await signOut(auth);
    localStorage.removeItem("token");
    setUser(null);
    setLoading(false);
  };

  /* ======================
     UPDATE PROFILE (NAME + AVATAR)
  ====================== */
  const updateUserProfile = async (name, photoURL) => {
    if (!auth.currentUser) return;

    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL,
    });

    // 🔥 Force refresh user
    await auth.currentUser.reload();
    setUser({ ...auth.currentUser });
  };

  /* ======================
     AUTH STATE OBSERVER
     (AUTO LOGIN + JWT)
  ====================== */
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
          console.error("JWT error:", error);
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
