import express from 'express';
import { checkAttendance, markAttendance, getAttendanceSummary } from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/mark', markAttendance);
router.post('/check', checkAttendance);
router.get('/summary-of-attendance', getAttendanceSummary);

export default router;
