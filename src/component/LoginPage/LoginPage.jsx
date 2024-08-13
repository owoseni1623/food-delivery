// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../Context/AuthContext";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
// import "./LoginPage.css";

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const response = await axios.post('http://localhost:3000/api/user/login', { email, password });
//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         login({ email, token: response.data.token }); // Update auth context with token
//         navigate('/'); // Navigate to home page
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       setError('Login failed. Please check your credentials and try again.');
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="login-container">
//       <div className="login-form">
//         <h2>Login</h2>
//         {error && <p className="error-message">{error}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email">Email:</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password">Password:</label>
//             <div className="password-input">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <FontAwesomeIcon
//                 icon={showPassword ? faEyeSlash : faEye}
//                 className="toggle-password-icon"
//                 onClick={togglePasswordVisibility}
//               />
//             </div>
//           </div>
//           <button type="submit" className="login-button">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../Context/AuthContext";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
// import "./LoginPage.css";

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const response = await axios.post('http://localhost:3000/api/user/login', { email, password }, {
//         withCredentials: true // This is important for sending cookies
//       });
      
//       if (response.data.success) {
//         // The backend sets the token in an HTTP-only cookie, so we don't need to store it in localStorage
//         login({ 
//           email: response.data.user.email, 
//           role: response.data.user.role,
//           firstName: response.data.user.firstName,
//           lastName: response.data.user.lastName
//         });
//         alert('Login successful!');
//         navigate('/'); // Navigate to home page
//       } else {
//         setError(response.data.message || 'Login failed. Please check your credentials and try again.');
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       setError('Login failed. Please check your credentials and try again.');
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="login-container">
//       <div className="login-form">
//         <h2>Login</h2>
//         {error && <p className="error-message">{error}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email">Email:</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password">Password:</label>
//             <div className="password-input">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <FontAwesomeIcon
//                 icon={showPassword ? faEyeSlash : faEye}
//                 className="toggle-password-icon"
//                 onClick={togglePasswordVisibility}
//               />
//             </div>
//           </div>
//           <button type="submit" className="login-button">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../Context/AuthContext";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
// import "./LoginPage.css";

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     try {
//       const response = await axios.post('http://localhost:3000/api/user/login', { email, password }, {
//         withCredentials: true // Ensure cookies are sent and received
//       });

//       if (response.data.success) {
//         // Call login from AuthContext to update the auth state
//         login({ 
//           email: response.data.user.email, 
//           role: response.data.user.role,
//           firstName: response.data.user.firstName,
//           lastName: response.data.user.lastName
//         });
//         alert('Login successful!');
//         navigate('/'); // Navigate to home page or intended route
//       } else {
//         setError(response.data.message || 'Login failed. Please check your credentials and try again.');
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       setError('Login failed. Please check your credentials and try again.');
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(prevState => !prevState);
//   };

//   return (
//     <div className="login-container">
//       <div className="login-form">
//         <h2>Login</h2>
//         {error && <p className="error-message">{error}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email">Email:</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password">Password:</label>
//             <div className="password-input">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <FontAwesomeIcon
//                 icon={showPassword ? faEyeSlash : faEye}
//                 className="toggle-password-icon"
//                 onClick={togglePasswordVisibility}
//               />
//             </div>
//           </div>
//           <button type="submit" className="login-button">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./LoginPage.css";

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
        'http://localhost:3000/api/user/login',
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