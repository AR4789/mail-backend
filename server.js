const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// HEALTH CHECK (important for Render)
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// SEND MAIL API
app.post("/send-mail", async (req, res) => {
  const data = req.body;

  console.log("Incoming:", data);

  if (!data.senderEmail) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Star City <info@starcityparcelservice.com>", // must be verified domain in Resend
        to: data.senderEmail,
        subject: "Warehouse Request Received",
        html: `
          <h2>Request Received ✅</h2>
          <p><b>Request ID:</b> ${data.bookingId}</p>
          <p><b>Name:</b> ${data.senderName}</p>
          <p><b>Storage Type:</b> ${data.deliveryType}</p>
          <p>We will contact you shortly.</p>
        `
      })
    });

    const result = await response.json();
    console.log("Resend response:", result);

    if (!response.ok) {
      return res.status(500).json({ error: "Email failed", details: result });
    }

    res.json({ success: true });

  } catch (err) {
    console.error("MAIL ERROR:", err);
    res.status(500).json({ error: "Mail failed" });
  }
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});