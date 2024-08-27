// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../Context/AuthContext';
// import "./ProfileEditPage";

// const ProfileEditPage = () => {
//   const { user, updateUserProfile, error, success } = useAuth();
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     street: '',
//     city: '',
//     state: '',
//     country: '',
//   });

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         firstName: user.firstName || '',
//         lastName: user.lastName || '',
//         email: user.email || '',
//         phone: user.phone || '',
//         street: user.address?.street || '',
//         city: user.address?.city || '',
//         state: user.address?.state || '',
//         country: user.address?.country || '',
//       });
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const profileData = {
//       firstName: formData.firstName,
//       lastName: formData.lastName,
//       phone: formData.phone,
//       address: {
//         street: formData.street,
//         city: formData.city,
//         state: formData.state,
//         country: formData.country,
//       },
//     };

//     const result = await updateUserProfile(profileData);
//     if (result.success) {
//       alert('Profile updated successfully!');
//     }
//   };

//   return (
//     <div className="profile-edit-container">
//       <h2>Edit Profile</h2>
//       {error && <p className="error-message">{error}</p>}
//       {success && <p className="success-message">Profile updated successfully!</p>}
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="firstName">First Name:</label>
//           <input
//             type="text"
//             id="firstName"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="lastName">Last Name:</label>
//           <input
//             type="text"
//             id="lastName"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             readOnly
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="phone">Phone:</label>
//           <input
//             type="tel"
//             id="phone"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="street">Street:</label>
//           <input
//             type="text"
//             id="street"
//             name="street"
//             value={formData.street}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="city">City:</label>
//           <input
//             type="text"
//             id="city"
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="state">State:</label>
//           <input
//             type="text"
//             id="state"
//             name="state"
//             value={formData.state}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="country">Country:</label>
//           <input
//             type="text"
//             id="country"
//             name="country"
//             value={formData.country}
//             onChange={handleChange}
//           />
//         </div>
//         <button type="submit" className="update-profile-button">Update Profile</button>
//       </form>
//     </div>
//   );
// };

// export default ProfileEditPage;