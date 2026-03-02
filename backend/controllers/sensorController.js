import axios from "axios";
import Sensor from "../models/sensor.js";

export const fetchData = async (req, res) => {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${process.env.SHEET_ID}/gviz/tq?tqx=out:json&sheet=Sheet1`;

    const response = await axios.get(url);

    const json = JSON.parse(response.data.substring(47).slice(0, -2));

    const rows = json.table.rows.map((row) => ({
      timestamp: row.c[1]?.v,
      temp: row.c[2]?.v,
      vibX: row.c[3]?.v,
      vibY: row.c[4]?.v,
      vibZ: row.c[5]?.v,
      magnitude: row.c[7]?.v,
      rms: row.c[9]?.v,
    }));

    res.json(rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
