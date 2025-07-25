const mongoose = require('mongoose');

const authorizationSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  number: String,
  address: { type: String, default: '' },
  profilePhoto: { type: String, default: '' }, 
  cart: { type: Array, default: [] },
});

const User = mongoose.model('authorization', authorizationSchema);
module.exports = User;
