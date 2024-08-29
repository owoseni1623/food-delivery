import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEcom } from "../../Context/EcomContext";
import { useAuth } from "../../Context/AuthContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./CartPage.css";
import axios from 'axios';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, saveOrderDetails, getCartItemCount, setCart } = useEcom();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [quantityColors, setQuantityColors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "https://food-delivery-api-rcff.onrender.com";

  useEffect(() => {
    const fetchCartData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (user && token) {
          await mergeCartWithServer();
        } else {
          const localCart = JSON.parse(localStorage.getItem('cart')) || [];
          setCart(localCart);
        }
      } catch (err) {
        console.error("Error fetching cart data:", err);
        setError("Failed to load cart data. Please try again later.");
        toast.error("Failed to load cart data. Please try again later.", {
          position: "top-center",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, [user, token, setCart]);

  const mergeCartWithServer = async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      const response = await axios.post(
        `${apiUrl}/api/cart/merge`,
        { localCart },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCart(response.data.cartData);
        localStorage.removeItem('cart');
        toast.success("Cart updated successfully", {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        throw new Error(response.data.message || "Failed to merge cart");
      }
    } catch (error) {
      console.error("Error merging cart:", error);
      throw error;
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 300;
  const grandTotal = totalPrice + deliveryFee;

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      toast.warning("Your cart is empty. Please add items to your cart before proceeding to checkout.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!user) {
      toast.warning("Please log in or sign up to proceed to checkout.", {
        position: "top-center",
        autoClose: 3000,
      });
      navigate('/login');
      return;
    }

    const orderDetails = {
      items: cart,
      subtotal: totalPrice,
      deliveryFee: deliveryFee,
      totalPrice: grandTotal,
    };

    console.log("Proceeding to checkout with order details:", orderDetails);
    saveOrderDetails(orderDetails);
    navigate('/checkout');
  };

  const handleRemoveFromCart = async (itemId, itemName) => {
    try {
      await removeFromCart(itemId);
      toast.error(`${itemName} removed from cart`, {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleUpdateQuantity = async (itemId, change, itemName) => {
    try {
      await updateQuantity(itemId, change);
      setQuantityColors(prev => ({
        ...prev,
        [itemId]: change > 0 ? 'green' : 'red'
      }));
      setTimeout(() => {
        setQuantityColors(prev => ({
          ...prev,
          [itemId]: ''
        }));
      }, 500);

      toast.info(`${itemName} ${change > 0 ? 'added to' : 'removed from'} cart`, {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const getImageUrl = (item) => {
    if (!item.image) {
      return 'https://via.placeholder.com/150';
    }

    if (item.image.startsWith('http')) {
      return item.image;
    }

    const imagePath = item.image.includes('/uploads/') ? item.image.split('/uploads/').pop() : item.image;
    return `${apiUrl}/uploads/${imagePath}`;
  };

  if (isLoading) {
    return <div className="loading">Loading your cart...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="cart-page2">
      <h1 className="cart-title2">Your Cart ({getCartItemCount()} items)</h1>
      {cart.length === 0 ? (
        <div className="empty-cart2">
          <p>Your cart is empty.</p>
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      ) : (
        <>
          <div className="cart-items2">
            {cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="cart-item2">
                <img
                  src={getImageUrl(item)}
                  alt={item.name}
                  className="item-image2"
                  onError={(e) => {
                    console.log("Image failed to load, using placeholder");
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
                <div className="item-details2">
                  <h3 className="item-name2">{item.name}</h3>
                  <p className="item-price2">₦{item.price}</p>
                  <p className="item-total2">Total: ₦{(item.price * item.quantity).toFixed(2)}</p>
                  <div className="quantity-control2">
                    <button onClick={() => handleUpdateQuantity(item.id, -1, item.name)}>-</button>
                    <span style={{ color: quantityColors[item.id] || 'inherit' }}>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.id, 1, item.name)}>+</button>
                  </div>
                  <button className="remove-btn2" onClick={() => handleRemoveFromCart(item.id, item.name)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary2">
            <h3>Order Summary</h3>
            <div className="summary-row2">
              <span>Subtotal:</span>
              <span>₦{totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row2">
              <span>Delivery Fee:</span>
              <span>₦{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="summary-row total2">
              <span>Total:</span>
              <span>₦{grandTotal.toFixed(2)}</span>
            </div>
            <button className="checkout-btn2" onClick={proceedToCheckout}>
              {user ? "Proceed to Checkout" : "Login to Checkout"}
            </button>
            <button className="continue-shopping2" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default CartPage;