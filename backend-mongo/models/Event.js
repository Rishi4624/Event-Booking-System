const mongoose = require("mongoose");
const Counter = require("./Counter");

const eventSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true }, // auto number
    title: String,
    description: String,
    location: String,
    date: Date,
    available_seats: Number,
    price: Number,
  },
  { timestamps: true }
);



/**
 * Auto increment before save
 */
eventSchema.pre("save", async function () {
  if (this.id) return; // already set

  const counter = await Counter.findByIdAndUpdate(
    { _id: "eventId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.id = counter.seq;
});

module.exports = mongoose.model("Event", eventSchema);
