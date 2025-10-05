import express from 'express';
import { 
  createDepartment, 
  getAllDepartments, 
  updateDepartment, 
  deleteDepartment 
} from '../controllers/departmentController.js';

const router = express.Router();

router.post('/create-department', createDepartment);
router.get('/get-all-department', getAllDepartments);
router.put('/update-department', updateDepartment);
router.delete('/delete-department', deleteDepartment);

export default router;
