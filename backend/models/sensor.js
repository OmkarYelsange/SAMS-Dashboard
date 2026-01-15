import mongoose from "mongoose";

const SensorSchema = new mongoose.Schema(
  {
    time: String,
    device: String,
    sensor: String,
    value: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Sensor", SensorSchema);

// mongodb+srv://sams:sams@cluster0.mci6o1z.mongodb.net/?appName=Cluster0
