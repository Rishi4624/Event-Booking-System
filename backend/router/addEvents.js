const express = require("express");
const router = express.Router();
const db = require("../db/db");
const adminAuth = require("./adminAuth");

router.post("/",adminAuth, async (req, res) => {

    console.log("Adding event:", req.body);
    const { title, description, location, date, seats, price } = req.body;
  const sql = "INSERT INTO events (title, description, location, date, seats, price) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [title, description, location, date, seats, price], (err) =>{
    if (err) {
      console.log("Error adding event:", err);
      return res.status(500).json({ success: false, message: "DB Error" });
    }
    res.json({ success: true, message: "Event added" });
  });
  
  
});

module.exports = router;
