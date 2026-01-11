require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const adminAuth = require("./router/adminAuth");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
// const adminRouter = require("./router/admin");
const jwt = require("jsonwebtoken");
const db = require("./db/db");




app.use(express.json());


app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));




app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});





app.use("/admin/create", require("./router/adminCreate"));


app.use("/admin/add-events",  require("./router/addEvents"));


// GET all events
app.get("/events", (req, res) => {
  const sql = "SELECT * FROM events";
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

// GET single event
app.get("/events/:id", (req, res) => {
  const sql = "SELECT * FROM events WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.json(err);
    return res.json(result[0]);
  });
});

// Book event
app.post("/bookings", (req, res) => {
  const { event_id, name, email, mobile, quantity, total_amount } = req.body;

  const sql = `INSERT INTO bookings 
    (event_id, name, email, mobile, quantity, total_amount) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [event_id, name, email, mobile, quantity, total_amount], err => {
    if (err) return res.json(err);

    // update seat availability
    const updateSeats = `
      UPDATE events SET available_seats = available_seats - ? WHERE id = ?
    `;
    db.query(updateSeats, [quantity, event_id]);

    return res.json({ message: "Booking successful!" });
  });
});



app.get("/admin/stats", adminAuth, (req, res) => {
  const stats = {};

  db.query("SELECT COUNT(*) AS totalBookings FROM bookings", (err, rows) => {
    stats.totalBookings = rows[0].totalBookings;

    db.query("SELECT SUM(total_amount) AS totalRevenue FROM bookings", (err2, rows2) => {
      stats.totalRevenue = rows2[0].totalRevenue;

      db.query("SELECT COUNT(*) AS totalEvents FROM events", (err3, rows3) => {
        stats.totalEvents = rows3[0].totalEvents;

        res.json(stats);
      });
    });
  });
});




app.get("/admin/event-sales", adminAuth, (req, res) => {
  const sql = `
    SELECT events.title, COUNT(bookings.id) AS total
    FROM events
    LEFT JOIN bookings ON bookings.event_id = events.id
    GROUP BY events.id
  `;

  db.query(sql, (err, rows) => {
    res.json({
      labels: rows.map(r => r.title),
      data: rows.map(r => r.total)
    });
  });
});



app.get("/admin/bookings", adminAuth, (req, res) => {
  const sql = `
    SELECT bookings.*, events.title
    FROM bookings
    JOIN events ON events.id = bookings.event_id
    ORDER BY bookings.booking_date DESC
  `;

  db.query(sql, (err, rows) => res.json(rows));
});





app.put("/events/:id", adminAuth, (req, res) => {
  const sql = "UPDATE events SET ? WHERE id = ?";
  db.query(sql, [req.body, req.params.id], () => res.json({ message: "Event updated" }));
});

app.delete("/events/:id", adminAuth, (req, res) => {
  const sql = "DELETE FROM events WHERE id = ?";
  db.query(sql, [req.params.id], () => res.json({ message: "Event deleted" }));
});


app.post("/admin/login", (req,res) =>{
  const { email, password } = req.body;

  db.query("SELECT * FROM admins WHERE email = ?", [email], async (err, rows) => {
    if (err) return res.json({ success: false, message: "Server Error" });
    if (rows.length === 0) return res.json({ success: false, message: "Invalid Email" });

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid Password" });

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

     res.cookie("adminToken", token, {
      httpOnly: true,     // cannot be accessed by JS
      secure: false,      // set to true in production with HTTPS
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });


    res.json({ success: true, message: "Login successful", adminToken: token });
  });
});



app.post("/admin/logout", (req, res) => {
  res.clearCookie("adminToken");
  res.json({ success: true });
});





app.get("/admin/test", (req, res) => {
    console.log("COOKIES:", req.cookies);
    res.send("Checked in console");
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
