import React, { useState, useEffect } from 'react';
import { useAuth } from "../../Context/AuthContext";
import './ProfilePage.css';

const API_URL = 'https://food-delivery-api-rcff.onrender.com';

function ProfilePage() {
  const { 
    userProfile, 
    updateUserProfile, 
    error, 
    success, 
    getUserProfile, 
    setError, 
    setSuccess,
    isLoggedIn,
    orderHistory,
    getOrderHistory
  } = useAuth();
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    image: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      getUserProfile();
      getOrderHistory();
    }
  }, [isLoggedIn, getUserProfile, getOrderHistory]);

  useEffect(() => {
    if (isLoggedIn && userProfile) {
      setProfileData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        image: userProfile.image || ''
      });
    }
  }, [isLoggedIn, userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError(null);
    setSuccess(false);

    const formData = new FormData();
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== null && profileData[key] !== undefined && profileData[key] !== '') {
        formData.append(key, profileData[key]);
      }
    });

    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      const result = await updateUserProfile(formData);
      
      if (result.success) {
        setProfileData(prevData => ({
          ...prevData,
          ...result.profile
        }));
        setSelectedImage(null);
        setSuccess(true);
        setLocalError(null);
        
        // Refresh the profile data
        await getUserProfile();
      } else {
        setLocalError(result.message || 'Failed to update profile. Please try again.');
        setSuccess(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setLocalError('An error occurred while updating the profile. Please try again.');
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/Avatar.png';
    return imagePath.startsWith('http') ? imagePath : `${API_URL}${imagePath}`;
  };

  return (
    <div className="profile-page-container">
      <h2 className="profile-page-title">Profile</h2>
      {localError && <div className="alert alert-error show">{localError}</div>}
      {error && <div className="alert alert-error show">{error}</div>}
      {success && <div className="alert alert-success show">Profile updated successfully!</div>}
      <div className="profile-page-info">
        <form onSubmit={handleSubmit} className="profile-page-form">
          <div className="profile-page-info-item">
            <img
              key={profileData.image}
              src={getImageUrl(profileData.image)}
              alt="Profile"
              className="profile-avatar"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="profileImage"
              style={{ display: 'none' }}
            />
            <label htmlFor="profileImage" className="btn btn-edit">Change Profile Picture</label>
          </div>
          <div className="profile-page-info-card">
            <div className="profile-page-form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                type="text"
                placeholder="First Name"
              />
            </div>
            <div className="profile-page-form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                type="text"
                placeholder="Last Name"
              />
            </div>
            <div className="profile-page-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="profile-page-form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                type="tel"
                placeholder="Phone"
              />
            </div>
            <div className="profile-page-form-group">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                value={profileData.address}
                onChange={handleChange}
                type="text"
                placeholder="Address"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
      
      <div className="order-history-section">
        <h3>Order History</h3>
        {orderHistory.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <ul className="order-list">
            {orderHistory.map((order) => (
              <li key={order._id} className="order-item">
                <div>Order ID: {order._id}</div>
                <div>Total: ${order.total}</div>
                <div>Date: {new Date(order.createdAt).toLocaleDateString()}</div>
                <div>Status: {order.status}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;