import React, { useState, useRef } from 'react';
import './Sell.css';
import Header from '../components/Header';

const BookListingForm = () => {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    productPhoto: null,
    productName: '',
    productDescription: '',
    productCost: '',
    productCategory: '',
    sellerName: '',
    sellerEmail: '',
    sellerContact: '',
    sellerAddress: ''
  });

  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'productPhoto') {
      const file = files[0];
      setFormData(f => ({ ...f, productPhoto: file }));
      setPreviewUrl(URL.createObjectURL(file)); // Local preview before upload
      setIsUploaded(false);
    } else {
      setFormData(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.productPhoto) return alert('Please select an image.');

    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      payload.append(key, val);
    });

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/sell-book`,
        {
          method: 'POST',
          body: payload
        }
      );

      if (!res.ok) {
        let errMsg;
        try {
          const errJson = await res.json();
          errMsg = errJson.error || errJson.message;
        } catch {
          errMsg = await res.text();
        }
        throw new Error(errMsg || res.statusText);
      }

      const savedBook = await res.json();
      alert('✅ Book listed successfully!');

      // ✅ Set Cloudinary image preview
      if (savedBook.productPhoto) {
        setPreviewUrl(savedBook.productPhoto);
        setIsUploaded(true);
      }

      // ✅ Reset form (after preview is set)
      setFormData({
        productPhoto: null,
        productName: '',
        productDescription: '',
        productCost: '',
        productCategory: '',
        sellerName: '',
        sellerEmail: '',
        sellerContact: '',
        sellerAddress: ''
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Submit error:', err);
      alert('❌ Failed to list book: ' + err.message);
    }
  };

  return (
    <>
      <Header />
      <div className="listing-container">
        <form className="listing-form" onSubmit={handleSubmit}>
          <h2>📚 List Your Book</h2>

          <input
            ref={fileInputRef}
            type="file"
            name="productPhoto"
            accept="image/*"
            onChange={handleChange}
            required
          />

          {previewUrl && (
            <div style={{ margin: '10px 0' }}>
              <p style={{ color: isUploaded ? 'green' : 'gray' }}>
                {isUploaded ? '✅ Uploaded Book Cover:' : 'Preview before upload:'}
              </p>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: '150px',
                  height: 'auto',
                  objectFit: 'cover',
                  border: '2px solid #ccc'
                }}
              />
            </div>
          )}

          <input
            type="text"
            name="productName"
            placeholder="Product Name"
            value={formData.productName}
            onChange={handleChange}
            required
          />

          <textarea
            name="productDescription"
            placeholder="Product Description"
            value={formData.productDescription}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="productCost"
            placeholder="Product Cost (₹)"
            value={formData.productCost}
            onChange={handleChange}
            required
          />

          <select
            name="productCategory"
            value={formData.productCategory}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="NDA">NDA</option>
            <option value="CDS">CDS</option>
            <option value="AFCAT">AFCAT</option>
          </select>

          <input
            type="text"
            name="sellerName"
            placeholder="Your Name"
            value={formData.sellerName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="sellerEmail"
            placeholder="Your Email"
            value={formData.sellerEmail}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="sellerContact"
            placeholder="Contact Number"
            value={formData.sellerContact}
            onChange={handleChange}
            required
          />

          <textarea
            name="sellerAddress"
            placeholder="Your Address"
            value={formData.sellerAddress}
            onChange={handleChange}
            required
          />

          <button type="submit">Submit Listing</button>
        </form>
      </div>
    </>
  );
};

export default BookListingForm;
