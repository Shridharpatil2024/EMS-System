import Attendance from '../models/attendanceModel.js';
import LeaveRequest from '../models/leaveRequestModel.js';
import User from '../models/userModel.js';


const markAttendance = async (req, res) => {
  try {
    const { name, email } = req.body;
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toISOString();

    const exists = await Attendance.findOne({ email, date });
    if (exists) {
      return res.status(400).json({ message: 'Attendance already marked for today.' });
    }

    const newAttendance = new Attendance({ name, email, time, date });
    await newAttendance.save();

    res.status(201).json({
      message: 'Attendance marked successfully.',
      attendance: newAttendance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};


const checkAttendance = async (req, res) => {
  try {
    const { email } = req.body;

    const date = new Date().toLocaleDateString('en-CA');

    const exists = await Attendance.findOne({ email, date });

    res.status(200).json({ marked: exists ? true : false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



const getAttendanceSummary = async (req, res) => {
  try {
    const today = new Date();
    const todayStr = new Date().toLocaleDateString('en-CA'); 
    
    const totalEmployees = await User.countDocuments(); 

    const presentCount = await Attendance.countDocuments({ date: todayStr }) || 0;

    const onLeaveCount = await LeaveRequest.countDocuments({
      status: 'approved',
      startDate: { $lte: today },
      endDate: { $gte: today },
    }) || 0;

    let notMarkedCount = totalEmployees - presentCount - onLeaveCount;
    if (notMarkedCount < 0) notMarkedCount = 0;

    res.status(200).json({
      present: presentCount,
      onLeave: onLeaveCount,
      notMarked: notMarkedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export { markAttendance, checkAttendance, getAttendanceSummary };
