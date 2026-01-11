const express = require("express");
const mysql = require("mysql2");
const app = express();// DB Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "event_booking",
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL connected");
});

module.exports = db;