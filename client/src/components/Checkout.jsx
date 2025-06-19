import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Header from './Header';
import './Checkout.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Checkout = () => {
  const { cart, updateCart } = useCart();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce(
    (total, item) => total + (item.productCost || 0) * (item.quantity || 1),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !address) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/place-order`,
        {
          address,
          paymentMethod,
          cart,
        },
        {
          withCredentials: true, // ✅ Sends cookie with request
        }
      );

      toast.success(`Order placed! Total ₹${response.data.order.totalAmount}`);
      setName('');
      setAddress('');
      setPaymentMethod('card');
      updateCart([]); // Clear cart after order

    } catch (error) {
      console.error('Place order error:', error);
      if (error.response?.status === 401) {
        toast.error('Unauthorized. Please log in again.');
      } else {
        toast.error('Failed to place order');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="checkout-container">
        <h2>Checkout</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="order-summary">
              <h3>Order Summary</h3>
              {cart.map((item) => (
                <div key={item._id} className="summary-item">
                  <p>
                    {item.productName} × {item.quantity || 1} = ₹
                    {item.productCost * (item.quantity || 1)}
                  </p>
                </div>
              ))}
              <p className="subtotal">Subtotal: ₹{subtotal}</p>
            </div>

            <form className="checkout-form" onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              <label>
                Address:
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </label>

              <label>
                Payment Method:
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </label>

              <button type="submit" className="place-order-btn" disabled={loading}>
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default Checkout;
