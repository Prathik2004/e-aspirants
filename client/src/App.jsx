import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Buy from './pages/Buy'
import Sell from './pages/Sell'
import Contact from './pages/Contact'
import './App.css'
import Auth from './pages/Auth'
import ProfileOrders from './pages/ProfileOrders'
import Profile from './pages/Profile'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
//import { SpeedInsights } from '@vercel/speed-insights/react';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy/" element={<Buy />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/profileorders' element={<ProfileOrders />} />
          <Route path='/checkout' element={<Checkout />} />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
