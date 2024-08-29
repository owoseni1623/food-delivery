import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const EcomContext = createContext();

const apiUrl = import.meta.env.VITE_API_URL || 'https://food-delivery-api-rcff.onrender.com';

export const useEcom = () => useContext(EcomContext);

export const EcomProvider = ({ children }) => {
  const { user, isLoggedIn, token } = useAuth();
  const [ecoMode, setEcoMode] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const axiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const toggleEcoMode = () => setEcoMode(prevMode => !prevMode);

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) {
      console.log('No user, loading cart from localStorage');
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(localCart);
      return;
    }
    try {
      setLoading(true);
      console.log('Fetching cart data...');
      const response = await axiosInstance.get('/api/cart/get');
      console.log('Received cart data:', response.data);
      if (response.data.success) {
        setCart(response.data.cartData || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch cart data');
      }
    } catch (e) {
      console.error("Error fetching cart:", e);
      setError("Failed to fetch cart data. Please try again later.");
      toast.error("Failed to fetch cart data. Please try again later.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, axiosInstance]);

  const fetchMenuData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/menu/getAll');
      setMenuData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching menu data:", err);
      setError("Failed to fetch menu data. Please try again later.");
      toast.error("Failed to fetch menu data. Please try again later.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [axiosInstance]);

  useEffect(() => {
    fetchCart();
    fetchMenuData();
  }, [fetchCart, fetchMenuData]);

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

      if (isLoggedIn) {
        const response = await axiosInstance.post('/api/cart/add', {
          productId: itemToAdd.id,
          name: itemToAdd.name,
          price: itemToAdd.price,
          quantity: 1,
          image: itemToAdd.image,
        });

        if (response.data.success) {
          setCart(response.data.cartData);
          toast.success("Item added to cart", {
            position: "top-center",
            autoClose: 2000,
          });
        } else {
          throw new Error(response.data.message || 'Failed to add item to cart');
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
        toast.success("Item added to cart", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (e) {
      console.error("Error adding to cart:", e);
      setError(e.message);
      toast.error(e.message, {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      if (isLoggedIn) {
        const response = await axiosInstance.post('/api/cart/remove', { itemId });
        if (response.data.success) {
          setCart(response.data.cartData);
        } else {
          throw new Error(response.data.message || 'Failed to remove item from cart');
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCart = localCart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
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
      if (isLoggedIn) {
        const response = await axiosInstance.post('/api/cart/update', { itemId, change });
        if (response.data.success) {
          setCart(response.data.cartData);
        } else {
          throw new Error(response.data.message || 'Failed to update cart');
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCart = localCart.map(item => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        }).filter(Boolean);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
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

  const saveOrderDetails = (details) => {
    setOrderDetails(details);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const mergeCartsAfterLogin = async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      if (localCart.length > 0) {
        console.log('Merging carts...');
        const response = await axiosInstance.post('/api/cart/merge', { localCart });
        console.log('Merge cart response:', response);
        if (response.data.success) {
          setCart(response.data.cartData);
          localStorage.removeItem('cart');
          toast.success("Your cart has been updated with previously added items", {
            position: "top-center",
            autoClose: 3000,
          });
        } else {
          throw new Error(response.data.message || 'Failed to merge carts');
        }
      }
    } catch (e) {
      console.error("Error merging carts:", e);
      setError(e.message);
      toast.error("Failed to update your cart. Please try again later.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      mergeCartsAfterLogin();
    }
  }, [isLoggedIn]);

  return (
    <EcomContext.Provider
      value={{
        ecoMode,
        toggleEcoMode,
        menuData,
        error,
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartItemCount,
        orderDetails,
        saveOrderDetails,
        loading,
        clearCart,
        fetchMenuData,
        fetchCart,
      }}
    >
      {children}
    </EcomContext.Provider>
  );
};

export default EcomProvider;