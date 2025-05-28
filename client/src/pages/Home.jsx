import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Defence from '../assets/Defence.png';
import Man from '../assets/man.png';
import Book from '../assets/book.png';
import Author from '../assets/writer.png';
import { NavLink } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const imgRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (imgRef.current) {
        imgRef.current.style.transform = `translate(${scrollY * -0.15}px, ${scrollY * 0.25}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Header />
      <section className="home-container" role="main" aria-label="Homepage">
        {/* 3D floating background shape */}
        <div className="floating-shape" aria-hidden="true"></div>

        <motion.div
          className="slide"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="slide-content">
            <motion.img
              src={Defence}
              alt="Defence themed background"
              className="slide-img"
              ref={imgRef}
              initial={{ opacity: 0.7, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            />

            <div className="text-wrapper">
              <h2 className="slide-heading">
                We live by <span>chance</span>, we love by <span>choice</span>,<br />
                we kill by <span>profession</span>.
              </h2>
              <h3 className="slide-subheading">- Indian Army</h3>

              <p className="slide-description">
                Join the community of 1,00,000+ aspirants and get access to the best study material, test series, and mentorship.
              </p>

              <div className="slide-stats">
                <div className="stat-item">
                  <img src={Man} alt="" aria-hidden="true" />
                  <span>10000+ people</span>
                </div>
                <div className="stat-item">
                  <img src={Book} alt="" aria-hidden="true" />
                  <span>1000+ books</span>
                </div>
                <div className="stat-item">
                  <img src={Author} alt="" aria-hidden="true" />
                  <span>100+ authors</span>
                </div>
              </div>

              <div className="slide-buttons">
                <NavLink to="/buy">
                  <button className="btn-primary">Explore Books</button>
                </NavLink>
                <button className="btn-secondary">Contact Us</button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Home;
