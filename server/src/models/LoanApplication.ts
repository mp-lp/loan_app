import mongoose from 'mongoose'

const loanApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  loanAmount: { type: Number, required: true },
  loanTenure: { type: Number, required: true },
  employmentStatus: { type: String, required: true },
  loanReason: { type: String, required: true },
  employmentAddress1: { type: String, required: true },
  termsAccepted: { type: Boolean, required: true },
  consent: { type: Boolean, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'verified'], default: 'pending' },
}, { timestamps: true })

export default mongoose.model('LoanApplication', loanApplicationSchema)
