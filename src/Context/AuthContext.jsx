import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_BASE_URL = 'https://food-delivery-api-rcff.onrender.com/api';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileFetched, setProfileFetched] = useState(false);

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return instance;
  }, []);

  const updateAxiosToken = useCallback((newToken) => {
    if (newToken) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  }, [axiosInstance]);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");
    const storedProfile = localStorage.getItem("userProfile");
  
    if (storedToken) {
      setToken(storedToken);
      setAuthToken(storedToken);
      setIsLoggedIn(true);
    }
  
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
  
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        setUserProfile(parsedProfile);
      } catch (error) {
        console.error("Error parsing stored profile:", error);
        localStorage.removeItem("userProfile");
      }
    }
  
    setIsLoading(false);
  }, []);

  const handleAuthResponse = async (response) => {
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
      setProfileFetched(false);
      console.log("Auth token set:", newToken);

      await getUserProfile();
    } else {
      throw new Error(response.data.message || "Authentication failed");
    }
  };

  const login = async (email, password) => {
    try {
      console.log("Attempting login...");
      const response = await axiosInstance.post(`/users/login`, { email, password });
      console.log("Login response:", response);
      await handleAuthResponse(response);
      return { success: true, message: "Login successful", token: response.data.token };
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || "An error occurred during login"
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axiosInstance.post(`/users/register`, userData);
      await handleAuthResponse(response);
      return { success: true, message: "Registration successful" };
    } catch (error) {
      console.error("Signup error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "An error occurred during signup"
      };
    }
  };

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
    setProfileFetched(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userProfile");
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, {}, {
        withCredentials: true
      });
      if (response.data.token) {
        const newToken = response.data.token;
        setToken(newToken);
        setAuthToken(newToken);
        localStorage.setItem("authToken", newToken);
        return newToken;
      }
      return null;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  };

  const getUserProfile = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axiosInstance.get(`/profile/get`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const updatedProfile = response.data.user || response.data.profile;
      if (updatedProfile) {
        setUserProfile(updatedProfile);
        setUser(prevUser => ({ ...prevUser, ...updatedProfile }));
        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
        setProfileFetched(true);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response && error.response.status === 401) {
        const refreshed = await refreshToken();
        if (!refreshed) {
          logout();
        }
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

      if (response.data && response.data.success) {
        const updatedProfile = response.data.profile || response.data;
        setUserProfile(prevProfile => ({
          ...prevProfile,
          ...updatedProfile
        }));
        setUser(prevUser => ({
          ...prevUser,
          ...updatedProfile
        }));
        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
        setSuccess(true);
        return { success: true, profile: updatedProfile };
      } else {
        const errorMessage = response.data?.message || "Failed to update profile. Please try again.";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      const errorMessage = error.response?.data?.message || "Failed to update profile. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  useEffect(() => {
    if (isLoggedIn && (!userProfile || Object.keys(userProfile).length === 0)) {
      getUserProfile();
    }
  }, [isLoggedIn, userProfile, getUserProfile]);

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
        updateUser,
        getUserProfile, 
        userProfile, 
        updateUserProfile, 
        error, 
        success,
        isLoading,
        setError,
        refreshToken,
        setSuccess,
        axiosInstance,
        updateAxiosToken
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;