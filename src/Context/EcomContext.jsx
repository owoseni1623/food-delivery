import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EcomContext = createContext();

export const useEcom = () => useContext(EcomContext);

const sendAlert = (message, isDev) => {
  if (isDev) {
    console.log('DEV ALERT:', message);
  } else {
    console.log('PROD ALERT:', message);
  }
};

export const EcomProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const { user } = useAuth();
  const [ecoMode, setEcoMode] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleEcoMode = () => setEcoMode(prevMode => !prevMode);

  useEffect(() => {
    fetchCart();
    fetchMenuData();
  }, [user]);

  const getHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  const fetchCart = async () => {
    if (!user) {
      console.log('No user, skipping cart fetch');
      setCart([]);
      return;
    }
    try {
      console.log('Fetching cart data...');
      const response = await fetch(`${apiUrl}/api/cart/get`, {
        headers: getHeaders(),
      });
      if (response.status === 401) {
        console.log('Unauthorized access, clearing cart');
        setCart([]);
        return;
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received cart data:', data);
      if (data.success) {
        setCart(data.cartData || []);
      } else {
        console.error('Failed to fetch cart data:', data.message);
        setError(data.message || 'Failed to fetch cart data');
      }
    } catch (e) {
      console.error("Error fetching cart:", e);
      setError("Failed to fetch cart data. Please try again later.");
    }
  };

  const addToCart = async (item) => {
    try {
      let imagePath = item.image;
      if (imagePath) {
        if (!imagePath.startsWith('http') && !imagePath.startsWith('/')) {
          imagePath = `/uploads/${imagePath}`;
        }
      } else {
        imagePath = 'https://via.placeholder.com/300x300';
      }
  
      const itemToAdd = {
        ...item,
        image: imagePath,
      };
  
      if (user) {
        const response = await fetch(`${apiUrl}/api/cart/add`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            productId: itemToAdd.id,
            name: itemToAdd.name,
            price: itemToAdd.price,
            quantity: 1,
            image: itemToAdd.image,
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
  
        const responseData = await response.json();
  
        if (responseData.success) {
          setCart(responseData.cartData);
          sendAlert(`Added to cart: ${itemToAdd.name}`, process.env.NODE_ENV === 'development');
          toast.success("Item added to cart", {
            position: "top-center",
            autoClose: 2000,
          });
        } else {
          throw new Error(responseData.message || 'Failed to add item to cart');
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = localCart.find(cartItem => cartItem.id === itemToAdd.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          localCart.push({ ...itemToAdd, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(localCart));
        setCart(localCart);
        sendAlert(`Added to cart: ${itemToAdd.name}`, process.env.NODE_ENV === 'development');
        toast.success("Item added to cart", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (e) {
      console.error("Error adding to cart:", e);
      setError(e.message);
      sendAlert(`Error adding to cart: ${e.message}`, process.env.NODE_ENV === 'development');
      toast.error(e.message, {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await fetch(`${apiUrl}/api/cart/remove`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ itemId }),
      });

      if (response.status === 401) {
        throw new Error("Please log in to remove items from your cart.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setCart(data.cartData);
        toast.error("Item removed from cart", {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        throw new Error(data.message || 'Failed to remove item from cart');
      }
    } catch (e) {
      console.error("Error removing from cart:", e);
      setError(e.message);
      toast.error(e.message, {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const updateQuantity = async (itemId, change) => {
    try {
      const response = await fetch(`${apiUrl}/api/cart/update`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ itemId, change }),
      });

      if (response.status === 401) {
        throw new Error("Please log in to update your cart.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setCart(data.cartData);
        toast.info("Cart updated", {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        throw new Error(data.message || 'Failed to update cart');
      }
    } catch (e) {
      console.error("Error updating quantity:", e);
      setError(e.message);
      toast.error(e.message, {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const getCartItemCount = () => cart.reduce((total, item) => total + item.quantity, 0);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/menu/getAll`, {
        headers: getHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMenuData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching menu data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveOrderDetails = (details) => {
    setOrderDetails(details);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <EcomContext.Provider
      value={{
        ecoMode,
        toggleEcoMode,
        menuData,
        error,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartItemCount,
        orderDetails,
        saveOrderDetails,
        loading,
        clearCart,
        fetchMenuData,
      }}
    >
      {children}
    </EcomContext.Provider>
  );
};

export default EcomProvider;