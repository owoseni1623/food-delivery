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
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         return { success: false, message: error.response.data.message || "Server error" };
//       } else if (error.request) {
//         // The request was made but no response was received
//         return { success: false, message: "No response from server" };
//       } else {
//         // Something happened in setting up the request that triggered an Error
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
//       const response = await axios.get(`${API_BASE_URL}/profile/get`, {
//         headers: { Authorization: `Bearer ${token}` }
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

//   const updateUserProfile = async (profileData) => {
//     try {
//       setError(null);
//       setSuccess(false);
  
//       // Ensure token is available
//       const currentToken = localStorage.getItem("authToken");
//       if (!currentToken) {
//         throw new Error("No authentication token found");
//       }
  
//       const response = await axios.post(`${API_BASE_URL}/profile/update`, profileData, {
//         headers: {
//           'Authorization': `Bearer ${currentToken}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });
  
//       console.log("Server response:", response.data);
  
//       if (response.data.success && response.data.profile) {
//         const updatedProfile = response.data.profile;
//         console.log("Received updated profile:", updatedProfile);
//         setUserProfile(updatedProfile);
//         setUser(prevUser => ({ ...prevUser, ...updatedProfile }));
//         setSuccess(true);
//         console.log("Profile updated successfully:", updatedProfile);
//         return response.data;
//       } else {
//         setError("Failed to update profile. Please try again.");
//         return { success: false, message: "Failed to update profile" };
//       }
//     } catch (error) {
//       console.error("Error updating user profile:", error);
//       if (error.response && error.response.status === 401) {
//         setError("Your session has expired. Please log in again.");
//         // Optionally, you can trigger a logout or redirect to login page here
//       } else {
//         setError("Failed to update profile. Please try again.");
//       }
//       throw error;
//     }
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



import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_BASE_URL = 'https://food-delivery-api-rcff.onrender.com/api';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedLoggedIn = localStorage.getItem("isLoggedIn");
    return storedLoggedIn && storedLoggedIn !== "undefined"
      ? JSON.parse(storedLoggedIn)
      : false;
  });

  const [userProfile, setUserProfile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken"));

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser && storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null;
  });

  // Create an axios instance with default headers
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Clear local storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        
        // Redirect to login page
        window.location = '/login';
      }
      return Promise.reject(error);
    }
  );

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post(
        `/users/login`,
        { email, password }
      );

      if (response.data.success) {
        const { token, user } = response.data;
        setIsLoggedIn(true);
        setUser(user);
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("authToken", token);
        setToken(token);
        console.log("Login successful, token set:", token);
        return { success: true, message: "Login successful" };
      } else {
        return { success: false, message: response.data.message || "Login failed" };
      }
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

      if (response.data.success) {
        const { token, user } = response.data;
        setIsLoggedIn(true);
        setUser(user);
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("authToken", token);
        setToken(token);
        console.log("Signup successful, token set:", token);
        return { success: true, message: "Registration successful" };
      } else {
        return { success: false, message: response.data.message || "Signup failed" };
      }
    } catch (error) {
      console.error("Signup error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "An error occurred during signup"
      };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setUserProfile(null);
    setToken(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
    window.dispatchEvent(new Event('user-updated'));
  };

  const getUserProfile = async () => {
    try {
      const response = await axiosInstance.get(`/profile/get`);
      setUserProfile(response.data.profile);
      setUser(prevUser => ({ ...prevUser, ...response.data.profile }));
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response && error.response.status === 401) {
        logout(); // Logout if unauthorized
      }
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      setError(null);
      setSuccess(false);

      const response = await axiosInstance.post(`/profile/update`, profileData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Server response:", response.data);

      if (response.data.success && response.data.profile) {
        const updatedProfile = response.data.profile;
        console.log("Received updated profile:", updatedProfile);
        setUserProfile(updatedProfile);
        setUser(prevUser => ({ ...prevUser, ...updatedProfile }));
        setSuccess(true);
        console.log("Profile updated successfully:", updatedProfile);
        return response.data;
      } else {
        setError("Failed to update profile. Please try again.");
        return { success: false, message: "Failed to update profile" };
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      setError("Failed to update profile. Please try again.");
      if (error.response && error.response.status === 401) {
        logout(); // Logout if unauthorized
      }
      throw error;
    }
  };

  useEffect(() => {
    if (isLoggedIn && token) {
      getUserProfile();
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider 
    value={{ 
      isLoggedIn,
      user, 
      login, 
      token,
      logout, 
      signup, 
      updateUser, 
      getUserProfile, 
      userProfile, 
      updateUserProfile, 
      error, 
      success 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;