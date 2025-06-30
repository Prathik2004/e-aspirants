const mongoose = require('mongoose');

const bookListingSchema = new mongoose.Schema({
  productPhoto: {
    type: String, // You can store the image as a URL or a file path
    required: true
  },
  photoPublicId: {
    type: String, // This can be used to delete the image from Cloudinary later
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productDescription: {
    type: String,
    required: true
  },
  productCost: {
    type: Number,
    required: true
  },
  productCategory: {
    type: String,
    required: true
  },
  sellerName: {
    type: String,
    required: true
  },
  sellerEmail: {
    type: String,
    required: true
  },
  sellerContact: {
    type: String,
    required: true
  },
  sellerAddress: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booklisting', bookListingSchema);
