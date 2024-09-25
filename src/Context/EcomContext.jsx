import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from "react";
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
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) {
      console.log('No user, loading cart from localStorage');
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      if (isMounted.current) setCart(localCart);
      return;
    }
    try {
      console.log('Fetching cart data...');
      const response = await axiosInstance.get(`${apiUrl}/api/cart/get`);
      console.log('Received cart data:', response.data);
      if (response.data.success && isMounted.current) {
        const serverCart = response.data.cartData || [];
        setCart(serverCart);
      } else {
        console.error('Failed to fetch cart data:', response.data.message);
        if (isMounted.current) setError(response.data.message || 'Failed to fetch cart data');
      }
    } catch (e) {
      console.error("Error fetching cart:", e);
      if (isMounted.current) setError("Failed to fetch cart data. Please try again later.");
    }
  }, [isLoggedIn, axiosInstance]);

  const fetchMenuData = useCallback(async () => {
    try {
      if (isMounted.current) setLoading(true);
      const response = await axiosInstance.get(`${apiUrl}/api/menu/getAll`);
      if (isMounted.current) {
        setMenuData(response.data);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching menu data:", err);
      if (isMounted.current) setError(err.message);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [axiosInstance]);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  useEffect(() => {
    if (isLoggedIn) {
      syncCartAfterLogin();
    } else {
      fetchCart();
    }
  }, [isLoggedIn, fetchCart]);

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
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }

      if (isMounted.current) setCart(updatedCart);
      sendAlert(`Added to cart: ${itemToAdd.name}`, process.env.NODE_ENV === 'development');
      toast.success("Item added to cart", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (e) {
      console.error("Error adding to cart:", e);
      if (isMounted.current) setError(e.message);
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
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }

      if (isMounted.current) setCart(updatedCart);
      toast.error("Item removed from cart", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (e) {
      console.error("Error removing from cart:", e);
      if (isMounted.current) setError(e.message);
      toast.error(e.message, {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const updateQuantity = (itemId, change) => {
    const updatedCart = cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean);

    setCart(updatedCart);

    if (isLoggedIn) {
      axiosInstance.post(`${apiUrl}/api/cart/update`, { itemId, change })
        .catch(error => {
          console.error("Error updating cart on server:", error);
          toast.error("Failed to sync cart with server. Please try again.", {
            position: "top-center",
            autoClose: 3000,
          });
        });
    } else {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }

    toast.info("Cart updated", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  const getCartItemCount = () => cart.reduce((total, item) => total + item.quantity, 0);

  const saveOrderDetails = (details) => {
    if (isMounted.current) setOrderDetails(details);
  };

  const clearCart = async () => {
    try {
      if (isLoggedIn) {
        await axiosInstance.post(`${apiUrl}/api/cart/clear`);
      }
      if (isMounted.current) setCart([]);
      localStorage.setItem('cart', JSON.stringify([]));
    } catch (e) {
      console.error("Error clearing cart:", e);
      if (isMounted.current) setError("Failed to clear cart. Please try again.");
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
          if (isMounted.current) setCart(response.data.cartData);
          localStorage.setItem('cart', JSON.stringify([]));
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
    } catch (error) {
      console.error("Error syncing cart:", error);
      if (error.response && error.response.status === 404) {
        console.error("Cart merge endpoint not found. Please check your backend routes.");
      }
      console.log("Falling back to local cart due to sync error");
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      if (isMounted.current) setCart(localCart);
    }
  };

  const viewDatabaseCart = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to view your cart data", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axiosInstance.get(`${apiUrl}/api/cart/get`);
      if (response.data.success) {
        console.log("Cart data in database:", response.data.cartData);
        toast.info("Cart data logged in console", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch cart data');
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      toast.error("Failed to fetch cart data. Please try again.", {
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
        viewDatabaseCart,
      }}
    >
      {children}
    </EcomContext.Provider>
  );
};

export default EcomProvider;