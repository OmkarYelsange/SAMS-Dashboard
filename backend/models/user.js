import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "viewer", // admin, operator, viewer
  },
});

export default mongoose.model("User", userSchema);
