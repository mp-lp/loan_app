import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { isSuperAdmin } from '../middleware/isSuperAdmin';
import { addAdmin, deleteAdmin, listAdmins } from '../controllers/adminController';

const router = express.Router();

router.use(authenticate, isSuperAdmin);

router.get('/', listAdmins); // Get all admins
router.post('/add', addAdmin); // Add admin
router.delete('/delete/:id', deleteAdmin); // Delete admin by ID

export default router;
