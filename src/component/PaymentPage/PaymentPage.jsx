// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useEco } from "../../Context/EcomContext";
// import axios from "axios";
// import "./PaymentPage.css";

// const API_BASE_URL = "http://localhost:3000"; // Adjust this to your API base URL

// const isTokenExpired = (token) => {
//   if (!token) return true;
//   const expiry = JSON.parse(atob(token.split('.')[1])).exp;
//   return Math.floor(new Date().getTime() / 60000) >= expiry;
// };

// const refreshToken = async () => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/api/refresh-token`, {}, {
//       withCredentials: true
//     });
//     const newToken = response.data.token;
//     localStorage.setItem('token', newToken);
//     return newToken;
//   } catch (error) {
//     console.error("Error refreshing token:", error);
//     throw error;
//   }
// };

// const PaymentPage = () => {
//   const { orderDetails, updateOrderDetails } = useEco();
//   const navigate = useNavigate();
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [fullAddress, setFullAddress] = useState("");
//   const [description, setDescription] = useState("");

//   useEffect(() => {
//     if (!orderDetails || !orderDetails.totalPrice || !orderDetails.items || orderDetails.items.length === 0) {
//       alert("Your cart is empty. Redirecting to cart page.");
//       navigate('/cart');
//     }
//   }, [orderDetails, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     let token = localStorage.getItem('token');
//     console.log("Initial token:", token);
  
//     if (!token) {
//       console.error("No token found");
//       alert("You are not logged in. Please log in and try again.");
//       navigate('/login');
//       return;
//     }
  
//     try {
//       const payloadData = {
//         amount: orderDetails.totalPrice,
//         currency: 'NGN',
//         firstName,
//         lastName,
//         phone,
//         email,
//         fullAddress,
//         description,
//         cart: orderDetails.items,
//       };
      
//       console.log("Payload data:", payloadData);
//       console.log("Token being sent:", token);
  
//       console.log("Full request config:", {
//         url: `${API_BASE_URL}/api/payment/initiate`,
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         data: payloadData,
//         withCredentials: true
//       });
  
//       const response = await axios.post(
//         `${API_BASE_URL}/api/payment/initiate`,
//         payloadData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           withCredentials: true,
//         }
//       );
  
//       console.log("Response from server:", response.data);
  
//       if (response.data && response.data.link) {
//         localStorage.setItem('currentOrderId', response.data.orderId);
//         window.location.href = response.data.link;
//       } else {
//         console.error("Unexpected response format:", response.data);
//         alert("Payment initiation failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error initiating payment:", error);
//       if (error.response) {
//         console.error("Response status:", error.response.status);
//         console.error("Response data:", error.response.data);
//       }
//       alert("An error occurred while processing your payment. Please try again or contact support.");
//     }
//   };

//   if (!orderDetails || typeof orderDetails.totalPrice !== 'number') {
//     return <div className="payment-page04">Loading order details...</div>;
//   }

//   return (
//     <div className="payment-page04">
//       <h2 className="title04">Payment</h2>
//       <div className="payment-content04">
//         <div className="order-summary04">
//           <h2>Order Summary</h2>
//           {orderDetails.items.map((item, index) => (
//             <div key={index} className="summary-item04">
//               <span>{item.name} x {item.quantity}</span>
//               <span>₦{(item.price * item.quantity).toFixed(2)}</span>
//             </div>
//           ))}
//           <div className="summary-item04">
//             <span>Subtotal:</span>
//             <span>₦{orderDetails.subtotal.toFixed(2)}</span>
//           </div>
//           <div className="summary-item04">
//             <span>Delivery Fee:</span>
//             <span>₦{orderDetails.deliveryFee.toFixed(2)}</span>
//           </div>
//           <div className="total04">
//             <span>Total:</span>
//             <span>₦{orderDetails.totalPrice.toFixed(2)}</span>
//           </div>
//         </div>
//         <form onSubmit={handleSubmit} className="payment-form04">
//           <h2>Personal Information</h2>
//           <div className="form-group04">
//             <label htmlFor="firstName">First Name:</label>
//             <input
//               type="text"
//               id="firstName"
//               value={firstName}
//               onChange={(e) => setFirstName(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group04">
//             <label htmlFor="lastName">Last Name:</label>
//             <input
//               type="text"
//               id="lastName"
//               value={lastName}
//               onChange={(e) => setLastName(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group04">
//             <label htmlFor="phone">Phone:</label>
//             <input
//               type="tel"
//               id="phone"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group04">
//             <label htmlFor="email">Email:</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group04">
//             <label htmlFor="fullAddress">Full Address:</label>
//             <textarea
//               id="fullAddress"
//               value={fullAddress}
//               onChange={(e) => setFullAddress(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group04">
//             <label htmlFor="description">Description:</label>
//             <textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </div>
          
//           <button type="submit" className="pay-now-btn04">Proceed to Payment</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEco } from "../../Context/EcomContext";
import api from "../../Api/Api"; 
import "./PaymentPage.css";

const PaymentPage = () => {
  const { orderDetails } = useEco();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!orderDetails || !orderDetails.totalPrice || !orderDetails.items || orderDetails.items.length === 0) {
      alert("Your cart is empty. Redirecting to cart page.");
      navigate('/cart');
    }
  }, [orderDetails, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const payloadData = {
        amount: orderDetails.totalPrice,
        currency: 'NGN',
        firstName,
        lastName,
        phone,
        email,
        fullAddress,
        description,
      };
      
      console.log("Payload data:", payloadData);

      const response = await api.post("/api/payment/initiate", payloadData);
  
      console.log("Response from server:", response.data);

      if (response.data && response.data.data && response.data.data.link) {
        localStorage.setItem('currentOrderId', response.data.data.orderId);
        window.location.href = response.data.data.link;
      } else {
        console.error("Unexpected response format:", response.data);
        alert("Payment initiation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        alert(`An error occurred: ${error.response.data.message}`);
      } else {
        alert("An error occurred while processing your payment. Please try again or contact support.");
      }
    }
  };

  if (!orderDetails || typeof orderDetails.totalPrice !== 'number') {
    return <div className="payment-page04">Loading order details...</div>;
  }

  return (
    <div className="payment-page04">
      <h2 className="title04">Payment</h2>
      <div className="payment-content04">
        <div className="order-summary04">
          <h2>Order Summary</h2>
          {orderDetails.items.map((item, index) => (
            <div key={index} className="summary-item04">
              <span>{item.name} x {item.quantity}</span>
              <span>₦{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-item04">
            <span>Subtotal:</span>
            <span>₦{orderDetails.subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-item04">
            <span>Delivery Fee:</span>
            <span>₦{orderDetails.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="total04">
            <span>Total:</span>
            <span>₦{orderDetails.totalPrice.toFixed(2)}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="payment-form04">
          <h2>Personal Information</h2>
          <div className="form-group04">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group04">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group04">
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group04">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group04">
            <label htmlFor="fullAddress">Full Address:</label>
            <textarea
              id="fullAddress"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group04">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <button type="submit" className="pay-now-btn04">Proceed to Payment</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;