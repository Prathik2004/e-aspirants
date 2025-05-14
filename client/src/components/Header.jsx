import React from 'react'
import Logo from '../assets/E-ASPIRANTS.png'
import './Header.css'
const Header = () => {
  return (
    <>
    <header>

    <div className="header-container">
        <div className="header-logo">
            <img src={Logo} alt="Logo" className="header-logo-img"
            width={400}
            height={100}/>
        </div>
        <div className="header-navbar">
            <ul className="header-navbar-list">
                <li className="header-navbar-item">Home</li>
                <li className="header-navbar-item">Buy</li>
                <li className="header-navbar-item">Sell/Donate</li>
                <li className="header-navbar-item">Contact</li>
            </ul>
        </div>
        <div className="header-cart">
            <img src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png" alt="Cart" className="header-cart-icon"
            color='white'
            width={30}
            height={30}/>
        </div>
        <div className="header-login">
            <button className="header-login-button">Login</button>
            <button className="header-signup-button">Sign Up</button>
        </div>
    </div>
    </header>
    </>
  )
}

export default Header