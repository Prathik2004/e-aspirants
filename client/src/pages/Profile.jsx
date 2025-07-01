import React, { useEffect, useState } from 'react';
import './Profile.css';
import Header from '../components/Header';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    number: '',
    address: '',
    profilePhoto: ''
  });

  const [editing, setEditing] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);

  // Fetch profile from backend
  const fetchProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
        credentials: 'include'
      });
      const data = await res.json();
      setUser({
        name: data.name,
        email: data.email,
        number: data.number,
        address: data.address || '',
        profilePhoto: data.profilePhoto || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  // Input change handler
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Save profile changes
  const saveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('email', user.email);
      formData.append('number', user.number);
      formData.append('address', user.address);
      if (photoFile) {
        formData.append('profilePhoto', photoFile);
      }

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      const result = await res.json();
      if (res.ok) {
        alert('Profile updated successfully');
        setEditing(false);
        setUser(result.user); // Refresh the UI
        setPhotoFile(null);   // Reset file input
      } else {
        alert(result.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-card">
          <h2>My Profile</h2>

          {/* Profile Image */}
          {user.profilePhoto && (
            <img
              src={user.profilePhoto}
              alt="Profile"
              className="profile-img"
            />
          )}

          {/* Upload New Photo */}
          {editing && (
            <>
              <label>Change Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files[0])}
              />
            </>
          )}

          <label>Name</label>
          <input
            name="name"
            value={user.name}
            disabled={!editing}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            name="email"
            value={user.email}
            disabled={!editing}
            onChange={handleChange}
          />

          <label>Phone Number</label>
          <input
            name="number"
            value={user.number}
            disabled={!editing}
            onChange={handleChange}
          />

          <label>Address</label>
          <textarea
            name="address"
            value={user.address}
            disabled={!editing}
            onChange={handleChange}
          />

          {!editing ? (
            <button className="edit-btn" onClick={() => setEditing(true)}>
              Edit
            </button>
          ) : (
            <button className="save-btn" onClick={saveChanges}>
              Save Changes
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
