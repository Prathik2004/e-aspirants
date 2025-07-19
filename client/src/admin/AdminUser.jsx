import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminUser.css';

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
        withCredentials: true
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  const filteredUsers = users.filter(
    (user) => user.name.toLowerCase().includes(search.toLowerCase()) || user.email.includes(search)
  );

  return (
    <div className="admin-user-container">
      <h2>👥 User Management</h2>

      <div className="user-search">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.number}</td>
              <td>{user.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUser;