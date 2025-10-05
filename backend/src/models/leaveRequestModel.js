import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  type: {
    type: String,
    enum: [
      'Casual Leave',
      'Sick Leave',
      'Earned Leave',
      'Maternity/Paternity Leave'
    ],
    required: true
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  totalDays: { type: Number },
}, { timestamps: true });

export default mongoose.model('LeaveRequest', leaveRequestSchema);
