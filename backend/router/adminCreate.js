const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db/db");
const adminAuth = require("./adminAuth");

// CREATE NEW ADMIN
router.post("/",adminAuth, async (req, res) => {
  const { name, email, password } = req.body;

  

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  // check existing
  db.query("SELECT * FROM admins WHERE email = ?", [email], async (err, rows) => {
    if (rows.length > 0) {
      return res.json({ success: false, message: "Email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert new admin
    const sql = "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashedPassword], (err2) => {
      if (err2) {
        console.log(err2);
        return res.status(500).json({ message: "DB Error" });
      }

      return res.json({ success: true, message: "Admin created successfully" });
    });
  });
});

module.exports = router;
