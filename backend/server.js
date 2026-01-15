import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import sensorRoutes from "./routes/sensor.js";
import emailRoutes from "./routes/email.js";
import telegramRoutes from "./routes/telegram.js";

dotenv.config();
connectDB();

const app = express();

app.use("/alert", emailRoutes);
app.use(cors());
app.use(express.json());

app.use("/alert/telegram", telegramRoutes);

app.use("/auth", authRoutes);
app.use("/", sensorRoutes);

app.get("/", (req, res) => {
  res.send("SAMS Backend Running");
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
