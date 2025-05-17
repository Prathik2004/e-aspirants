import React, { useState } from 'react';
import './Sell.css';
import Header from '../components/Header';

const BookListingForm = () => {
  const [formData, setFormData] = useState({
    productPhoto: '',
    productName: '',
    productDescription: '',
    productCost: '',
    productCategory: '',
    sellerName: '',
    sellerEmail: '',
    sellerContact: '',
    sellerAddress: ''
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'productPhoto' ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData();
  form.append('productPhoto', formData.productPhoto);
  form.append('productName', formData.productName);
  form.append('productDescription', formData.productDescription);
  form.append('productCost', formData.productCost);
  form.append('productCategory', formData.productCategory);
  form.append('sellerName', formData.sellerName);
  form.append('sellerEmail', formData.sellerEmail);
  form.append('sellerContact', formData.sellerContact);
  form.append('sellerAddress', formData.sellerAddress);

  try {
    const response = await fetch('http://localhost:5000/api/sell-book', {
      method: 'POST',
      body: form
    });

    const result = await response.json();
    if (response.ok) {
      alert('✅ Book listed successfully!');
      setFormData({
        productPhoto: '',
        productName: '',
        productDescription: '',
        productCost: '',
        productCategory: '',
        sellerName: '',
        sellerEmail: '',
        sellerContact: '',
        sellerAddress: ''
      });
    } else {
      alert('❌ Failed to list book: ' + result.error);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('❌ Something went wrong.');
  }
};


  return (
    <>
    <Header />
    <div className="listing-container">
      <form className="listing-form" onSubmit={handleSubmit}>
        <h2>📚 List Your Book</h2>

        <input type="file" name="productPhoto" accept="image/*" onChange={handleChange} required />

        <input type="text" name="productName" placeholder="Product Name" value={formData.productName} onChange={handleChange} required />

        <textarea name="productDescription" placeholder="Product Description" value={formData.productDescription} onChange={handleChange} required />

        <input type="number" name="productCost" placeholder="Product Cost (₹)" value={formData.productCost} onChange={handleChange} required />

        <input type="text" name="productCategory" placeholder="Product Category" value={formData.productCategory} onChange={handleChange} required />

        <input type="text" name="sellerName" placeholder="Your Name" value={formData.sellerName} onChange={handleChange} required />

        <input type="email" name="sellerEmail" placeholder="Your Email" value={formData.sellerEmail} onChange={handleChange} required />

        <input type="tel" name="sellerContact" placeholder="Contact Number" value={formData.sellerContact} onChange={handleChange} required />

        <textarea name="sellerAddress" placeholder="Your Address" value={formData.sellerAddress} onChange={handleChange} required />

        <button type="submit">Submit Listing</button>
      </form>
    </div>
    </>
  );
};

export default BookListingForm;
