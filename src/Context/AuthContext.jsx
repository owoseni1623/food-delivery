// import React, { createContext, useState, useEffect, useContext } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// const API_BASE_URL = 'https://food-delivery-api-rcff.onrender.com/api';

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(() => {
//     const storedLoggedIn = localStorage.getItem("isLoggedIn");
//     return storedLoggedIn && storedLoggedIn !== "undefined"
//       ? JSON.parse(storedLoggedIn)
//       : false;
//   });

//   const [userProfile, setUserProfile] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("authToken"));

//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem("user");
//     return storedUser && storedUser !== "undefined"
//       ? JSON.parse(storedUser)
//       : null;
//   });

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/users/login`,
//         { email, password },
//         {
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );

//       if (response.data.success) {
//         const { token, user } = response.data;
//         setIsLoggedIn(true);
//         setUser(user);
//         localStorage.setItem("isLoggedIn", JSON.stringify(true));
//         localStorage.setItem("user", JSON.stringify(user));
//         localStorage.setItem("authToken", token);
//         setToken(token);
//         console.log("Login successful, token set:", token);
//         return { success: true, message: "Login successful" };
//       } else {
//         return { success: false, message: response.data.message || "Login failed" };
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       if (error.response) {
//         return { success: false, message: error.response.data.message || "Server error" };
//       } else if (error.request) {
//         return { success: false, message: "No response from server" };
//       } else {
//         return { success: false, message: "Error setting up request" };
//       }
//     }
//   };

//   const signup = async (userData) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/users/register`, userData, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       if (response.data.success) {
//         const { token, user } = response.data;
//         setIsLoggedIn(true);
//         setUser(user);
//         localStorage.setItem("isLoggedIn", JSON.stringify(true));
//         localStorage.setItem("user", JSON.stringify(user));
//         localStorage.setItem("authToken", token);
//         setToken(token);
//         console.log("Signup successful, token set:", token);
//         return { success: true, message: "Registration successful" };
//       } else {
//         return { success: false, message: response.data.message || "Signup failed" };
//       }
//     } catch (error) {
//       console.error("Signup error:", error);
//       return { 
//         success: false, 
//         message: error.response?.data?.message || "An error occurred during signup"
//       };
//     }
//   };

//   const logout = () => {
//     setIsLoggedIn(false);
//     clearUserData();
//     setToken(null);
//     localStorage.setItem("isLoggedIn", JSON.stringify(false));
//     localStorage.removeItem("authToken");
//   };

//   const updateUser = (updatedUserData) => {
//     const newUserData = { ...user, ...updatedUserData };
//     setUser(newUserData);
//     localStorage.setItem("user", JSON.stringify(newUserData));
//     window.dispatchEvent(new Event('user-updated'));
//   };

//   const getUserProfile = async () => {
//     try {
//       if (!token) {
//         throw new Error("No authentication token found");
//       }
//       const response = await axios.post(`${API_BASE_URL}/profile/update`, profileData, {
//         headers: {
//           'Authorization': `Bearer ${currentToken}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });
      
//       setUserProfile(response.data.profile);
//       setUser(prevUser => ({ ...prevUser, ...response.data.profile }));
//     } catch (error) {
//       console.error("Error fetching user profile:", error);
//     }
//   };

//   useEffect(() => {
//     if (isLoggedIn && token) {
//       getUserProfile();
//     }
//   }, [isLoggedIn, token]);

//   // const updateUserProfile = async (profileData) => {
//   //   try {
//   //     setError(null);
//   //     setSuccess(false);
  
//   //     const currentToken = localStorage.getItem("authToken");
//   //     if (!currentToken) {
//   //       throw new Error("No authentication token found");
//   //     }
  
//   //     console.log("Token being sent:", currentToken);
  
//   //     const response = await axios.post(`${API_BASE_URL}/profile/update`, profileData, {
//   //       headers: {
//   //         'Authorization': `Bearer ${currentToken}`,
//   //         'Content-Type': 'multipart/form-data'
//   //       }
//   //     });
  
//   //     console.log("Server response:", response.data);
  
//   //     if (response.data.success && response.data.profile) {
//   //       const updatedProfile = response.data.profile;
//   //       console.log("Received updated profile:", updatedProfile);
//   //       setUserProfile(updatedProfile);
//   //       setUser(prevUser => ({ ...prevUser, ...updatedProfile }));
//   //       setSuccess(true);
//   //       console.log("Profile updated successfully:", updatedProfile);
//   //       return response.data;
//   //     } else {
//   //       setError("Failed to update profile. Please try again.");
//   //       return { success: false, message: "Failed to update profile" };
//   //     }
//   //   } catch (error) {
//   //     console.error("Error updating user profile:", error);
//   //     if (error.response && error.response.status === 401) {
//   //       setError("Your session has expired. Please log in again.");
//   //       handleTokenExpiration();
//   //     } else {
//   //       setError("Failed to update profile. Please try again.");
//   //     }
//   //     throw error;
//   //   }
//   // };


//   const updateUserProfile = async (profileData) => {
//     try {
//       setError(null);
//       setSuccess(false);
  
//       const currentToken = localStorage.getItem("authToken");
//       if (!currentToken) {
//         throw new Error("No authentication token found");
//       }
  
//       console.log("Token being sent:", currentToken);
  
//       const response = await axios.post(`${API_BASE_URL}/profile/update`, profileData, {
//         headers: {
//           'Authorization': `Bearer ${currentToken}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });
  
//       console.log("Full server response:", response);
  
//       if (response.data.success && response.data.profile) {
//         const updatedProfile = response.data.profile;
//         setUserProfile(updatedProfile);
//         setUser(prevUser => ({ ...prevUser, ...updatedProfile }));
//         setSuccess(true);
//         return response.data;
//       } else {
//         setError("Failed to update profile. Please try again.");
//         return { success: false, message: "Failed to update profile" };
//       }
//     } catch (error) {
//       console.error("Full error object:", error);
//       console.error("Error response data:", error.response?.data);
//       console.error("Error response status:", error.response?.status);
//       console.error("Error response headers:", error.response?.headers);
  
//       if (error.response && error.response.status === 401) {
//         setError("Your session has expired. Please log in again.");
//         logout(); // Assuming you have a logout function that clears the token
//       } else {
//         setError("Failed to update profile. Please try again.");
//       }
//       throw error;
//     }
//   };

//   const handleTokenExpiration = () => {
//     logout();
//     // You might want to redirect to the login page here
//     // For example: history.push('/login');
//   };

//   const clearUserData = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   useEffect(() => {
//     localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
//   }, [isLoggedIn]);

//   return (
//     <AuthContext.Provider 
//     value={{ 
//       isLoggedIn,
//       user, 
//       login, 
//       token,
//       logout, 
//       signup, 
//       updateUser, 
//       getUserProfile, 
//       userProfile, 
//       updateUserProfile, 
//       error, 
//       success 
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;


// import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// const API_BASE_URL = 'https://food-delivery-api-rcff.onrender.com/api';

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [userProfile, setUserProfile] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const axiosInstance = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   const updateAxiosToken = useCallback((newToken) => {
//     if (newToken) {
//       axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
//     } else {
//       delete axiosInstance.defaults.headers.common['Authorization'];
//     }
//   }, [axiosInstance]);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("authToken");
//     const storedUser = localStorage.getItem("user");

//     if (storedToken && storedUser) {
//       setToken(storedToken);
//       setUser(JSON.parse(storedUser));
//       setIsLoggedIn(true);
//       updateAxiosToken(storedToken);
//     }

//     setIsLoading(false);
//   }, [updateAxiosToken]);

//   useEffect(() => {
//     updateAxiosToken(token);
//   }, [token, updateAxiosToken]);

//   axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response && error.response.status === 401) {
//         logout();
//       }
//       return Promise.reject(error);
//     }
//   );

//   const login = async (email, password) => {
//     try {
//       const response = await axiosInstance.post(`/users/login`, { email, password });

//       if (response.data.success) {
//         const { token: newToken, user: newUser } = response.data;
//         setIsLoggedIn(true);
//         setUser(newUser);
//         setToken(newToken);
//         localStorage.setItem("isLoggedIn", "true");
//         localStorage.setItem("user", JSON.stringify(newUser));
//         localStorage.setItem("authToken", newToken);
//         return { success: true, message: "Login successful" };
//       } else {
//         return { success: false, message: response.data.message || "Login failed" };
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       return { 
//         success: false, 
//         message: error.response?.data?.message || "An error occurred during login"
//       };
//     }
//   };

//   const signup = async (userData) => {
//     try {
//       const response = await axiosInstance.post(`/users/register`, userData);

//       if (response.data.success) {
//         const { token: newToken, user: newUser } = response.data;
//         setIsLoggedIn(true);
//         setUser(newUser);
//         setToken(newToken);
//         localStorage.setItem("isLoggedIn", "true");
//         localStorage.setItem("user", JSON.stringify(newUser));
//         localStorage.setItem("authToken", newToken);
//         return { success: true, message: "Registration successful" };
//       } else {
//         return { success: false, message: response.data.message || "Signup failed" };
//       }
//     } catch (error) {
//       console.error("Signup error:", error);
//       return { 
//         success: false, 
//         message: error.response?.data?.message || "An error occurred during signup"
//       };
//     }
//   };

//   const logout = () => {
//     setIsLoggedIn(false);
//     setUser(null);
//     setUserProfile(null);
//     setToken(null);
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("user");
//     localStorage.removeItem("authToken");
//     updateAxiosToken(null);
//   };

//   const updateUser = (updatedUserData) => {
//     const newUserData = { ...user, ...updatedUserData };
//     setUser(newUserData);
//     localStorage.setItem("user", JSON.stringify(newUserData));
//     window.dispatchEvent(new Event('user-updated'));
//   };

//   const getUserProfile = async () => {
//     try {
//       const response = await axiosInstance.get(`/profile/get`);
//       setUserProfile(response.data.profile);
//       setUser(prevUser => ({ ...prevUser, ...response.data.profile }));
//     } catch (error) {
//       console.error("Error fetching user profile:", error);
//       if (error.response && error.response.status === 401) {
//         logout();
//       }
//     }
//   };

//   const updateUserProfile = async (profileData) => {
//     try {
//       setError(null);
//       setSuccess(false);

//       const response = await axiosInstance.post(`/profile/update`, profileData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       if (response.data.success && response.data.profile) {
//         const updatedProfile = response.data.profile;
//         setUserProfile(updatedProfile);
//         setUser(prevUser => ({ ...prevUser, ...updatedProfile }));
//         setSuccess(true);
//         return response.data;
//       } else {
//         setError("Failed to update profile. Please try again.");
//         return { success: false, message: "Failed to update profile" };
//       }
//     } catch (error) {
//       console.error("Error updating user profile:", error);
//       setError("Failed to update profile. Please try again.");
//       if (error.response && error.response.status === 401) {
//         logout();
//       }
//       throw error;
//     }
//   };

//   useEffect(() => {
//     if (isLoggedIn && token) {
//       getUserProfile();
//     }
//   }, [isLoggedIn, token]);

//   return (
//     <AuthContext.Provider 
//       value={{ 
//         isLoggedIn,
//         user, 
//         login, 
//         token,
//         setToken,
//         logout, 
//         signup, 
//         updateUser, 
//         getUserProfile, 
//         userProfile, 
//         updateUserProfile, 
//         error, 
//         success,
//         isLoading
//       }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;



// import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// const API_BASE_URL = 'https://food-delivery-api-rcff.onrender.com/api';

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [userProfile, setUserProfile] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const axiosInstance = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   const updateAxiosToken = useCallback((newToken) => {
//     if (newToken) {
//       axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
//     } else {
//       delete axiosInstance.defaults.headers.common['Authorization'];
//     }
//   }, []);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("authToken");
//     const storedUser = localStorage.getItem("user");

//     if (storedToken && storedUser) {
//       setToken(storedToken);
//       setUser(JSON.parse(storedUser));
//       setIsLoggedIn(true);
//       updateAxiosToken(storedToken);
//     }

//     setIsLoading(false);
//   }, [updateAxiosToken]);

//   useEffect(() => {
//     if (token) {
//       updateAxiosToken(token);
//     }
//   }, [token, updateAxiosToken]);

//   axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response && error.response.status === 401) {
//         logout();
//       }
//       return Promise.reject(error);
//     }
//   );

//   const login = async (email, password) => {
//     try {
//       const response = await axiosInstance.post(`/users/login`, { email, password });

//       if (response.data.success) {
//         const { token: newToken, user: newUser } = response.data;
//         setIsLoggedIn(true);
//         setUser(newUser);
//         setToken(newToken);
//         localStorage.setItem("isLoggedIn", "true");
//         localStorage.setItem("user", JSON.stringify(newUser));
//         localStorage.setItem("authToken", newToken);
//         updateAxiosToken(newToken);
//         return { success: true, message: "Login successful" };
//       } else {
//         return { success: false, message: response.data.message || "Login failed" };
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       return { 
//         success: false, 
//         message: error.response?.data?.message || "An error occurred during login"
//       };
//     }
//   };

//   const signup = async (userData) => {
//     try {
//       const response = await axiosInstance.post(`/users/register`, userData);

//       if (response.data.success) {
//         const { token: newToken, user: newUser } = response.data;
//         setIsLoggedIn(true);
//         setUser(newUser);
//         setToken(newToken);
//         localStorage.setItem("isLoggedIn", "true");
//         localStorage.setItem("user", JSON.stringify(newUser));
//         localStorage.setItem("authToken", newToken);
//         updateAxiosToken(newToken);
//         return { success: true, message: "Registration successful" };
//       } else {
//         return { success: false, message: response.data.message || "Signup failed" };
//       }
//     } catch (error) {
//       console.error("Signup error:", error);
//       return { 
//         success: false, 
//         message: error.response?.data?.message || "An error occurred during signup"
//       };
//     }
//   };

//   const logout = useCallback(() => {
//     setIsLoggedIn(false);
//     setUser(null);
//     setUserProfile(null);
//     setToken(null);
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("user");
//     localStorage.removeItem("authToken");
//     updateAxiosToken(null);
//   }, []);

//   const updateUser = (updatedUserData) => {
//     const newUserData = { ...user, ...updatedUserData };
//     setUser(newUserData);
//     localStorage.setItem("user", JSON.stringify(newUserData));
//     window.dispatchEvent(new Event('user-updated'));
//   };

//   const getUserProfile = useCallback(async () => {
//     if (!token) return;
//     try {
//       const response = await axiosInstance.get(`/profile/get`);
//       setUserProfile(response.data.profile);
//       setUser(prevUser => ({ ...prevUser, ...response.data.profile }));
//     } catch (error) {
//       console.error("Error fetching user profile:", error);
//       if (error.response && error.response.status === 401) {
//         logout();
//       }
//     }
//   }, [token, logout]);

//   const updateUserProfile = async (profileData) => {
//     try {
//       setError(null);
//       setSuccess(false);

//       const response = await axiosInstance.post(`/profile/update`, profileData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       if (response.data.success && response.data.profile) {
//         const updatedProfile = response.data.profile;
//         setUserProfile(updatedProfile);
//         setUser(prevUser => ({ ...prevUser, ...updatedProfile }));
//         setSuccess(true);
//         return response.data;
//       } else {
//         setError("Failed to update profile. Please try again.");
//         return { success: false, message: "Failed to update profile" };
//       }
//     } catch (error) {
//       console.error("Error updating user profile:", error);
//       setError("Failed to update profile. Please try again.");
//       if (error.response && error.response.status === 401) {
//         logout();
//       }
//       throw error;
//     }
//   };

//   useEffect(() => {
//     if (isLoggedIn && token) {
//       getUserProfile();
//     }
//   }, [isLoggedIn, token, getUserProfile]);

//   return (
//     <AuthContext.Provider 
//       value={{ 
//         isLoggedIn,
//         user, 
//         login, 
//         token,
//         setToken,
//         logout, 
//         signup, 
//         updateUser, 
//         getUserProfile, 
//         userProfile, 
//         updateUserProfile, 
//         error, 
//         success,
//         isLoading
//       }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;


import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_BASE_URL = 'https://food-delivery-api-rcff.onrender.com/api';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authToken, setAuthToken] = useState(null)
  const [userProfile, setUserProfile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const updateAxiosToken = useCallback((newToken) => {
    if (newToken) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setAuthToken(token); 
      setIsLoggedIn(true);
      updateAxiosToken(storedToken);
    }

    setIsLoading(false);
  }, [updateAxiosToken]);

  useEffect(() => {
    if (token) {
      updateAxiosToken(token);
    }
  }, [token, updateAxiosToken]);

  const handleAuthResponse = (response) => {
    if (response.data.success) {
      const { token: newToken, user: newUser } = response.data;
      setIsLoggedIn(true);
      setUser(newUser);
      setToken(newToken);
      setAuthToken(newToken); 
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("authToken", newToken);
      updateAxiosToken(newToken);
      console.log("Auth token set:", newToken);  // Debugging: log the token
    } else {
      throw new Error(response.data.message || "Authentication failed");
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post(`/users/login`, { email, password });
      handleAuthResponse(response);
      return { success: true, message: "Login successful" };
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "An error occurred during login"
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axiosInstance.post(`/users/register`, userData);
      handleAuthResponse(response);
      return { success: true, message: "Registration successful" };
    } catch (error) {
      console.error("Signup error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "An error occurred during signup"
      };
    }
  };

  // Add the updateUser function here
  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
    window.dispatchEvent(new Event('user-updated'));
  };

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    setUserProfile(null);
    setToken(null);
    setAuthToken(null); 
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    updateAxiosToken(null);
  }, [updateAxiosToken]);

  const getUserProfile = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axiosInstance.get(`/profile/get`);
      setUserProfile(response.data.profile);
      setUser(prevUser => ({ ...prevUser, ...response.data.profile }));
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  }, [token, logout, axiosInstance]);

  const updateUserProfile = async (profileData) => {
    try {
      setError(null);
      setSuccess(false);

      const response = await axiosInstance.post(`/profile/update`, profileData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success && response.data.profile) {
        const updatedProfile = response.data.profile;
        setUserProfile(updatedProfile);
        setUser(prevUser => ({ ...prevUser, ...updatedProfile }));
        setSuccess(true);
        return response.data;
      } else {
        setError("Failed to update profile. Please try again.");
        return { success: false, message: "Failed to update profile" };
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      setError("Failed to update profile. Please try again.");
      if (error.response && error.response.status === 401) {
        logout();
      }
      throw error;
    }
  };

  useEffect(() => {
    if (isLoggedIn && token) {
      getUserProfile();
    }
  }, [isLoggedIn, token, getUserProfile]);

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn,
        user, 
        login, 
        token,
        authToken,
        setToken,
        setAuthToken,
        logout, 
        signup, 
        updateUser,  // Ensure updateUser is included here
        getUserProfile, 
        userProfile, 
        updateUserProfile, 
        error, 
        success,
        isLoading
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
