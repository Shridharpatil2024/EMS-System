import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true },
  department: { type: String },
  designation: { type: String },
  password: { type: String, required: true }, 
  role: { type: String, enum: ['employee', 'admin'], default: 'employee' } 
}, { timestamps: true });

export default mongoose.model("User", userSchema);
