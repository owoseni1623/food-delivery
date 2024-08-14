import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEcom } from "../../Context/EcomContext";
import { useAuth } from "../../Context/AuthContext"; // Add this import
import axios from "axios";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { orderDetails } = useEcom();
  const { user } = useAuth(); // Add this line to get the user from AuthContext
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    state: "",
    country: "",
    description: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      console.log("No user found, redirecting to login");
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
  
    if (!orderDetails || !orderDetails.totalPrice || !orderDetails.items || orderDetails.items.length === 0) {
      console.log("Invalid order details, redirecting to cart");
      setError("Your cart is empty or order details are invalid. Redirecting to cart page.");
      navigate('/cart');
    } else {
      console.log("Order details present:", orderDetails);
      // Pre-fill the form with user data if available
      if (user) {
        setPaymentData(prevData => ({
          ...prevData,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phone: user.phone || "",
          email: user.email || "",
        }));
      }
    }
  }, [orderDetails, navigate, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Change 'authToken' to 'token'
    if (!token) {
      setError("You are not authenticated. Please log in.");
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    const orderData = {
      items: orderDetails.items,
      totalAmount: orderDetails.totalPrice,
      address: {
        firstName: paymentData.firstName,
        lastName: paymentData.lastName,
        phone: paymentData.phone,
        fullAddress: `${paymentData.street}, ${paymentData.city}, ${paymentData.state}, ${paymentData.country}`
      },
      description: paymentData.description
    };

    try {
      const response = await axios.post("https://roadrunner-food-ordering-api-4.onrender.com/api/orders/create", orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.data.success) {
        console.log("Order created successfully:", response.data.order);
        // Navigate to payment page or thank you page
        navigate('/thank-you');
      } else {
        setError("Order creation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      if (error.response && error.response.status === 401) {
        setError("Your session has expired. Please log in again.");
        navigate('/login', { state: { from: '/checkout' } });
      } else {
        setError(`An error occurred: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  if (!orderDetails || typeof orderDetails.totalPrice !== 'number') {
    return <div className="checkout-page4">Loading order details...</div>;
  }

  return (
    <div className="checkout-page4">
      <h2 className="title4">Checkout</h2>
      <div className="checkout-content4">
        <div className="order-summary4">
          <h2>Order Summary</h2>
          {orderDetails.items.map((item, index) => (
            <div key={index} className="summary-item4">
              <span>{item.name} x {item.quantity}</span>
              <span>₦{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="subtotal4">
            <span>Subtotal:</span>
            <span>₦{orderDetails.subtotal.toFixed(2)}</span>
          </div>
          <div className="delivery-fee4">
            <span>Delivery Fee:</span>
            <span>₦{orderDetails.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="total4">
            <span>Total:</span>
            <span>₦{orderDetails.totalPrice.toFixed(2)}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="checkout-form4">
          <h2>Personal Information</h2>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={paymentData.firstName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={paymentData.lastName}
            onChange={handleInputChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={paymentData.phone}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={paymentData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={paymentData.street}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={paymentData.city}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={paymentData.state}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={paymentData.country}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={paymentData.description}
            onChange={handleInputChange}
          />
          {error && <p className="error4">{error}</p>}
          <button type="submit" className="proceed-to-payment-btn4">
            Proceed To Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;