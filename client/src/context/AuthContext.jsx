import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // ✅ Fix here
import { auth } from "../firebase/firebase"; // ✅ correct path

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser); // Set the user object
    setLoading(false);     // Set loading to false after user data is fetched
  });
  return () => unsubscribe(); // Cleanup the listener on unmount
}, []);


  const logout = () => signOut(auth); // ✅ Signs user out

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
