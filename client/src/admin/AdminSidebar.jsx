import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBoxOpen, FaUsers, FaBook, FaSignOutAlt } from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = ({ admin, onLogout }) => {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-logo">📚 AdminPanel</h2>
      <p className="admin-name">Welcome, {admin?.name || 'Admin'}</p>
      <nav>
        <ul>
          <li><NavLink to="/admin/orders"><FaBoxOpen /> Orders</NavLink></li>
          <li><NavLink to="/admin/users"><FaUsers /> Users</NavLink></li>
          <li><NavLink to="/admin/products"><FaBook /> Products</NavLink></li>
          <li><button onClick={onLogout}><FaSignOutAlt /> Logout</button></li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;