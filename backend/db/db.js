const express = require("express");
const mysql = require("mysql2");
const app = express();
// DB Connection

const db = mysql.createConnection(process.env.MYSQL_URL);
db.connect(err => {
  if (err) throw err;
  console.log("MySQL connected");
});

module.exports = db;