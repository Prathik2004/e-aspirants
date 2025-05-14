const mongoose = require("mongoose");

const authorizationschema = new mongoose.Schema({
name: { type: String },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
contact : { type: Number, required: true },
cart: { type: Array, default: [] },
});

module.exports = mongoose.model("Authorization", authorizationschema);