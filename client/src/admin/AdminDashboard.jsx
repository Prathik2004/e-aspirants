import React from 'react';
import AdminSidebar from './AdminSidebar';
import './AdminDashboard.css';

const AdminDashboard = ({ admin, onLogout }) => {
  return (
    <div className="admin-dashboard-wrapper">
      <AdminSidebar admin={admin} onLogout={onLogout} />
      <main className="admin-dashboard-main">
        <h1>📊 Admin Dashboard</h1>
        <p>Welcome back, {admin?.name || 'Admin'}! Here's your summary:</p>

        <div className="admin-cards">
          <div className="admin-card">
            <h3>Orders</h3>
            <p>View and manage customer orders</p>
          </div>
          <div className="admin-card">
            <h3>Users</h3>
            <p>Manage registered users</p>
          </div>
          <div className="admin-card">
            <h3>Products</h3>
            <p>Control product listings</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;