import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./VerifyPage.css";

const VerifyPage = () => {
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { email, phone } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post("/api/user/verify", {
        email,
        phone,
        emailCode,
        phoneCode,
      });

      if (response.data && response.data.success) {
        setSuccessMessage("Verification successful!");
        // Navigate to the main app or dashboard
        navigate("/dashboard");
      } else {
        setError(response.data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unknown error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-form">
        <h2>Verify Your Account</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="emailCode">Email Verification Code:</label>
            <input
              type="text"
              id="emailCode"
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneCode">Phone Verification Code:</label>
            <input
              type="text"
              id="phoneCode"
              value={phoneCode}
              onChange={(e) => setPhoneCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="verify-button">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyPage;