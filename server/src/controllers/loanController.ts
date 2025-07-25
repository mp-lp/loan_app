import { Request, Response } from 'express'
import LoanApplication from '../models/LoanApplication'

export const applyForLoan = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      loanAmount,
      loanTenure,
      employmentStatus,
      loanReason,
      employmentAddress1,
      termsAccepted,
      consent
    } = req.body

    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' })

    const application = await LoanApplication.create({
      user: req.user.id,
      fullName,
      loanAmount,
      loanTenure,
      employmentStatus,
      loanReason,
      employmentAddress1,
      termsAccepted,
      consent,
    })

    res.status(201).json({ message: 'Application submitted', application })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

// ✅ Get all loan applications for Admin Dashboard
export const getAllLoanApplications = async (req: Request, res: Response) => {
  try {
    const applications = await LoanApplication.find().sort({ createdAt: -1 })
    res.status(200).json(applications)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const updateLoanStatus = async (req: Request, res: Response) => {
  try {
    const { loanId } = req.params
    const { status } = req.body
    const role = req.user?.role
    console.log("Controller Role:", role, "Requested Status:", status);

    const allStatuses = ['pending', 'approved', 'rejected', 'verified']
    if (!allStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }


if (role === 'verifier') {
  if (!['verified', 'rejected'].includes(status)) {
    return res.status(403).json({ message: 'Verifier can only verify or reject applications' });
  }
}

if (role === 'admin' || role === 'super-admin') {
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(403).json({ message: `${role} can only approve or reject applications` });
  }
}

    const updatedLoanApplication = await LoanApplication.findByIdAndUpdate(
      loanId,
      { status },
      { new: true }
    )

    if (!updatedLoanApplication) {
      return res.status(404).json({ message: 'Loan not found' })
    }

    res.status(200).json({ message: 'Status updated', updatedLoanApplication })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const getUserLoans = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const {
      page = 1,
      limit = 10,
      search = '',
      status = 'all',
      sortField = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    const query: any = { user: userId }

    if (status !== 'all') {
      query.status = status
    }

    if (search) {
      query.fullName = { $regex: search, $options: 'i' }
    }

    const skip = (Number(page) - 1) * Number(limit)

    const totalCount = await LoanApplication.countDocuments(query)
    const totalPages = Math.ceil(totalCount / Number(limit))

    const loans = await LoanApplication.find(query)
      .sort({ [String(sortField)]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit))

    res.status(200).json({ loans, totalPages, currentPage: Number(page) })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}