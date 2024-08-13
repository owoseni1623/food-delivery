import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import "./FooterPage.css"

const FooterPage = ({ isLoggedIn }) => {
  return (
    <footer className="footer10footer">
      <div className="footer10footer-content">
        <div className="footer10footer-section">
          <h3>About Us</h3>
          <p>We are passionate about delivering the finest culinary experiences right to your doorstep.</p>
        </div>
        <div className="footer10footer-section">
          <h3>Contact</h3>
          <p>Email: roadrunner@project.com</p>
          <p>Phone: (234) 903-7892-090</p>
          <p>Address: 12 Perfecter Street, Ikorodu, Lagos State, Nigeria 500001</p>
        </div>
        <div className="footer10footer-section">
          <h3>Quick Links</h3>
          <ul className="footer10footer-links">
            {/* <li><Link to="/order">Order Now</Link></li> */}
            <li><Link to="/">Home</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            {!isLoggedIn ? (
              <>
                {/* Uncomment if you want to add login and signup links */}
                {/* <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Sign Up</Link></li> */}
              </>
            ) : (
              <li><Link to="/profile">My Profile</Link></li>
            )}
          </ul>
        </div>
        <div className="footer10footer-section">
          <h3>Restaurant Links</h3>
          <ul className="footer10footer-links">
            <li><Link to="/listing">Restaurant Listing</Link></li>
            <li><Link to="/restaurant">Partner Restaurant</Link></li>
            <li><Link to="/menu">Restaurant Menu</Link></li>
          </ul>
        </div>
        <div className="footer10footer-section">
          <h3>Follow Us</h3>
          <div className="footer10social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          </div>
        </div>
      </div>
      <div className="footer10footer-bottom">
        <p>&copy; 2024 Roadrunner Foods. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default FooterPage;