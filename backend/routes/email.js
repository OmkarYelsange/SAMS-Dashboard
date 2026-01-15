import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // smtp-relay.brevo.com
  port: process.env.EMAIL_PORT, // 587
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Brevo login email
    pass: process.env.EMAIL_PASS, // Brevo SMTP key
  },
});

router.post("/email", async (req, res) => {
  const { message } = req.body;

  try {
    await transporter.sendMail({
      from: `"SAMS Alert" <${process.env.EMAIL_USER}>`,
      to: "customeremail@gmail.com",
      subject: "⚠️ SAMS Critical Alert",
      text: message,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    res.status(500).json({ error: "Email failed" });
  }
});

export default router;
