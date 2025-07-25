import { Request, Response, NextFunction } from 'express'

export const verifierPermission = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'verifier') {
    return res.status(403).json({ message: 'Verifiers only' })
  }

  const { status } = req.body
  if (status === 'approved') {
    return res.status(403).json({ message: 'Verifier cannot approve loans' })
  }

  next()
}
