import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EcomContext = createContext();

export const useEcom = () => useContext(EcomContext);

export const EcomProvider = ({ children }) => {
  const apiUrl = 'http://localhost:3000';
  const { user } = useAuth();
  const [ecoMode, setEcoMode] = useState(false);
  const [menuData, setMenuData] = useState(null);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleEcoMode = () => setEcoMode(prevMode => !prevMode);

  useEffect(() => {
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${apiUrl}/api/cart/get`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received cart data:', data);
      if (data.success) {
        setCart(data.cartData || []);
      } else {
        setError(data.message || 'Failed to fetch cart data');
      }
    } catch (e) {
      console.error("Error fetching cart:", e);
      setError("Failed to fetch cart data. Please try again later.");
    }
  };

  const addToCart = async (item) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in again.');
      }
  
      const phoneNumber = user?.phone || localStorage.getItem('userPhone');
  
      if (!phoneNumber) {
        throw new Error('User phone number is missing. Please update your profile.');
      }
  
      console.log('Sending request to add item:', item);
      console.log('User phone number:', phoneNumber);
  
      const itemToAdd = {
        ...item,
        image: item.image.startsWith('/') ? item.image : `/uploads/${item.image}`
      };
  
      const response = await fetch(`${apiUrl}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          itemId: itemToAdd.id, 
          item: itemToAdd,
          phone: phoneNumber,
          quantity: 1
        }),
      });
  
      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);
  
      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }
  
      if (responseData.success) {
        setCart(responseData.cartData);
        toast.success("Item added to cart", {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        throw new Error(responseData.message || 'Failed to add item to cart');
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
      const response = await fetch(`${apiUrl}/api/cart/remove`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
      setError("Failed to remove item from cart. Please try again later.");
    }
  };

  const updateQuantity = async (itemId, change) => {
    try {
      const method = change > 0 ? 'add' : 'remove';
      const response = await fetch(`${apiUrl}/api/cart/${method}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
      setError("Failed to update item quantity. Please try again later.");
    }
  };

  const getCartItemCount = () => cart.reduce((total, item) => total + item.quantity, 0);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/restaurants`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const allMenuItems = data.flatMap(restaurant => restaurant.menu || []);
        setMenuData(allMenuItems);
      } else {
        throw new Error('No menu data available');
      }
      setError(null);
    } catch (e) {
      console.error("Error fetching menu:", e);
      setError("Failed to fetch menu data. Please try again later.");
      setMenuData(null);
    } finally {
      setLoading(false);
    }
  };

  const saveOrderDetails = (details) => {
    setOrderDetails(details);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

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
      }}
    >
      {children}
    </EcomContext.Provider>
  );
};

export default EcomProvider;


// import React, { createContext, useState, useContext, useEffect } from "react";
// import { useAuth } from "./AuthContext";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const EcoContext = createContext();

// export const useEco = () => useContext(EcoContext);

// export const EcoProvider = ({ children }) => {
//   const apiUrl = 'http://localhost:3000';
//   const { user } = useAuth();
//   const [ecoMode, setEcoMode] = useState(false);
//   const [menuData, setMenuData] = useState(null);
//   const [error, setError] = useState(null);
//   const [cart, setCart] = useState([]);
//   const [orderDetails, setOrderDetails] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const toggleEcoMode = () => setEcoMode(prevMode => !prevMode);

//   useEffect(() => {
//     fetchCart();
//   }, [user]);

//   const fetchCart = async () => {
//     if (!user) return;
//     try {
//       const response = await fetch(`${apiUrl}/api/cart/get`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       if (data.success) {
//         setCart(data.cartData || []);
//       } else {
//         setError(data.message || 'Failed to fetch cart data');
//       }
//     } catch (e) {
//       console.error("Error fetching cart:", e);
//       setError("Failed to fetch cart data. Please try again later.");
//     }
//   };

//   const addToCart = async (item) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No token found, please log in again.');
//       }

//       const response = await fetch(`${apiUrl}/api/cart/add`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ itemId: item.id, item }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to add item to cart');
//       }

//       setCart(data.cartData);
//       toast.success("Item added to cart", {
//         position: "top-center",
//         autoClose: 2000,
//       });
//     } catch (e) {
//       console.error("Error adding to cart:", e);
//       setError("Failed to add item to cart. Please try again later.");
//     }
//   };

//   const removeFromCart = async (itemId) => {
//     try {
//       const response = await fetch(`${apiUrl}/api/cart/remove`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ itemId }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (data.success) {
//         setCart(data.cartData);
//         toast.error("Item removed from cart", {
//           position: "top-center",
//           autoClose: 2000,
//         });
//       } else {
//         throw new Error(data.message || 'Failed to remove item from cart');
//       }
//     } catch (e) {
//       console.error("Error removing from cart:", e);
//       setError("Failed to remove item from cart. Please try again later.");
//     }
//   };

//   const updateQuantity = async (itemId, change) => {
//     try {
//       const method = change > 0 ? 'add' : 'remove';
//       const response = await fetch(`${apiUrl}/api/cart/${method}`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ itemId }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (data.success) {
//         setCart(data.cartData);
//         toast.info("Cart updated", {
//           position: "top-center",
//           autoClose: 2000,
//         });
//       } else {
//         throw new Error(data.message || 'Failed to update cart');
//       }
//     } catch (e) {
//       console.error("Error updating quantity:", e);
//       setError("Failed to update item quantity. Please try again later.");
//     }
//   };


//   const getCartItemCount = () => cart.reduce((total, item) => total + item.quantity, 0);

//   const fetchMenu = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${apiUrl}/api/restaurants`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       if (Array.isArray(data) && data.length > 0) {
//         const allMenuItems = data.flatMap(restaurant => restaurant.menu || []);
//         setMenuData(allMenuItems);
//       } else {
//         throw new Error('No menu data available');
//       }
//       setError(null);
//     } catch (e) {
//       console.error("Error fetching menu:", e);
//       setError("Failed to fetch menu data. Please try again later.");
//       setMenuData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const saveOrderDetails = (details) => {
//     setOrderDetails(details);
//   };

//   useEffect(() => {
//     fetchMenu();
//   }, []);

//   return (
//     <EcoContext.Provider
//       value={{
//         ecoMode,
//         toggleEcoMode,
//         menuData,
//         error,
//         cart,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         getCartItemCount,
//         orderDetails,
//         saveOrderDetails,
//         loading,
//       }}
//     >
//       {children}
//     </EcoContext.Provider>
//   );
// };

// export default EcoProvider;