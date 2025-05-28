import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Create Context
const CartContext = createContext();

// Hook to use cart context
export const useCart = () => useContext(CartContext);

// Provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null); // store user info including token

  // Load user and cart from localStorage on mount
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
      fetchCart(savedUser.token);
    }
  }, []);

  // Fetch cart from backend for logged in user
  const fetchCart = async (token) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.cart || []);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    }
  };

  // Save user and cart to backend and localStorage on cart change
  const updateCart = async (newCart) => {
    setCart(newCart);

    if (!user) return; // no user logged in

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/cart`, 
        { cart: newCart }, 
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // Update user locally and in localStorage
      const updatedUser = { ...user, cart: newCart };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to update cart', error);
    }
  };

  // Add an item to cart
  const addToCart = (item) => {
    const exists = cart.find(book => book._id === item._id);
    if (exists) {
      // If item already in cart, you might want to increase quantity here if you want
      return;
    }
    const newItem = {
      ...item,
      quantity: 1,
      image: item.image
    };
    updateCart([...cart, newItem]);  // <-- Use newItem here!
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    const filtered = cart.filter(book => book._id !== id);
    updateCart(filtered);
  };

  // Clear cart (e.g., on logout)
  const clearCart = () => {
    updateCart([]);
  };

  // Set user after login (so we can save cart per user)
  const setUserAndCart = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCart(userData.cart || []);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, user, setUserAndCart, updateCart }}>
      {children}
    </CartContext.Provider>
  );
};
