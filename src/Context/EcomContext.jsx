import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const EcomContext = createContext();

const apiUrl = import.meta.env.VITE_API_URL || 'https://food-delivery-api-rcff.onrender.com';

export const useEcom = () => useContext(EcomContext);

const sendAlert = (message, isDev) => {
  if (isDev) {
    console.log('DEV ALERT:', message);
  } else {
    console.log('PROD ALERT:', message);
  }
};

export const EcomProvider = ({ children }) => {
  const { user, isLoggedIn, authToken, axiosInstance } = useAuth();
  const [menuData, setMenuData] = useState([]);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) {
      console.log('No user, loading cart from localStorage');
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(localCart);
      return;
    }
    try {
      console.log('Fetching cart data...');
      const response = await axiosInstance.get(`${apiUrl}/api/cart/get`);
      console.log('Received cart data:', response.data);
      if (response.data.success) {
        const serverCart = response.data.cartData || [];
        setCart(serverCart);
        localStorage.setItem('cart', JSON.stringify(serverCart));
      } else {
        console.error('Failed to fetch cart data:', response.data.message);
        setError(response.data.message || 'Failed to fetch cart data');
      }
    } catch (e) {
      console.error("Error fetching cart:", e);
      setError("Failed to fetch cart data. Please try again later.");
    }
  }, [isLoggedIn, axiosInstance]);

  const fetchMenuData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${apiUrl}/api/menu/getAll`);
      setMenuData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching menu data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [axiosInstance]);

  useEffect(() => {
    fetchCart();
    fetchMenuData();
  }, [fetchCart, fetchMenuData]);

  useEffect(() => {
    if (isLoggedIn) {
      syncCartAfterLogin();
    }
  }, [isLoggedIn]);

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
        id: item.id,
        name: item.name,
        price: item.price,
        image: imagePath,
        quantity: 1
      };

      let updatedCart;
      if (isLoggedIn) {
        const response = await axiosInstance.post(`${apiUrl}/api/cart/add`, itemToAdd);

        if (response.data.success) {
          updatedCart = response.data.cartData;
        } else {
          throw new Error(response.data.message || 'Failed to add item to cart');
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = localCart.findIndex(cartItem => cartItem.id === itemToAdd.id);
        if (existingItemIndex !== -1) {
          localCart[existingItemIndex].quantity += 1;
        } else {
          localCart.push(itemToAdd);
        }
        updatedCart = localCart;
      }

      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      sendAlert(`Added to cart: ${itemToAdd.name}`, process.env.NODE_ENV === 'development');
      toast.success("Item added to cart", {
        position: "top-center",
        autoClose: 2000,
      });
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
      let updatedCart;
      if (isLoggedIn) {
        const response = await axiosInstance.post(`${apiUrl}/api/cart/remove`, { itemId });
        if (response.data.success) {
          updatedCart = response.data.cartData;
        } else {
          throw new Error(response.data.message || 'Failed to remove item from cart');
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        updatedCart = localCart.filter(item => item.id !== itemId);
      }

      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      toast.error("Item removed from cart", {
        position: "top-center",
        autoClose: 2000,
      });
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
      let updatedCart;
      if (isLoggedIn) {
        const response = await axiosInstance.post(`${apiUrl}/api/cart/update`, { itemId, change });
        if (response.data.success) {
          updatedCart = response.data.cartData;
        } else {
          throw new Error(response.data.message || 'Failed to update cart');
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        updatedCart = localCart.map(item => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        }).filter(Boolean);
      }

      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      toast.info("Cart updated", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (e) {
      console.error("Error updating quantity:", e);
      setError(e.message);
      toast.error(`Failed to update cart: ${e.message}`, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const getCartItemCount = () => cart.reduce((total, item) => total + item.quantity, 0);

  const saveOrderDetails = (details) => {
    setOrderDetails(details);
  };

  const clearCart = async () => {
    try {
      if (isLoggedIn) {
        await axiosInstance.post(`${apiUrl}/api/cart/clear`);
      }
      setCart([]);
      localStorage.removeItem('cart');
    } catch (e) {
      console.error("Error clearing cart:", e);
      setError("Failed to clear cart. Please try again.");
    }
  };

  const syncCartAfterLogin = async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      if (localCart.length > 0) {
        console.log('Syncing cart with server...');
        const response = await axiosInstance.post(`${apiUrl}/api/cart/merge`, { localCart });
        console.log('Server response:', response.data);
        if (response.data.success) {
          setCart(response.data.cartData);
          localStorage.setItem('cart', JSON.stringify(response.data.cartData));
          toast.success("Your cart has been synced with your account", {
            position: "top-center",
            autoClose: 3000,
          });
        } else {
          throw new Error(response.data.message || 'Failed to sync cart');
        }
      } else {
        console.log('Local cart is empty, fetching user cart from server...');
        await fetchCart();
      }
    } catch (e) {
      console.error("Error syncing cart:", e);
      setError(e.message);
      toast.error("Failed to sync your cart. Please try again later.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <EcomContext.Provider
      value={{
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
        syncCartAfterLogin,
      }}
    >
      {children}
    </EcomContext.Provider>
  );
};

export default EcomProvider;