const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
// const adminAuth = require("./adminAuth");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists)
    return res.json({ success: false, message: "Email already exists" });


  const hashedPassword = await bcrypt.hash(password, 10);
  const check = await User.create({ name, email, password: hashedPassword });

  
  if(check)
    return res.json({ success: true, message: " User created successfully" });
  else
    return res.json({ success: false, message: "Failed to create user" });

});

module.exports = router;
