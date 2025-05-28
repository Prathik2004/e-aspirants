import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateCart } = useCart();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const decreaseQuantity = (item) => {
    const updatedCart = cart.map((book) =>
      book._id === item._id && book.quantity > 1
        ? { ...book, quantity: book.quantity - 1 }
        : book
    );
    updateCart(updatedCart);
  };

  const increaseQuantity = (item) => {
    const updatedCart = cart.map((book) =>
      book._id === item._id ? { ...book, quantity: (book.quantity || 1) + 1 } : book
    );
    updateCart(updatedCart);
  };

  const deleteItem = (id) => {
    removeFromCart(id);
    toast.info('Item removed from cart.');
  };

  const subtotal = cart.reduce(
    (total, item) => total + (item.productCost || 0) * (item.quantity || 1),
    0
  );

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (code === 'SAVE100' && subtotal > 500) {
      setDiscount(100);
      toast.success('Coupon applied! ₹100 discount added.');
    } else if (code === '') {
      toast.warning('Please enter a coupon code.');
    } else {
      setDiscount(0);
      toast.error('Invalid coupon or conditions not met.');
    }
  };

  const total = subtotal - discount;

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <main className="cart-container">
        <section className="cart-wrapper">
          <h2 className="cart-title">🛒 Your Cart</h2>

          {cart.length === 0 ? (
            <p className="empty-cart">No items in cart.</p>
          ) : (
            <>
              <ul className="cart-items-list">
                {cart.map((item) => (
                  <li className="cart-item" key={item._id}>
                    <div className="cart-item-info">
                      <img
                        src={`http://localhost:5000/${item.productPhoto}`}
                        alt={item.productName}
                        className="cart-item-img"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x150?text=No+Image';
                        }}
                      />
                      <div className="cart-item-details">
                        <h3>{item.productName}</h3>
                        <p className="author">by {item.author}</p>
                        <p className="price">
                          ₹{item.productCost} × {item.quantity || 1}
                        </p>
                      </div>
                    </div>

                    <div className="cart-actions">
                      <button
                        className="qty-btn"
                        aria-label={`Decrease quantity of ${item.productName}`}
                        onClick={() => decreaseQuantity(item)}
                      >
                        −
                      </button>
                      <span className="qty-display">{item.quantity || 1}</span>
                      <button
                        className="qty-btn"
                        aria-label={`Increase quantity of ${item.productName}`}
                        onClick={() => increaseQuantity(item)}
                      >
                        +
                      </button>
                      <button
                        className="delete-btn"
                        aria-label={`Remove ${item.productName} from cart`}
                        onClick={() => deleteItem(item._id)}
                      >
                        ❌
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="coupon-wrapper">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="coupon-input"
                />
                <button onClick={applyCoupon} className="apply-btn">
                  Apply
                </button>
              </div>

              <div className="cart-summary">
                <p className="summary-item">
                  Subtotal: <span>₹{subtotal}</span>
                </p>
                <p className="summary-item discount">
                  Discount: <span>−₹{discount}</span>
                </p>
                <h3 className="summary-total">
                  Total: <span>₹{total}</span>
                </h3>
                <button
                  className="checkout-btn"
                  onClick={() => navigate('/checkout')}
                >
                  Checkout Now
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
};

export default Cart;
