import React, { useState, useEffect } from 'react';
import { useAuth } from "../../Context/AuthContext";
import './ProfilePage.css';

const API_URL = 'http://localhost:3000';

function ProfilePage() {
  const { userProfile, updateUserProfile, error, success, getUserProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    image: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    getUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile) {
      setProfileData(prevData => ({
        ...prevData,
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        image: userProfile.image || ''
      }));
    }
  }, [userProfile, userProfile?.image]);

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
    console.log("Submitting profile update:", profileData);
  
    const formData = new FormData();
    formData.append('firstName', profileData.firstName);
    formData.append('lastName', profileData.lastName);
    formData.append('email', profileData.email);
    formData.append('phone', profileData.phone);
    formData.append('address', profileData.address);
  
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
  
    try {
      const result = await updateUserProfile(formData);
      if (result.success && result.profile) {
        setProfileData(result.profile);
        setSelectedImage(null);
      }
      await getUserProfile();
      console.log("Profile update submitted and refreshed");
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/Avatar.png';
    return imagePath;
  };

  return (
    <div className="profile-page-container">
      <h2 className="profile-page-title">Profile</h2>
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
          <button type="submit" className="btn btn-primary">Update Profile</button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;