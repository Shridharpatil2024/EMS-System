import express from 'express';
import { loginPage, register } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginPage);
router.post('/register', register);

export default router;
