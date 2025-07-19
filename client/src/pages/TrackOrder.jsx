// pages/TrackOrder.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { FaBox, FaTruck, FaShippingFast, FaMapMarkedAlt, FaCheckCircle } from 'react-icons/fa';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import './TrackOrder.css';

const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`, {
        withCredentials: true,
      });
      setOrder(res.data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000); // ⏱ Poll every 10s
    return () => clearInterval(interval);
  }, [orderId]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found.</p>;

  const statusSteps = [
    { label: 'Pending', icon: <FaBox /> },
    { label: 'Shipped', icon: <FaTruck /> },
    { label: 'In Transit', icon: <FaShippingFast /> },
    { label: 'Out for Delivery', icon: <FaMapMarkedAlt /> },
    { label: 'Delivered', icon: <FaCheckCircle /> },
  ];

  const currentStep = statusSteps.findIndex(s => s.label === order.trackingStatus);
  const lat = parseFloat(order.deliveryCoordinates?.lat);
  const lng = parseFloat(order.deliveryCoordinates?.lng);
  const isValidCoordinates = !isNaN(lat) && !isNaN(lng);

  const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '12px'
  };

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
              <motion.div
                className={`step ${index <= currentStep ? 'active' : ''}`}
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="icon">{step.icon}</div>
                <p>{step.label}</p>
              </motion.div>
            ))}
          </div>

          {isLoaded && isValidCoordinates && (
            <div className="map-wrapper">
              <h3>Approximate Delivery Location</h3>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={{ lat, lng }}
                zoom={14}
              >
                <Marker position={{ lat, lng }} />
              </GoogleMap>
            </div>
          )}

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
