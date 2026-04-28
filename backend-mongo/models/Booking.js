const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    name: String,
    email: String,
    mobile: String,
    quantity: Number,
    total_amount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
