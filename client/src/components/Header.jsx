import React from 'react'
import Logo from '../assets/E-ASPIRANTS.png'
import './Header.css'
import { NavLink } from 'react-router-dom'
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
                <NavLink to='/' className="header-navbar-item" style={{ textDecoration: 'none', color: 'white' }}>Home</NavLink>
                <NavLink to='/buy' className="header-navbar-item" style={{ textDecoration: 'none', color: 'white' }}>Buy</NavLink>
                <NavLink to='/sell' className="header-navbar-item" style={{ textDecoration: 'none', color: 'white' }}>Sell/Donate</NavLink>
                <NavLink to='/contact' className="header-navbar-item" style={{ textDecoration: 'none', color: 'white' }}>Contact</NavLink>
            </ul>
        </div>
        <div className="header-cart">
            <img src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png" alt="Cart" className="header-cart-icon"
            color='white'
            width={30}
            height={30}/>
        </div>
        <div className="header-login">
            <NavLink to='/auth'><button className="header-login-button">Login</button></NavLink>
            <NavLink to='/auth'><button className="header-signup-button">Sign Up</button></NavLink>
        </div>
    </div>
    </header>
    </>
  )
}

export default Header