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



  /* REGISTER */

  const createUser = (email, password) => {

    return createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  };



  /* LOGIN */

  const signIn = (email, password) => {

    return signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  };



  /* LOGOUT */

  const logOut = async () => {

    await signOut(auth);

    localStorage.removeItem("token");

    setUser(null);

  };



  /* UPDATE PROFILE */

  const updateUserProfile = async (name, photoURL) => {

    if (!auth.currentUser) return;

    await updateProfile(auth.currentUser, {

      displayName: name,

      photoURL,

    });


    await auth.currentUser.reload();


    // ✅ FIXED

    setUser(auth.currentUser);

  };



  /* AUTH OBSERVER */

  useEffect(() => {


    const unsubscribe = onAuthStateChanged(

      auth,

      async currentUser => {

        setUser(currentUser);


        if (currentUser?.email) {

          try {

            const res = await axios.post(

              `${import.meta.env.VITE_API_URL}/jwt`,

              {

                email:

                currentUser.email.toLowerCase(),

              }

            );


            localStorage.setItem(

              "token",

              res.data.token

            );

          }


          catch {

            await signOut(auth);

            localStorage.removeItem("token");

            setUser(null);

          }

        }


        else {

          localStorage.removeItem("token");

        }


        setLoading(false);

      }

    );


    return unsubscribe;


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

      {children}

    </AuthContext.Provider>

  );

};


export default AuthProvider;