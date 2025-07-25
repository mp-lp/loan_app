
import { Request, Response, NextFunction } from 'express';

export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { role, isSuperAdmin } = req.user || {};
  if (role !== 'admin' || !isSuperAdmin) {
    return res.status(403).json({ message: 'Access denied. Super Admin only.' });
  }
  next();
};
