import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./SignUpPage.css";

// const api = axios.create({
//   baseURL: 'https://roadrunner-food-ordering-api-4.onrender.com',
//   validateStatus: function (status) {
//     return status < 500; // Resolve only if the status code is less than 500
//   }
// });
const baseURL = 'https://roadrunner-food-ordering-api-4.onrender.com';



const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
  
    if (!validateForm()) {
      return;
    }
  
    setIsLoading(true);
  
    const registrationData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        country: formData.country
      },
      password: formData.password
    };
  
    try {
      // console.log("Sending request to:", api.defaults.baseURL + "/users/register");
      // console.log("Received response:", response);
      const response = await axios.post(`${baseURL}/api/users/register`, registrationData, {
        method: "POST",
        
      });
  
      if (response.data.success) {
        setSuccessMessage("Registration successful! Please check your email to verify your account.");
        alert("Registration successful! Please check your email to verify your account.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          country: "",
          password: "",
          confirmPassword: ""
        });
        navigate("/login");
      } else {
        setError(response.data.message || "Sign up failed. Please try again.");
      }
    } catch (error) {
      console.error("Sign up failed:", error);
      let errorMessage = "An unknown error occurred. Please try again later.";
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || "Invalid input. Please check your details.";
        } else if (error.response.status === 409) {
          errorMessage = "Email already exists. Please use a different email.";
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword((prev) => !prev);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-form">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <p>After signing up, please check your email to verify your account before logging in.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="street">Street:</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State:</label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country:</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="toggle-password-icon"
                onClick={() => togglePasswordVisibility('password')}
                aria-label={showPassword ? "Hide password" : "Show password"}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                className="toggle-password-icon"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              />
            </div>
          </div>
          <button type="submit" className="sign-up-button" disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;