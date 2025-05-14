import React from 'react'
import { useEffect, useRef } from 'react'
import Header from '../components/Header'
import Defence from '../assets/Defence.png'
import './Home.css'
import Man from '../assets/man.png'
import Book from '../assets/book.png'
import Author from '../assets/writer.png'
import { NavLink } from 'react-router-dom'
const Home = () => {
  const imgRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (imgRef.current) {
        imgRef.current.style.transform = `translate(${scrollY * -0.2}px, ${scrollY * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Header />
      <div className="Home-container">
        <div className="Home-main">
          <img
            src={Defence}
            alt=""
            className="Home-main-img1"
            width={600}
            height={200}
            ref={imgRef}
          />
          <div className="Home-main-text">
            <h2>We live by chance, we love by choice, <br />we kill by profession.</h2>
            <h3> - Indian Army</h3>
          </div>
          <div className="Home-main-text2">
            <h3>
              Join the community of 1,00,000+ aspirants and get access to the best study material,<br />
              test series, and mentorship.
            </h3>
          </div>
          <div className="Home-main-images">
            <img src={Man} alt="Man" className='Home-main-man' width={40} height={40} />
            <p>10000+ people</p>
            <img src={Book} alt="Book" className='Home-main-man' width={40} height={40} />
            <p>1000+ books</p>
            <img src={Author} alt="Author" className='Home-main-man' width={40} height={40} />
            <p>100+ authors</p>
          </div>
          <div className="Home-main-button">
            <NavLink to='/buy'><button className='Home-main-button1'>Explore Books</button></NavLink>
            <button className='Home-main-button2'>Contact Us</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
