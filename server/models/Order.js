const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'authorization',
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booklisting',
      },
      productName: String,
      productCost: Number,
      quantity: Number,
    },
  ],
  address: String,
  paymentMethod: String,
  totalAmount: Number,
  orderedAt: {
    type: Date,
    default: Date.now,
  },

  // ✅ Tracking Features
  trackingId: {
    type: String,
    default: '',
  },
  courierName: {
    type: String,
    default: '',
  },
  trackingStatus: {
    type: String,
    enum: ['Pending', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  trackingHistory: [
    {
      status: String,
      location: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  // ✅ Optional: Delivery coordinates for map tracking
  deliveryCoordinates: {
    lat: Number,
    lng: Number,
  },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
