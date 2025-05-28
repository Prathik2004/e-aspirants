import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Auth.css';
import Header from '../components/Header';

const Auth = () => {
  const { setUserAndCart } = useCart();
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => setIsLogin(!isLogin);
  const navigate = useNavigate();

  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', number: '' });

  // Handle input changes
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // Submit handlers
  const handleLoginSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Login successful!');
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        setUserAndCart({
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          token: result.token,
          cart: result.user.cart,
        });

        navigate('/'); // Redirect to home page
      }

      else {
        alert(result.message || 'Login failed!');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
  };


  const handleSignupSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Signup successful!');
        console.log(result);
        setIsLogin(true); // Switch to login form
      } else {
        alert(result.message || 'Signup failed!');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup.');
    }
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <div className={`form-wrapper ${isLogin ? 'show-login' : 'show-signup'}`}>

          {/* Login Form */}
          <div className="form login-form">
            <h2>Login</h2>
            <input type="email" name="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} />
            <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} />
            <button className="auth-btn" onClick={handleLoginSubmit}>Login</button>
            <p className="toggle-text">
              Don't have an account?{' '}
              <span onClick={toggleForm}>Sign Up</span>
            </p>
          </div>

          {/* Signup Form */}
          <div className="form signup-form">
            <h2>Sign Up</h2>
            <input type="text" name="name" placeholder="Full Name" value={signupData.name} onChange={handleSignupChange} />
            <input type="email" name="email" placeholder="Email" value={signupData.email} onChange={handleSignupChange} />
            <input type="password" name="password" placeholder="Password" value={signupData.password} onChange={handleSignupChange} />
            <input type="number" name="number" placeholder="Contact number" value={signupData.number} onChange={handleSignupChange} />
            <button className="auth-btn" onClick={handleSignupSubmit}>Sign Up</button>
            <p className="toggle-text">
              Already have an account?{' '}
              <span onClick={toggleForm}>Login</span>
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default Auth;
