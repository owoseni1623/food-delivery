import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./LoginPage.css";


const API_BASE_URL = 'https://food-delivery-api-rcff.onrender.com';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/login`,
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        login(user);
        alert("⚠️ Login successful!");
        navigate('/');
      } else {
        setError(response.data.message || 'Login failed. Please check your credentials and try again.');
        alert(`⚠️ ${response.data.message || 'Login failed. Please check your credentials and try again.'}`);
      }
    } catch (error) {
      console.error('Login failed:', error);
      let errorMessage = 'An error occurred. Please try again.';
      if (error.response) {
        errorMessage = error.response.data.message || 'Login failed. Please check your credentials and try again.';
      } else if (error.request) {
        errorMessage = 'No response from server. Please try again later.';
      }
      setError(errorMessage);
      alert(`⚠️ ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="toggle-password-icon"
                onClick={togglePasswordVisibility}
              />
            </div>
          </div>
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;