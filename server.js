const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());

// ✅ Hostinger SMTP config
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

// ✅ API to send mail
app.post("/send-mail", async (req, res) => {
  const data = req.body;

  try {
    await transporter.sendMail({
      from: `"Star City Warehouse" info@starcityparcelservice.com`,
      to: data.senderEmail,
      subject: "Warehouse Request Received",
      html: `
        <h2>Request Received ✅</h2>
        <p><b>Request ID:</b> ${data.bookingId}</p>
        <p><b>Name:</b> ${data.senderName}</p>
        <p><b>Storage Type:</b> ${data.deliveryType}</p>
        <p>We will contact you shortly.</p>
      `
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Mail failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));