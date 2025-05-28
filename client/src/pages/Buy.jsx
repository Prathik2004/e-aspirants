import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import './Buy.css';

const Buy = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  const [sortOption, setSortOption] = useState('relevance');
  const [costFilter, setCostFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books');
        setBooks(response.data);
        setFilteredBooks(response.data); // default view
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    let filtered = [...books];

    // Apply cost filter
    if (costFilter) {
      if (costFilter === '0-300') filtered = filtered.filter(b => b.productCost <= 300);
      else if (costFilter === '300-500') filtered = filtered.filter(b => b.productCost > 300 && b.productCost <= 500);
      else if (costFilter === '500+') filtered = filtered.filter(b => b.productCost > 500);
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(b =>
        b.productCategory.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Apply sort
    if (sortOption === 'low-to-high') {
      filtered.sort((a, b) => a.productCost - b.productCost);
    } else if (sortOption === 'high-to-low') {
      filtered.sort((a, b) => b.productCost - a.productCost);
    }

    setFilteredBooks(filtered);
  }, [books, sortOption, costFilter, categoryFilter]);

  return (
    <>
      <Header />
      <div className="Buy-container">
        
        <div className="Buy-main">

          <div className="controls">
            <div className="sort-filter-container">
              <div className="sort">
                <label htmlFor="sort">Sort by:</label>
                <select id="sort" onChange={e => setSortOption(e.target.value)} value={sortOption}>
                  <option value="relevance">Relevance</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </select>
              </div>

              <div className="filter">
                <label htmlFor="cost">Filter by Cost:</label>
                <select id="cost" onChange={e => setCostFilter(e.target.value)} value={costFilter}>
                  <option value="">All</option>
                  <option value="0-300">₹0 - ₹300</option>
                  <option value="300-500">₹300 - ₹500</option>
                  <option value="500+">₹500+</option>
                </select>
              </div>

              <div className="filter">
                <label htmlFor="category">Book Category:</label>
                <select id="category" onChange={e => setCategoryFilter(e.target.value)} value={categoryFilter}>
                  <option value="">All</option>
                  <option value="NDA">NDA</option>
                  <option value="CDS">CDS</option>
                  <option value="AFCAT">AFCAT</option>
                  <option value="SSB">SSB Interview</option>
                  <option value="Territorial Army">Territorial Army</option>
                  <option value="CAPF">CAPF</option>
                </select>
              </div>

            </div>
          </div>

          <div className="book-list">
            {filteredBooks.map(book => (
              <div className="book-card" key={book._id}>
                <img
                  src={`http://localhost:5000/${book.productPhoto}`}
                  alt={book.productName}
                  style={{ width: '200px' }}
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
