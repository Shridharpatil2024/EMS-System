import express from 'express';
import { getUsersByEmailId, updateUser, createUser, deleteUser, getAllUsers, getImageByName } from '../controllers/usersController.js';
import upload from '../middleware/multer.js';

const router = express.Router();


router.get('/get-users-by-email', getUsersByEmailId);
router.post('/create-user', createUser);
router.post('/update-user', upload.single('profileImage'), updateUser);
router.post('/delete-user', deleteUser);
router.get('/get-all-users', getAllUsers);
router.get('/:name', getImageByName);

export default router;



