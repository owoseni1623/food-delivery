import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBars } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../Context/AuthContext";
import { useEcom } from "../../Context/EcomContext";
import avatarImage from "/images/Avatar.png";
import logo from "/images/logo.jpeg";
import "./Header.css";

const API_BASE_URL = 'https://food-delivery-api-rcff.onrender.com';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const { isLoggedIn, user, logout, userProfile, getUserProfile } = useAuth();
  const { getCartItemCount } = useEcom();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 60) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        setHideHeader(true);
      } else {
        setHideHeader(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const handleUserUpdate = () => {
      getUserProfile();
    };

    window.addEventListener('user-updated', handleUserUpdate);

    return () => {
      window.removeEventListener('user-updated', handleUserUpdate);
    };
  }, [getUserProfile]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getAvatarUrl = () => {
    if (userProfile && userProfile.image) {
      return userProfile.image.startsWith('http') 
        ? userProfile.image 
        : `${API_BASE_URL}${userProfile.image}`;
    }
    return avatarImage;
  };

  return (
    <header className={`header ${isSticky ? "sticky" : ""} ${hideHeader ? "hide" : ""}`}>
      <div className="header-container">
        <div className="logo-title-container">
          <Link to="/">
            <img src={logo} alt="Logo" className="header-logo" />
          </Link>
          <h1 className="header-title">Roadrunner Foods</h1>
          <button className="menu-toggle" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <nav className={`navbar ${isMenuOpen ? "open" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/menu" onClick={() => setIsMenuOpen(false)}>Menu</Link>
            </li>
            <li className="nav-item">
              <Link to="/listing" onClick={() => setIsMenuOpen(false)}>Restaurant</Link>
            </li>
            <li className="nav-item cart-icon">
              <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                <FontAwesomeIcon icon={faShoppingCart} />
                {getCartItemCount() > 0 && <span className="cart-count">{getCartItemCount()}</span>}
              </Link>
            </li>
            {isLoggedIn && user ? (
              <li className="nav-item auth-items">
                <Link to="/profile" className="profile-link" onClick={() => setIsMenuOpen(false)}>
                <img 
                  src={getAvatarUrl()} 
                  alt={userProfile?.firstName || user?.firstName || "User"} 
                  className="user-avatar" 
                />
                <span className="user-name" title={userProfile?.firstName || user?.firstName || "User"}>
                  {userProfile?.firstName || user?.firstName || "User"}
                </span>
                </Link>
                <button className="auth-link" onClick={handleLogout}>Log Out</button>
              </li>
            ) : (
              <>
                <li className="nav-item auth-items">
                  <Link to="/login" className="auth-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
                </li>
                <li className="nav-item auth-items">
                  <Link to="/signup" className="auth-link" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;