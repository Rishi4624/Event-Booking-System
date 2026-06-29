const express = require("express");
const Event = require("../models/Event");
const adminAuth = require("./adminAuth");

const router = express.Router();

router.post("/", adminAuth, async (req, res) => {

  try{
    const existingEvent = await Event.findOne({ 
    title: req.body.title,
    date: req.body.date,
    location: req.body.location,
});

if (existingEvent) {
  return res.status(400).json({ 
    success: false, 
    message: "Event with same name, date, and location already exists",
  });
}
  await Event.create({
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    date: req.body.date,
    available_seats: req.body.seats,
    price: req.body.price,
  });
  res.status(200).json({ success: true, message: "Event added" });
}catch(err){
  return res.status(400).json({ success: false, message: err.message });
}

});

module.exports = router;
