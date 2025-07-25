import { Request, Response, NextFunction } from 'express';

export const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'super-admin') {
    return res.status(403).json({ message: 'Only Super Admin can perform this action' });
  }
  next();
};
