require("dotenv").config();
require("./db/mongo");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./models/Admin");

async function createDummy() {
  try {
    const email = "dummyAdmin@gmail.com";
    const password = "admin@1234";

    const exists = await Admin.findOne({ email });
    if (exists) {
      console.log("Dummy admin already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ name: "Dummy Admin", email, password: hashedPassword });
    console.log("Dummy admin created successfully.");
  } catch (err) {
    console.error("Error creating dummy admin:", err);
  } finally {
    process.exit(0);
  }
}

createDummy();
