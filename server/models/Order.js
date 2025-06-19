const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'authorization', // This links to your User model
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
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
