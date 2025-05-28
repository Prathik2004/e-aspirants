import React, { useEffect, useState, useRef } from 'react'
import Logo from '../assets/E-ASPIRANTS.png'
import './Header.css'
import { NavLink, useNavigate } from 'react-router-dom'

const Header = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    navigate('/auth');  // Redirect to login page after logout
  };

  return (
    <header>
      <div className="header-container">
        <div className="header-logo">
          <img src={Logo} alt="Logo" className="header-logo-img" width={400} height={100} />
        </div>

        <div className="header-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        <div className={`header-navbar ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="header-navbar-list">
            <NavLink to='/' className="header-navbar-item" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'white' }}>Home</NavLink>
            <NavLink to='/buy' className="header-navbar-item" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'white' }}>Buy</NavLink>
            <NavLink to='/sell' className="header-navbar-item" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'white' }}>Sell/Donate</NavLink>
            <NavLink to='/contact' className="header-navbar-item" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'white' }}>Contact</NavLink>
          </ul>
        </div>


        <div className="header-cart">
          <NavLink to='/cart' style={{ textDecoration: 'none', color: 'white' }}>
            <img src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png" alt="Cart" className="header-cart-icon" width={30} height={30} />
          </NavLink>
        </div>

        <div className="header-login" ref={dropdownRef} style={{ position: 'relative' }}>
          {user ? (
            <>
              <span
                style={{ color: 'white', marginRight: '10px', cursor: 'pointer' }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Hello, {user.name} &#x25BC;
              </span>
              {dropdownOpen && (
                <div className="header-dropdown">
                  <ul>
                    <li onClick={() => { navigate('/profile'); setDropdownOpen(false); }}>Profile</li>
                    <li onClick={() => { navigate('/profileorders'); setDropdownOpen(false); }}>Orders</li>
                    <li onClick={handleLogout}>Logout</li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <NavLink to='/auth'><button className="header-login-button">Login</button></NavLink>
              <NavLink to='/auth'><button className="header-signup-button">Sign Up</button></NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header;
