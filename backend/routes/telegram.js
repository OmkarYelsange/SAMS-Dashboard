import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/send", async (req, res) => {
  const { message } = req.body;

  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Telegram alert failed" });
  }
});

export default router;
