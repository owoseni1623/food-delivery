import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const LogoutPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Assuming you have a logout function in your AuthContext

  useEffect(() => {
    logout(); // Call the logout function to clear user data
    navigate("/"); // Redirect to the home page after logout
  }, [logout, navigate]);

  return <div>Logging out...</div>;
};

export default LogoutPage;