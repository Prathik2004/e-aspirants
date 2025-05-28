import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import './Buy.css';

const Buy = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <>
      <Header />
      <div className="Buy-container">
        <div className="Buy-main">
          <h2>Buy Books</h2>
          <p>Explore our collection of books available for purchase.</p>

          <div className="book-list">
            {books.map(book => (
              <div className="book-card" key={book._id}>
                <img
                  src={`http://localhost:5000/${book.productPhoto}`}
                  alt={book.productName}
                  style={{ width: '200px', height: 'auto' }}
                />
                <h3>{book.productName || 'Untitled'}</h3>
                <p>{book.productDescription || 'No description available.'}</p>
                <p>Price: ₹{book.productCost || 'N/A'}</p>
                <button>Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Buy;
