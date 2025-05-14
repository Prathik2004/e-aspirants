import React, { useState } from 'react';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="auth-container">
      <div className={`form-wrapper ${isLogin ? 'show-login' : 'show-signup'}`}>
        <div className="form login-form">
          <h2>Login</h2>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button className="auth-btn">Login</button>
          <p className="toggle-text">
            Don't have an account?{' '}
            <span onClick={toggleForm}>Sign Up</span>
          </p>
        </div>

        <div className="form signup-form">
          <h2>Sign Up</h2>
          <input type="text" placeholder="Full Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button className="auth-btn">Sign Up</button>
          <p className="toggle-text">
            Already have an account?{' '}
            <span onClick={toggleForm}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
