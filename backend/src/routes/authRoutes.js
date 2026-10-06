import express from 'express';
import { login, register, getMe, getStaffList } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticateToken, getMe);

// Legacy backward compatibility endpoint
router.get('/staff', getStaffList);

export default router;
