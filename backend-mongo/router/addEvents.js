const express = require("express");
const Event = require("../models/Event");
const adminAuth = require("./adminAuth");

const router = express.Router();

router.post("/", adminAuth, async (req, res) => {
  await Event.create({
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    date: req.body.date,
    available_seats: req.body.seats,
    price: req.body.price,
  });

  res.json({ success: true, message: "Event added" });
});

module.exports = router;
