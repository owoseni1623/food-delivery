import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./LoginPage.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, token, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Login component mounted");
    return () => console.log("Login component unmounted");
  }, []);

  useEffect(() => {
    console.log("Auth state in Login:", { isLoggedIn, token, user });
  }, [isLoggedIn, token, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      const result = await login(email, password);
      console.log("Login result:", result);
      
      if (result.success) {
        console.log("Login successful, token:", result.token);
        alert("✅ Login successful!");
        navigate('/');
      } else {
        console.log("Login failed:", result.message);
        setError(result.message);
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again later.');
      alert('❌ An unexpected error occurred. Please try again later.');
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
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;