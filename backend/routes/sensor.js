import express from "express";
import { fetchData, fetchHistory } from "../controllers/sensorController.js";

const router = express.Router();

router.get("/data", fetchData);
router.get("/history", fetchHistory);

export default router;
