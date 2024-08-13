import React, { createContext, useState, useContext, useEffect } from "react";

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






// src/contexts/AuthContext.js
// import React, { createContext, useState, useContext, useEffect } from "react";
// import * as api from "../Api/Api";

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const login = async (credentials) => {
//     try {
//       const { data } = await api.login(credentials);
//       setIsLoggedIn(true);
//       setUser(data);
//       api.setAuthToken(data.token);
//       localStorage.setItem("token", data.token);
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const { data } = await api.register(userData);
//       setIsLoggedIn(true);
//       setUser(data);
//       api.setAuthToken(data.token);
//       localStorage.setItem("token", data.token);
//     } catch (error) {
//       console.error('Registration error:', error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await api.logout();
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       setIsLoggedIn(false);
//       setUser(null);
//       api.setAuthToken(null);
//       localStorage.removeItem("token");
//     }
//   };

//   const updateUser = async (updatedUserData) => {
//     try {
//       const { data } = await api.updateUser(updatedUserData);
//       setUser(data);
//     } catch (error) {
//       console.error('Update user error:', error);
//       throw error;
//     }
//   };

//   const checkAuthStatus = async () => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       api.setAuthToken(token);
//       try {
//         const { data } = await api.getUser();
//         setIsLoggedIn(true);
//         setUser(data);
//       } catch (error) {
//         console.error('Auth check error:', error);
//         localStorage.removeItem("token");
//         api.setAuthToken(null);
//       }
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, user, login, logout, register, updateUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;