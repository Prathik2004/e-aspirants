// pages/TrackOrder.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import './TrackOrder.css'; // 👈 Create this CSS file

const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`, {
      withCredentials: true,
    })
      .then(res => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found.</p>;

  const statusSteps = [
    'Pending',
    'Shipped',
    'In Transit',
    'Out for Delivery',
    'Delivered'
  ];

  const currentStep = statusSteps.indexOf(order.trackingStatus);

  return (
    <>
      <Header />
      <div className="track-container">
        <div className="track-card">
          <h2 className="track-title">Tracking Order</h2>
          <p className="order-id">Order ID: {order._id}</p>

          <div className="shipment-info">
            <p><strong>Courier:</strong> {order.courierName || 'N/A'}</p>
            <p><strong>Tracking ID:</strong> {order.trackingId || 'N/A'}</p>
            <p><strong>Current Status:</strong> {order.trackingStatus}</p>
          </div>

          <div className="progress-tracker">
            {statusSteps.map((step, index) => (
              <div className={`step ${index <= currentStep ? 'active' : ''}`} key={step}>
                <div className="circle">{index + 1}</div>
                <p>{step}</p>
              </div>
            ))}
          </div>

          <h3 className="history-title">Tracking History</h3>
          <ul className="history-list">
            {order.trackingHistory?.length > 0 ? (
              order.trackingHistory.map((entry, idx) => (
                <li key={idx}>
                  <strong>{entry.status}</strong> - {entry.location} <br />
                  <span>{new Date(entry.timestamp).toLocaleString()}</span>
                </li>
              ))
            ) : (
              <li>No tracking updates yet.</li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default TrackOrder;
