import axios from "axios";
import Sensor from "../models/sensor.js";

export const fetchData = async (req, res) => {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${process.env.SHEET_ID}/gviz/tq?tqx=out:json`;
    const response = await axios.get(url);

    const json = JSON.parse(
      response.data.substring(47, response.data.length - 2)
    );

    const rows = json.table.rows.map((row) => ({
      time: row.c[0]?.v,
      device: row.c[1]?.v,
      sensor: row.c[2]?.v,
      value: row.c[3]?.v,
    }));

    if (rows.length) await Sensor.insertMany(rows);

    res.json(rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const fetchHistory = async (req, res) => {
  const range = req.query.range || "7d";
  const now = new Date();
  let startDate = new Date();

  if (range === "1d") startDate.setDate(now.getDate() - 1);
  if (range === "7d") startDate.setDate(now.getDate() - 7);
  if (range === "30d") startDate.setDate(now.getDate() - 30);

  const data = await Sensor.find({ createdAt: { $gte: startDate } }).sort({
    createdAt: 1,
  });

  res.json(data);
};
