require("dotenv").config();
require("./db/mongo");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

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




app.post("/bookings", async (req, res) => {
  const { event_id, name, email, mobile, quantity, total_amount } = req.body;

  const event = await Event.findById(event_id);
  if (!event || event.available_seats < quantity)
    return res.status(400).json({ message: "Seats not available" });

  await Booking.create({
    event: event_id,
    name,
    email,
    mobile,
    quantity,
    total_amount,
  });

  event.available_seats -= quantity;
  await event.save();

  res.json({ message: "Booking successful!" });
});


app.listen(5000, () => console.log("Server running on port 5000"));
