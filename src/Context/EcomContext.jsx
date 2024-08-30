import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const EcomContext = createContext();

const apiUrl = import.meta.env.VITE_API_URL || 'https://food-delivery-api-rcff.onrender.com';

export const useEcom = () => useContext(EcomContext);

export const EcomProvider = ({ children }) => {
  const { user, isLoggedIn, authToken, axiosInstance } = useAuth();
  const [cart, setCart] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    if (!isLoggedIn) {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(localCart);
      setLoading(false);
      return;
    }
    try {
      const response = await axiosInstance.get(`${apiUrl}/api/cart/get`);
      if (response.data.success) {
        setCart(response.data.cartData || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch cart data');
      }
    } catch (e) {
      console.error("Error fetching cart:", e);
      toast.error("Failed to fetch cart data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, axiosInstance]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (isLoggedIn) {
      mergeCartsAfterLogin();
    }
  }, [isLoggedIn]);

  const addToCart = async (item) => {
    try {
      let imagePath = item.image;
      if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('/')) {
        imagePath = `/uploads/${imagePath}`;
      } else if (!imagePath) {
        imagePath = 'https://via.placeholder.com/300x300';
      }

      const itemToAdd = {
        ...item,
        image: imagePath,
      };

      if (isLoggedIn) {
        const response = await axiosInstance.post(`${apiUrl}/api/cart/add`, {
          productId: itemToAdd.id,
          name: itemToAdd.name,
          price: itemToAdd.price,
          quantity: 1,
          image: itemToAdd.image,
        });

        if (response.data.success) {
          setCart(response.data.cartData);
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
      }
      toast.success("Item added to cart", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (e) {
      console.error("Error adding to cart:", e);
      toast.error(e.message, {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      if (isLoggedIn) {
        const response = await axiosInstance.post(`${apiUrl}/api/cart/remove`, { itemId });
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
      toast.error("Item removed from cart", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (e) {
      console.error("Error removing from cart:", e);
      toast.error(e.message, {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const updateQuantity = async (itemId, change) => {
    try {
      if (isLoggedIn) {
        const response = await axiosInstance.post(`${apiUrl}/api/cart/update`, { itemId, change });
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
      toast.info("Cart updated", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (e) {
      console.error("Error updating quantity:", e);
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
        const response = await axiosInstance.post(`${apiUrl}/api/users/merge-cart`, { localCart });
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
      } else {
        // If local cart is empty, fetch the server cart
        await fetchCart();
      }
    } catch (e) {
      console.error("Error merging carts:", e);
      toast.error("Failed to update your cart. Please try again later.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <EcomContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartItemCount,
        mergeCartsAfterLogin,
        orderDetails,
        saveOrderDetails,
        loading,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </EcomContext.Provider>
  );
};

export default EcomProvider;