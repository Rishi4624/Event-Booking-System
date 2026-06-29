

const express = require("express");


const router = express.Router();

router.post("/", (req, res) => {
  res.clearCookie("Token", { sameSite: "none", secure: true });
  res.json({ success: true });
});


module.exports = router;