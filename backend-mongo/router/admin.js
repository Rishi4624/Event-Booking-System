const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  console.log("User login attempt 0");

  const admin = await Admin.findOne({ email });
  const user = await User.findOne({ email });

  if (!admin && !user){
    return res.json({ success: false, message: "Email is not registered" });
  }


  if(admin){
    const match =  await bcrypt.compare(password, admin.password);
    if (!match)
      return res.json({ success: false, message: "Invalid Password" });
    
    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  
    res.cookie("Token", token, { httpOnly: true, sameSite: "none", secure: true });
    return res.json({ success: true, message:"admin", token });
  }

  else if(user){
    console.log("User login attempt 1");
    const match = await bcrypt.compare(password, user.password);
    console.log("User login attempt 2");
    if (!match){
      console.log("User login attempt 3");
      return res.json({ success: false, message: "Invalid Password" });
    }
    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  
    res.cookie("Token", token, { httpOnly: true, sameSite: "none", secure: true });
    return res.json({ success: true, message:"user", token });
   
  }

  return res.json({ success: false, message: "Invalid Email" });


});

module.exports = router;
