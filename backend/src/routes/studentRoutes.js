import express from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getStudents);
router.get('/:id', optionalAuth, getStudentById);
router.post('/', optionalAuth, createStudent);
router.put('/:id', optionalAuth, updateStudent);
router.delete('/:id', optionalAuth, deleteStudent);

export default router;
