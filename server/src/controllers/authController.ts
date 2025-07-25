import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, adminKey, verifierKey } = req.body

    if (role === 'admin' && adminKey !== process.env.ADMIN_KEY)
      return res.status(403).json({ message: 'Invalid admin key' })

    if (role === 'verifier' && verifierKey !== process.env.VERIFIER_KEY)
      return res.status(403).json({ message: 'Invalid verifier key' })

    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ message: 'User already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({ name, email, password: hashedPassword, role })

    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err })
  }
}



export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if super admin
    if (
      email === process.env.SUPER_ADMIN_EMAIL &&
      password === process.env.SUPER_ADMIN_PASSWORD
    ) {
      // Check if super admin already exists
      let superAdmin = await User.findOne({ email });
      if (!superAdmin) {
        const hashedPassword = await bcrypt.hash(password, 10);
        superAdmin = await User.create({
          name: 'Super Admin',
          email,
          password: hashedPassword,
          role: 'super-admin',
          isSuperAdmin: true
        });
      }

      const token = jwt.sign({ id: superAdmin._id, role: superAdmin.role }, process.env.JWT_SECRET!, {
        expiresIn: '1d'
      });

      return res.status(200).json({
        token,
        user: {
          id: superAdmin._id,
          name: superAdmin.name,
          email: superAdmin.email,
          role: superAdmin.role
        }
      });
    }

    // Regular login
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '1d'
    });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
