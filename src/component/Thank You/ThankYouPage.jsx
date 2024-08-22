import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEcom } from "../../Context/EcomContext";
import axios from "axios";
import { Helmet } from "react-helmet";
import "./ThankYouPage.css";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {apiUrl} = useEcom()

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const searchParams = new URLSearchParams(location.search);
      const transactionId = searchParams.get("transaction_id");

      if (!transactionId) {
        console.log("No transaction ID found. Showing generic thank you message.");
        setOrderDetails({ generic: true });
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/api/verify?transaction_id=${transactionId}`);

        if (response.data.success) {
          setOrderDetails(response.data.data);
        } else {
          console.log("Payment verification failed. Showing generic thank you message.");
          setOrderDetails({ generic: true });
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        console.log("Error occurred. Showing generic thank you message.");
        setOrderDetails({ generic: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location]);

  if (isLoading) {
    return (
      <div className="loading" aria-live="polite">
        <p>Processing your order...</p>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Thank You for Your Order | Your Store Name</title>
        <meta name="description" content="Your order has been successfully placed." />
      </Helmet>
      <div className="thank-you-page">
        <div className="thank-you-content">
          <h1>🎉 Thank You for Your Order! 🎉</h1>
          <div className="order-success">
            <i className="fas fa-check-circle" aria-hidden="true"></i>
            <p>Your order has been successfully placed.</p>
          </div>
          {orderDetails && !orderDetails.generic && (
            <div className="order-details">
              <h2>Order Details</h2>
              <p><strong>Order #:</strong> {orderDetails.txRef || "N/A"}</p>
              <p><strong>Total Amount:</strong> {orderDetails.currency || ""} {orderDetails.amount ? orderDetails.amount.toFixed(2) : "N/A"}</p>
              <p><strong>Name:</strong> {orderDetails.customerName || "N/A"}</p>
              <p><strong>Email:</strong> {orderDetails.customerEmail || "N/A"}</p>
              <p><strong>Status:</strong> <span className="status-success">{orderDetails.paymentStatus || "Completed"}</span></p>
            </div>
          )}
          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul>
              <li>You will receive an email confirmation shortly.</li>
              <li>Your order will be processed and delivered within 4-5 hours.</li>
              <li>For any questions, please contact our customer support.</li>
            </ul>
          </div>
          <button onClick={() => navigate("/")} className="home-button">
            Continue Shopping
          </button>
        </div>
        <div className="confetti" aria-hidden="true">
          {[...Array(100)].map((_, i) => (
            <div key={i} className="confetti-piece"></div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ThankYouPage;
