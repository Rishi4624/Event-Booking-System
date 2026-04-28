const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();

dns.setDefaultResultOrder("ipv4first");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
  

module.exports = mongoose;
