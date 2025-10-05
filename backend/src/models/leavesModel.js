import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true }, 
  count: { type: Number, required: true },              
});

const Leave = mongoose.model('Leave', leaveSchema);

export default Leave;
