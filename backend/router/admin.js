const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db/db");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM admins WHERE email = ?", [email], async (err, rows) => {
    if (rows.length === 0) return res.json({ success: false, message: "Invalid Email" });

    const admin = rows[0];

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.json({ success: false, message: "Wrong Password" });

    const token = jwt.sign({ id: admin.id }, "SECRET123", { expiresIn: "1d" });

    res.cookie("adminToken", token, { httpOnly: true });

    res.json({ success: true, token });
  });
});

module.exports = router;
