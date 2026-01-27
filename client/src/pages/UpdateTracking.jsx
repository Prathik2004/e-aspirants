import React, { useState } from 'react';
import axios from 'axios';
import './UpdateTracking.css';

const UpdateTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [form, setForm] = useState({
    trackingId: '',
    courierName: '',
    status: 'Pending',
    location: '',
    lat: '',
    lng: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!orderId) return setMessage('Order ID is required.');

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/update-tracking/${orderId}`, form, {
        withCredentials: true,
      });
      setMessage('✅ Tracking info updated');
    } catch (err) {
      setMessage('❌ Error updating tracking info !');
      console.error(err);
    }
  };

  return (
    <div className="update-tracking-container">
      <h2>Update Tracking Info</h2>
      <form onSubmit={handleSubmit} className="tracking-form">
        <label>Order ID:</label>
        <input type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Order ID" required />

        <label>Tracking ID:</label>
        <input type="text" name="trackingId" value={form.trackingId} onChange={handleChange} />

        <label>Courier Name:</label>
        <input type="text" name="courierName" value={form.courierName} onChange={handleChange} />

        <label>Status:</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="In Transit">In Transit</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <label>Location:</label>
        <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Delhi Hub" />

        <label>Latitude (optional):</label>
        <input type="number" step="0.0001" name="lat" value={form.lat} onChange={handleChange} />

        <label>Longitude (optional):</label>
        <input type="number" step="0.0001" name="lng" value={form.lng} onChange={handleChange} />

        <button type="submit">Update Tracking</button>
      </form>

      {message && <p className="status-message">{message}</p>}
    </div>
  );
};

export default UpdateTracking;
