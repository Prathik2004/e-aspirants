import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Header from './Header';
import './Checkout.css';

const Checkout = () => {
  const { cart } = useCart();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const subtotal = cart.reduce(
    (total, item) => total + (item.productCost || 0) * (item.quantity || 1),
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for your order, ${name}! Your order total is ₹${subtotal}.`);
    // You can replace alert with better UX or actual order submission logic
  };

  return (
    <>
      <Header />
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
                    {item.productName} × {item.quantity || 1} = ₹{item.productCost * (item.quantity || 1)}
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

              <button type="submit" className="place-order-btn">Place Order</button>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default Checkout;
