const express = require("express");
const db = require("../config/db");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

// Email Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Home Page - List Tickets
router.get("/", (req, res) => {
  db.query("SELECT * FROM tickets ORDER BY priority DESC, created_at DESC", (err, results) => {
    if (err) throw err;
    res.render("index", { tickets: results });
  });
});

// Create Ticket
router.post("/create_ticket", (req, res) => {
  const { title, description, priority } = req.body;
  db.query("INSERT INTO tickets (title, description, priority) VALUES (?, ?, ?)", 
    [title, description, priority], (err, result) => {
      if (err) throw err;

      // Send Email Notification
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "support@example.com",
        subject: `New Ticket Created: ${title}`,
        text: `Priority: ${priority}\nDescription: ${description}`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        else console.log("📧 Email sent: " + info.response);
      });

      res.redirect("/");
  });
});

// Update Ticket Status
router.post("/update_ticket/:id", (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  db.query("UPDATE tickets SET status=? WHERE id=?", [status, id], (err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

module.exports = router;
