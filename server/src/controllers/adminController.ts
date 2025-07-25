import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';

export const listAdmins = async (_req: Request, res: Response) => {
  const admins = await User.find({ role: 'admin' });
  res.status(200).json(admins);
};

export const addAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    res.status(201).json({ message: 'Admin added successfully', admin: newAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const admin = await User.findById(id);

    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
