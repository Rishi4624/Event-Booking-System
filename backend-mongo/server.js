require("dotenv").config();
require("./db/mongo");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");


const app = express();


app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",") : [];
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true
}));

app.use("/admin/create", require("./router/adminCreate"));
app.use("/admin/login", require("./router/admin"));
app.use("/admin/add-events", require("./router/addEvents"));
app.use("/auth/signup", require("./router/register"));
app.use("/admin/logout", require("./router/logout"));

const Event = require("./models/Event");
const Booking = require("./models/Booking");

// GET events
app.get("/events", async (req, res) => {
  res.json(await Event.find());
});

// GET /events/:id
app.get("/events/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Fetching event with ID:", id);

    // ── Option A: if your "id" field is a Number ─────────────────────────────
    // Most common case when you auto-increment or manually set numeric IDs
    const event = await Event.findOne({ id: Number(id) });

    // ── Option B: if your "id" field is actually ObjectId (MongoDB default) ──
    // const { ObjectId } = require("mongoose");
    // const event = await Event.findById(id);                    // ← preferred
    // or: await Event.findOne({ _id: new ObjectId(id) });

    // ── Option C: if you're using a custom string ID ─────────────────────────
    // const event = await Event.findOne({ id: id });             // string comparison

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Optional: transform / clean the response
    res.status(200).json({
      success: true,
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        price: event.price,
        available_seats: event.available_seats,
        img: event.img,
        // ... other fields you want to send
      },
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching event",
      error: error.message,
    });
  }
});

// PUT /events/:id
app.put("/events/:id", require("./router/adminAuth"), async (req, res) => {
  try {
    if (req.admin.email === "dummyAdmin@gmail.com") {
      return res.status(403).json({ success: false, message: "Dummy admin cannot update events" });
    }
    const id = req.params.id;
    const { title, description, location, date, seats, price, image } = req.body;
    
    // Find event and update
    let event;
    if (!isNaN(id)) {
      event = await Event.findOneAndUpdate({ id: Number(id) }, {
        title,
        description,
        location,
        date,
        available_seats: seats,
        price,
        img: image
      }, { new: true });
    } else {
      event = await Event.findByIdAndUpdate(id, {
        title,
        description,
        location,
        date,
        available_seats: seats,
        price,
        img: image
      }, { new: true });
    }

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, message: "Event updated successfully", event });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ success: false, message: "Server error while updating event", error: error.message });
  }
});

// DELETE /events/:id
app.delete("/events/:id", require("./router/adminAuth"), async (req, res) => {
  try {
    if (req.admin.email === "dummyAdmin@gmail.com") {
      return res.status(403).json({ success: false, message: "Dummy admin cannot delete events" });
    }
    const id = req.params.id;
    let event;
    if (!isNaN(id)) {
      event = await Event.findOneAndDelete({ id: Number(id) });
    } else {
      event = await Event.findByIdAndDelete(id);
    }
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ success: false, message: "Server error while deleting event" });
  }
});



app.post("/bookings", async (req, res) => {
  try {
    const { event_id, name, email, mobile, quantity, total_amount } = req.body;

    let event;
    if (mongoose.Types.ObjectId.isValid(event_id)) {
      event = await Event.findById(event_id);
    } else {
      event = await Event.findOne({ id: Number(event_id) });
    }

    if (!event || event.available_seats < quantity)
      return res.status(400).json({ message: "Seats not available or Event not found" });

    const booking = await Booking.create({
      event: event._id,
      name,
      email,
      mobile,
      quantity,
      total_amount,
    });

    event.available_seats -= quantity;
    await event.save();

    res.json({ message: "Booking successful!", booking_id: booking._id });
  } catch (err) {
    console.error("Booking Error: ", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

app.get("/admin/bookings", require("./router/adminAuth"), async (req, res) => {
  try {
    const bookings = await Booking.find().populate("event", "title date");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
