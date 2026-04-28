const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // name of collection
  seq: { type: Number, default: 0 },     // current number
});

module.exports = mongoose.model("Counter", counterSchema);
