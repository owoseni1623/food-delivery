import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from "react";
import ToggleProvider from "./ToggleContext";
import axios from "axios";

const AuthContext = createContext();

const API_BASE_URL = 'https://food-delivery-api-rcff.onrender.com/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

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
      updateAxiosToken(storedToken);
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
  }, [updateAxiosToken]);

  const handleAuthResponse = useCallback(async (response) => {
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
  }, [updateAxiosToken]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, { email, password });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setUser(response.data.user);
        setAuthToken(response.data.token);
        setToken(response.data.token);
        setIsLoggedIn(true);
        updateAxiosToken(response.data.token);
        setProfileFetched(false);
        await getUserProfile();
        return { success: true, message: "Login successful", token: response.data.token };
      } else {
        throw new Error("Login failed: No token received");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || 'An error occurred during login');
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

  const updateUser = useCallback((updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
    window.dispatchEvent(new Event('user-updated'));
  }, [user]);

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
    updateAxiosToken(null);
  }, [updateAxiosToken]);

  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, {}, {
        withCredentials: true
      });
      if (response.data.token) {
        const newToken = response.data.token;
        setToken(newToken);
        setAuthToken(newToken);
        localStorage.setItem("authToken", newToken);
        updateAxiosToken(newToken);
        return newToken;
      }
      return null;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  }, [updateAxiosToken]);

  const getUserProfile = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axiosInstance.get(`/profile/get`);
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
  }, [token, logout, axiosInstance, refreshToken]);

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

  const contextValue = useMemo(() => ({
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
  }), [
    isLoggedIn, user, login, token, authToken, setToken, setAuthToken,
    logout, signup, updateUser, getUserProfile, userProfile, updateUserProfile,
    error, success, isLoading, refreshToken, axiosInstance, updateAxiosToken
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      <ToggleProvider>
        {children}
      </ToggleProvider>
    </AuthContext.Provider>
  );
};

export default AuthProvider;