const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

require("dotenv").config();
require('dns').setDefaultResultOrder('ipv4first');


const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// API
app.post("/send-mail", async (req, res) => {
  const data = req.body;

  console.log("Incoming:", data);

  if (!data.senderEmail) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    await transporter.sendMail({
      from: `"Star City Warehouse" <info@starcityparcelservice.com>`,
      to: data.senderEmail,
      subject: "Warehouse Request Received",
      html: `
        <h2>Request Received ✅</h2>
        <p><b>ID:</b> ${data.bookingId}</p>
        <p><b>Name:</b> ${data.senderName}</p>
        <p><b>Type:</b> ${data.deliveryType}</p>
      `
    });

    res.json({ success: true });

  } catch (err) {
    console.error("MAIL ERROR:", err);
    res.status(500).json({ error: "Mail failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));