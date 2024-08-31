import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children, syncCartAfterLogin }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "https://food-delivery-api-rcff.onrender.com";

  const axiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('/api/users/profile');
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to fetch user profile');
      setLoading(false);
      logout(); // Logout if token is invalid
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${apiUrl}/api/users/login`, { email, password });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
      if (syncCartAfterLogin) {
        await syncCartAfterLogin();
      }
      toast.success("Login successful", {
        position: "top-center",
        autoClose: 2000,
      });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during login';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${apiUrl}/api/users/register`, { name, email, password });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
      if (syncCartAfterLogin) {
        await syncCartAfterLogin();
      }
      toast.success("Registration successful", {
        position: "top-center",
        autoClose: 2000,
      });
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during registration';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers['Authorization'];
    toast.info("You have been logged out", {
      position: "top-center",
      autoClose: 2000,
    });
  }, []);

  const updateProfile = async (updatedData) => {
    try {
      const response = await axiosInstance.put('/api/users/profile', updatedData);
      setUser(response.data);
      toast.success("Profile updated successfully", {
        position: "top-center",
        autoClose: 2000,
      });
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred while updating profile';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
      return { success: false, error: errorMessage };
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axiosInstance.post('/api/users/refresh-token');
      const { token: newToken } = response.data;
      setToken(newToken);
      localStorage.setItem('token', newToken);
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${newToken}`;
      return { success: true };
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return { success: false, error: 'Failed to refresh token' };
    }
  };

  const isLoggedIn = !!user;

  const contextValue = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isLoggedIn,
    axiosInstance,
    updateProfile,
    refreshToken
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;