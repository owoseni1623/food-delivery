import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import "./UserPage.css";



const UserPage = () => {
  const { user, updateUser, isLoggedIn } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    userName: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (user) {
      setUpdatedUser({
        name: user.name,
        userName: user.userName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar || "",
      });
      setImagePreview(user.avatar || "");
      setLoading(false);
    } else {
      setError("Failed to load user data");
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setUpdatedUser((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(updatedUser);
      setEditMode(false);
      setError(null);
      setImagePreview(updatedUser.avatar);
    } catch (error) {
      setError("Failed to update user data");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="user11page">Loading user data...</div>;
  }

  if (error) {
    return <div className="user11page">Error: {error}</div>;
  }

  const getFirstName = (name) => {
    return name ? name.split(" ")[0] : "";
  };

  return (
    <div className="user11page">
      <div className="user11container">
        <h1 className="user11title">
          {updatedUser.name}'s Profile
          <span className={`status-indicator ${isLoggedIn ? "online" : "offline"}`}>
            {isLoggedIn ? "Online" : "Offline"}
          </span>
        </h1>
        <div className="user11profile">
          <img
            src={imagePreview || "/path/to/default/avatar.png"}
            alt="User Avatar"
            className="user11avatar"
          />
          <h2>{getFirstName(updatedUser.name)}</h2>
          {editMode ? (
            <form onSubmit={handleSubmit} className="user11form">
              <input
                type="text"
                name="name"
                value={updatedUser.name}
                onChange={handleInputChange}
                className="user11input"
                placeholder="Name"
              />
              <input
                type="text"
                name="userName"
                value={updatedUser.userName}
                onChange={handleInputChange}
                className="user11input"
                placeholder="Username"
              />
              <input
                type="email"
                name="email"
                value={updatedUser.email}
                onChange={handleInputChange}
                className="user11input"
                placeholder="Email"
              />
              <input
                type="tel"
                name="phone"
                value={updatedUser.phone}
                onChange={handleInputChange}
                className="user11input"
                placeholder="Phone"
              />
              <textarea
                name="address"
                value={updatedUser.address}
                onChange={handleInputChange}
                className="user11input user11textarea"
                placeholder="Address"
              ></textarea>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="user11fileinput"
              />
              <div className="user11buttoncontainer">
                <button type="submit" className="user11button">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="user11button user11cancelbutton"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <p>
                <strong>Username:</strong> {updatedUser.userName}
              </p>
              <p>
                <strong>Email:</strong> {updatedUser.email}
              </p>
              <p>
                <strong>Phone:</strong> {updatedUser.phone}
              </p>
              <p>
                <strong>Address:</strong> {updatedUser.address}
              </p>
              <button onClick={() => setEditMode(true)} className="user11button">
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;