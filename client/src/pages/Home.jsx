import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import Defence from '../assets/Defence.png';
import './Home.css';
import Man from '../assets/man.png';
import Book from '../assets/book.png';
import Author from '../assets/writer.png';
import { NavLink } from 'react-router-dom';

const Home = () => {
  const imgRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0); // slide index

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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % 3); // 2 slides
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + 3 ) % 3);

  return (
    <>
      <Header />
      <div className="Home-container">
        <div className="arrow left-arrow" onClick={prevSlide}>&lt;</div>
        <div className="arrow right-arrow" onClick={nextSlide}>&gt;</div>

        <div className="slider" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>

          {/* Slide 1 */}
          <div className="Home-main slide">
            <img src={Defence} alt="" className="Home-main-img1" width={600} height={200} ref={imgRef} />
            <div className="Home-main-text">
            
              <h2>We live by <span>chance</span>, we love by <span>choice</span>, <br />we kill by <span>profession</span>.</h2>
              <h3> - Indian Army</h3>
            </div>
            <div className="Home-main-text2">
              <h3>Join the community of 1,00,000+ aspirants and get access to the best study material,<br />
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

          {/* Slide 2 — same structure for now */}
          <div className="Home-main slide">
            <img src={Defence} alt="" className="Home-main-img1" width={600} height={200} />
            <div className="Home-main-text">
              <h2>Another Slide Title</h2>
              <h3>- New Quote</h3>
            </div>
            <div className="Home-main-text2">
              <h3>This is the second screen. You can customize this text and photo later.</h3>
            </div>
            <div className="Home-main-images">
              <img src={Man} alt="Man" className='Home-main-man' width={40} height={40} />
              <p>New Stat</p>
              <img src={Book} alt="Book" className='Home-main-man' width={40} height={40} />
              <p>More Books</p>
              <img src={Author} alt="Author" className='Home-main-man' width={40} height={40} />
              <p>Authors</p>
            </div>
            <div className="Home-main-button">
              <NavLink to='/buy'><button className='Home-main-button1'>Explore Books</button></NavLink>
              <button className='Home-main-button2'>Contact Us</button>
            </div>
          </div>

          {/* Slide 3 — same structure for now */}
          <div className="Home-main slide">
            <img src={Defence} alt="" className="Home-main-img1" width={600} height={200} />
            <div className="Home-main-text">
              <h2>Another Slide Title</h2>
              <h3>- New Quote</h3>
            </div>
            <div className="Home-main-text2">
              <h3>This is the second screen. You can customize this text and photo later.</h3>
            </div>
            <div className="Home-main-images">
              <img src={Man} alt="Man" className='Home-main-man' width={40} height={40} />
              <p>New Stat</p>
              <img src={Book} alt="Book" className='Home-main-man' width={40} height={40} />
              <p>More Books</p>
              <img src={Author} alt="Author" className='Home-main-man' width={40} height={40} />
              <p>Authors</p>
            </div>
            <div className="Home-main-button">
              <NavLink to='/buy'><button className='Home-main-button1'>Explore Books</button></NavLink>
              <button className='Home-main-button2'>Contact Us</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
