import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import loanRoutes from './routes/loanRoutes'
import adminRoutes from './routes/adminRoutes';
dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("hello");
});
app.use('/api', authRoutes)
app.use('/api/loans', loanRoutes)
app.use('/api/admins', adminRoutes);

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    })
  })
  .catch(err => console.error('MongoDB connection error:', err))
