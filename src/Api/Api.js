// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://food-delivery-c1lp.onrender.com',
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers your API requires
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post('https://food-delivery-api-rcff.onrender.com/api/user/refresh-token', {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;