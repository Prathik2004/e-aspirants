import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import './ProfileOrders.css';

const ProfileOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/my-orders`, {
      withCredentials: true
    })
    .then((res) => {
      setOrders(res.data);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
  }, []);

  const getImageUrl = (photoPath) => {
    if (!photoPath) return 'https://via.placeholder.com/100x150?text=No+Image';
    return `${import.meta.env.VITE_BACKEND_URL}/${photoPath.replace(/\\/g, '/')}`;
  };

  return (
    <>
      <Header />
      <div className="order-history-container">
        <h2 className="order-history-title">Your Order History</h2>
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="empty-text">No past orders found.</p>
        ) : (
          orders.map((order) => (
            <div className="order-card-modern" key={order._id}>
              <div className="order-header">
                <div>
                  <h3>Order ID: <span>{order._id}</span></h3>
                  <p><strong>Date:</strong> {new Date(order.orderedAt).toLocaleString()}</p>
                  <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                  <p><strong>Payment:</strong> {order.paymentMethod}</p>
                  <p><strong>Address:</strong> {order.address}</p>
                </div>
              </div>
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.productId} className="order-item">
                    <img
                      src={getImageUrl(item.productPhoto)}
                      alt={item.productName}
                      className="item-photo"
                      onError={(e) => {
                        if (!e.target.dataset.fallback) {
                          e.target.src = 'https://via.placeholder.com/100x150?text=No+Image';
                          e.target.dataset.fallback = 'true';
                        }
                      }}
                    />
                    <div>
                      <p className="item-name">{item.productName}</p>
                      <p className="item-details">
                        Quantity: {item.quantity} <br />
                        Price: ₹{item.productCost} <br />
                        Total: ₹{item.productCost * item.quantity}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ProfileOrders;
