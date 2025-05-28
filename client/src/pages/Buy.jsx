import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './Buy.css';

const Buy = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [sortOption, setSortOption] = useState('relevance');
  const [costFilter, setCostFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);


  const { addToCart, cart, user } = useCart();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/books`);
        setBooks(response.data);
        setFilteredBooks(response.data); // default view
        const uniqueCategories = [...new Set(response.data.map(book => book.productCategory))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    let filtered = [...books];

    if (costFilter) {
      if (costFilter === '0-300') filtered = filtered.filter(b => b.productCost <= 300);
      else if (costFilter === '300-500') filtered = filtered.filter(b => b.productCost > 300 && b.productCost <= 500);
      else if (costFilter === '500+') filtered = filtered.filter(b => b.productCost > 500);
    }

    if (categoryFilter) {
      filtered = filtered.filter(b =>
        b.productCategory.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (sortOption === 'low-to-high') {
      filtered.sort((a, b) => a.productCost - b.productCost);
    } else if (sortOption === 'high-to-low') {
      filtered.sort((a, b) => b.productCost - a.productCost);
    }

    setFilteredBooks(filtered);
  }, [books, sortOption, costFilter, categoryFilter]);

  // Handler for adding item to cart
  const handleAddToCart = (book) => {
    if (!user) {
      alert('Please login to add items to your cart.');
      return;
    }
    addToCart(book);
  };

  return (
    <>
      <Header />
      <div className="Buy-container">
        <div className="Buy-main">

          <div className="controls">
            {/* Sorting and filters code remains unchanged */}
            <div className="sort-filter-container">
              <div className="filter-group">
                <label htmlFor="sort">Sort By:</label>
                <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                  <option value="relevance">Relevance</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="cost">Filter by Price:</label>
                <select id="cost" value={costFilter} onChange={(e) => setCostFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="0-300">Under ₹300</option>
                  <option value="300-500">₹300 - ₹500</option>
                  <option value="500+">Above ₹500</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="category">Filter by Category:</label>
                <select
                  id="category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

            </div>

          </div>

          <div className="book-list">
            {filteredBooks.map(book => (
              <div className="book-card" key={book._id}>
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${book.productPhoto}`}
                  alt={book.productName}
                  style={{ width: '200px' }}
                />
                <h3>{book.productName || 'Untitled'}</h3>
                <p>{book.productDescription || 'No description available.'}</p>
                <p>Price: ₹{book.productCost || 'N/A'}</p>
                <button onClick={() => handleAddToCart(book)}>
                  {cart.find(item => item._id === book._id) ? 'Added' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Buy;
