
import express from 'express'
import {
  applyForLoan,
  getAllLoanApplications,
  getUserLoans,
  updateLoanStatus
} from '../controllers/loanController'
import { authenticate } from '../middleware/authMiddleware'
import { isAdmin } from '../middleware/roleMiddleware'
import { verifierPermission } from '../middleware/verifierMiddleware'
import { isSuperAdmin } from '../middleware/isSuperAdmin';
const router = express.Router()

// User applies for a loan
router.post('/apply', authenticate, applyForLoan)

// User views their own loan status with filters
router.get('/status', authenticate, getUserLoans)



router.get(
  '/all',
  authenticate,
  (req, res, next) => {
    const role = req.user?.role;
    if (role === 'admin' || role === 'verifier' || role === 'super-admin') {
      return next();
    }
    return res.status(403).json({ message: 'Access denied' });
  },
  getAllLoanApplications
);




router.patch(
  '/update-status/:loanId',
  authenticate,
  (req, res, next) => {
    const role = req.user?.role;
    if (role === 'admin' || role === 'super-admin') return next(); // ✅ Added super-admin
    if (role === 'verifier') return verifierPermission(req, res, next);
    return res.status(403).json({ message: 'Access denied' });
  },
  updateLoanStatus
);



export default router
