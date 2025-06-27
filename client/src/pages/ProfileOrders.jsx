import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
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

  return (
    <>
      <Header />
      <div className="order-history-container">
        <h2>Your Order History</h2>
        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p>No past orders found.</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order._id}>
              <h3>Order ID: {order._id}</h3>
              <p>Date: {new Date(order.orderedAt).toLocaleString()}</p>
              <p>Total: ₹{order.totalAmount}</p>
              <p>Payment: {order.paymentMethod}</p>
              <p>Address: {order.address}</p>
              <ul>
                {order.items.map((item) => (
                  <li key={item.productId}>
                    {item.productName} × {item.quantity} = ₹{item.productCost * item.quantity}
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
