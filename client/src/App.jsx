import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Button } from './components/ui/button'
import VerifierDashboard from './pages/VerifierDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ApplicationForm from './pages/ApplicationForm'
import LoanDashboard from './pages/LoanDashboard'
import AuthForm from './pages/AuthForm'
import { Toaster } from 'react-hot-toast'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token')
  if (!isAuthenticated) {
    return <Navigate to="/auth" />
  }
  
  return children
}

const App = () => {
  return (
    
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/auth" element={<AuthForm />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/verifier"
          element={
            <PrivateRoute>
              <VerifierDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/application"
          element={
            <PrivateRoute>
              <ApplicationForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/loans"
          element={
            <PrivateRoute>
              <LoanDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
        <ToastContainer position="top-right" />
    </BrowserRouter>
  )
}

export default App