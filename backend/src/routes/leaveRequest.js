import express from 'express';
import { 
  newLeaveRequest, 
  getLeaveSummary, 
  getLeaveBreakdown, 
  getLeaveHistory, 
  deleteLeaveRequest,
  checkLeaveStatus,  
  updateLeaveStatus,
  getAllLeaveRequests
} from '../controllers/leaveRequestController.js';

const router = express.Router();

router.post('/leave-request', newLeaveRequest);
router.get('/summary', getLeaveSummary);
router.get('/breakdown', getLeaveBreakdown);
router.get('/history', getLeaveHistory);
router.post('/delete', deleteLeaveRequest);
router.get('/status', checkLeaveStatus); 
router.post('/update-status', updateLeaveStatus);
router.get('/all-leaves', getAllLeaveRequests);

export default router;
