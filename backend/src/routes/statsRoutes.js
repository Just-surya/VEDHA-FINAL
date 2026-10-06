import express from 'express';
import { getAttendanceTrend, getTermMeta } from '../controllers/statsController.js';

const router = express.Router();

router.get('/attendance-trend', getAttendanceTrend);
router.get('/term-meta', getTermMeta);

export default router;
