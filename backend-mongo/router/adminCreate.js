const express = require("express");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const adminAuth = require("./adminAuth");


const router = express.Router();

router.post("/", adminAuth, async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await Admin.findOne({ email });
  if (exists)
    return res.json({ success: false, message: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  await Admin.create({ name, email, password: hashedPassword });

  res.json({ success: true, message: "Admin created successfully" });
});

module.exports = router;
