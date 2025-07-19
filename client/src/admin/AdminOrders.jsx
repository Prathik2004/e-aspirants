import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminOrder.css';

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('orderedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/all-orders`, {
        withCredentials: true
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Fetch orders error:', err);
    }
  };

  const filteredOrders = orders
    .filter((order) => {
      return (
        (!search || order._id.includes(search)) &&
        (!statusFilter || order.trackingStatus === statusFilter)
      );
    })
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (sortOrder === 'asc') return new Date(valA) - new Date(valB);
      else return new Date(valB) - new Date(valA);
    });

  return (
    <div className="admin-order-container">
      <h2>📦 Orders Management</h2>

      <div className="order-filters">
        <input
          type="text"
          placeholder="Search Order ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="In Transit">In Transit</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select onChange={(e) => setSortField(e.target.value)} value={sortField}>
          <option value="orderedAt">Date</option>
          <option value="totalAmount">Total</option>
        </select>
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </select>
      </div>

      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Status</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user?.name}</td>
              <td>{order.trackingStatus || 'Pending'}</td>
              <td>₹{order.totalAmount}</td>
              <td>{new Date(order.orderedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrder;