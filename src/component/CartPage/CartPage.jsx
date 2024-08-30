import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEcom } from "../../Context/EcomContext";
import { useAuth } from "../../Context/AuthContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, saveOrderDetails, getCartItemCount, fetchCart } = useEcom();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quantityColors, setQuantityColors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      await fetchCart();
      setIsLoading(false);
    };
    loadCart();
  }, [fetchCart]);

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

    saveOrderDetails(orderDetails);
    navigate('/checkout');
  };

  const handleRemoveFromCart = async (itemId, itemName) => {
    setIsLoading(true);
    await removeFromCart(itemId);
    setIsLoading(false);
  };

  const handleUpdateQuantity = async (itemId, change, itemName) => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  const getImageUrl = (item) => {
    if (!item.image) {
      return 'https://via.placeholder.com/150';
    }
    if (item.image.startsWith('http')) {
      return item.image;
    }
    return `${import.meta.env.VITE_API_URL}/uploads/${item.image}`;
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
            {cart.map((item) => (
              <div key={item.id} className="cart-item2">
                <img
                  src={getImageUrl(item)}
                  alt={item.name}
                  className="item-image2"
                  onError={(e) => {
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