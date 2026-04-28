

const express = require("express");


const router = express.Router();

router.post("/", (req, res) => {
  res.clearCookie("Token");
  res.json({ success: true });
});


module.exports = router;