import React, { useState } from 'react';
import './Contact.css';
import axios from 'axios';
import Header from '../components/Header';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  return (
    <>
    <Header />
    <div className="contact-page">
      <div className="contact-container">
        <h2 className="contact-title">Contact Us</h2>
        {success && <p className="success-msg">Message sent successfully!</p>}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div>
            <label className="contact-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="contact-input"
              required
              />
          </div>
          <div>
            <label className="contact-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="contact-input"
              required
              />
          </div>
          <div>
            <label className="contact-label">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              placeholder="Your message"
              className="contact-textarea"
              required
              ></textarea>
          </div>
          <button type="submit" className="contact-button">Send Message</button>
        </form>
      </div>
    </div>
  </>
  );
};

export default Contact;
