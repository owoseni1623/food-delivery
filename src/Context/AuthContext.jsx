import React,{ createContext, useState, useEffect, useContext } from "react";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedLoggedIn = localStorage.getItem("isLoggedIn");
    return storedLoggedIn && storedLoggedIn !== "undefined"
      ? JSON.parse(storedLoggedIn)
      : false;
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;
  });

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem("isLoggedIn", JSON.stringify(true));
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("authToken", userData.token); // Make sure this line is present
    console.log("Login successful, token set:", userData.token);
  };
  const logout = () => {
    setIsLoggedIn(false);
    clearUserData();
    localStorage.setItem("isLoggedIn", JSON.stringify(false));
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
    // Dispatch an event to notify components that user data has been updated
    window.dispatchEvent(new Event('user-updated'));
  };

  const clearUserData = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, updateUser, clearUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
