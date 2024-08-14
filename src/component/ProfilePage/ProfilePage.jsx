import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { useAuth } from "../../Context/AuthContext";
import { debounce } from 'lodash';
import './ProfilePage.css';

const API_BASE_URL = 'https://roadrunner-food-ordering-api-4.onrender.com';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const tokenResponse = await axios.post(`${API_BASE_URL}/api/auth/token`, { /* your credentials */ });
        if (tokenResponse.data && tokenResponse.data.token) {
          localStorage.setItem('token', tokenResponse.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`;
          error.config.headers['Authorization'] = `Bearer ${tokenResponse.data.token}`;
          return axiosInstance.request(error.config);
        }
      } catch (tokenError) {
        console.error('Failed to refresh token', tokenError);
      }
    }
    return Promise.reject(error);
  }
);

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersFetched, setOrdersFetched] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ ...user });
  const [isEditCardVisible, setIsEditCardVisible] = useState(false);

  const fetchedRef = useRef(false);

  const debouncedUpdateFormData = useMemo(
    () => debounce((data) => setFormData(data), 300),
    []
  );

  const showAlert = useCallback((message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  }, []);

  const fetchUserData = useCallback(async () => {
    if (fetchedRef.current) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/api/user/profile');
      if (response.data && response.data.user) {
        const updatedUser = {
          ...response.data.user,
          avatar: response.data.user.avatar ? `${API_BASE_URL}${response.data.user.avatar}` : null
        };
        updateUser(updatedUser);
        setFormData(updatedUser);
      } else {
        showAlert('Error fetching user data.', 'error');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showAlert('Error fetching user data. Please try again.', 'error');
    } finally {
      setIsLoading(false);
      fetchedRef.current = true;
    }
  }, [updateUser, showAlert]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  useEffect(() => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setPreviewImage(null);
    }
  }, [selectedImage]);

  const fetchOrders = useCallback(async () => {
    if (ordersFetched || orders.length > 0) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/api/orders');
      if (response.data && response.data.orders) {
        setOrders(response.data.orders);
        setOrdersFetched(true);
      } else {
        showAlert('No orders found or error fetching orders.', 'info');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response && error.response.status === 404) {
        showAlert('No orders found.', 'info');
      } else {
        showAlert('Error fetching orders. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [ordersFetched, orders.length, showAlert]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedFormData = new FormData();
  
    updatedFormData.append('firstName', formData.firstName || '');
    updatedFormData.append('lastName', formData.lastName || '');
    updatedFormData.append('email', formData.email || '');
    updatedFormData.append('phone', formData.phone || '');
    updatedFormData.append('street', formData.address?.street || '');
    updatedFormData.append('city', formData.address?.city || '');
    updatedFormData.append('state', formData.address?.state || '');
    updatedFormData.append('country', formData.address?.country || '');
  
    if (selectedImage) {
      updatedFormData.append('avatar', selectedImage);
    }
  
    try {
      const response = await axiosInstance.put('/api/user/profile', updatedFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data && response.data.user) {
        const updatedUser = {
          ...response.data.user,
          avatar: response.data.user.avatar ? `${API_BASE_URL}${response.data.user.avatar}` : null
        };
        updateUser(updatedUser);
        setFormData(updatedUser);
        setSelectedImage(null);
        setPreviewImage(null);
        handleCancelEdit();
        showAlert('Profile updated successfully!', 'success');
        fetchedRef.current = false;
        await fetchUserData();
      } else {
        showAlert('Error updating profile. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error.response ? error.response.data : error.message);
      showAlert('Error updating profile. Please try again.', 'error');
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => setIsEditCardVisible(true), 50);
  };

  const handleCancelEdit = () => {
    setIsEditCardVisible(false);
    setTimeout(() => {
      setIsEditing(false);
      setFormData({ ...user });
      setSelectedImage(null);
      setPreviewImage(null);
    }, 300);
  };

  if (isLoading) return <div className="profile-page-loading">Loading...</div>;
  if (!user) return <div className="profile-page-loading">No user data available</div>;

  return (
    <div className="profile-page-container">
      {alert.show && (
        <div className={`alert alert-${alert.type} ${alert.show ? 'show' : ''}`}>
          {alert.message}
        </div>
      )}
      {!isEditing && formData.avatar && (
        <img 
          src={formData.avatar}
          alt="Avatar" 
          className="profile-avatar" 
        />
      )}
      <h1 className="profile-page-title">My Profile</h1>
      <div className="profile-page-tabs">
        <button 
          className={`profile-page-tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Personal Info
        </button>
        <button 
          className={`profile-page-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('orders');
            fetchOrders();
          }}
        >
          Order History
        </button>
      </div>
      
      {activeTab === 'info' && (
        <div className="profile-page-info">
          {isEditing ? (
            <div className={`profile-edit-card ${isEditCardVisible ? 'show' : ''}`}>
              <form onSubmit={handleUpdate} className="profile-page-form">
                <div className="profile-page-form-group">
                  <label>First Name:</label>
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => debouncedUpdateFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="profile-page-form-group">
                  <label>Last Name:</label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => debouncedUpdateFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
                <div className="profile-page-form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => debouncedUpdateFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="profile-page-form-group">
                  <label>Phone:</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => debouncedUpdateFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="profile-page-form-group">
                  <label>Street:</label>
                  <input
                    type="text"
                    value={formData.address?.street || ''}
                    onChange={(e) => debouncedUpdateFormData({ 
                      ...formData, 
                      address: { ...formData.address, street: e.target.value } 
                    })}
                  />
                </div>
                <div className="profile-page-form-group">
                  <label>City:</label>
                  <input
                    type="text"
                    value={formData.address?.city || ''}
                    onChange={(e) => debouncedUpdateFormData({ 
                      ...formData, 
                      address: { ...formData.address, city: e.target.value } 
                    })}
                  />
                </div>
                <div className="profile-page-form-group">
                  <label>State:</label>
                  <input
                    type="text"
                    value={formData.address?.state || ''}
                    onChange={(e) => debouncedUpdateFormData({ 
                      ...formData, 
                      address: { ...formData.address, state: e.target.value } 
                    })}
                  />
                </div>
                <div className="profile-page-form-group">
                  <label>Country:</label>
                  <input
                    type="text"
                    value={formData.address?.country || ''}
                    onChange={(e) => debouncedUpdateFormData({ 
                      ...formData, 
                      address: { ...formData.address, country: e.target.value } 
                    })}
                  />
                </div>
                <div className="profile-page-form-group">
                  <label>Avatar:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                  />
                  {(previewImage || formData.avatar) && (
                    <img 
                      src={previewImage || formData.avatar} 
                      alt="Avatar Preview" 
                      className="profile-avatar-preview" 
                    />
                  )}
                </div>
                <div className="profile-page-form-group">
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="profile-page-info-card">
              <div className="profile-page-info-item">
                <strong>First Name:</strong> {formData.firstName}
              </div>
              <div className="profile-page-info-item">
                <strong>Last Name:</strong> {formData.lastName}
              </div>
              <div className="profile-page-info-item">
                <strong>Email:</strong> {formData.email}
              </div>
              <div className="profile-page-info-item">
                <strong>Phone:</strong> {formData.phone}
              </div>
              <div className="profile-page-info-item">
                <strong>Address:</strong> {formData.address?.street}, {formData.address?.city}, {formData.address?.state}, {formData.address?.country}
              </div>
              <div className="profile-page-info-item">
                <strong>Avatar:</strong> 
                {formData.avatar && (
                  <img src={formData.avatar} alt="Avatar" className="profile-avatar" />
                )}
              </div>
              <button className="btn btn-edit" onClick={handleEditClick}>Edit Profile</button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="profile-page-orders">
          {isLoading ? (
            <div>Loading orders...</div>
          ) : (
            <ul>
              {orders.map(order => (
                <li key={order._id} className="order-item">
                  <h3>Order ID: {order._id}</h3>
                  <p>Status: {order.status}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;