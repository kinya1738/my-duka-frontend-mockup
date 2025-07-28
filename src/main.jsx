import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import MerchantRegister from './components/MerchantRegister.jsx'
import MerchantDashboard from './components/MerchantDashboard.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import ClerkDashboard from './components/ClerkDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-merchant" element={<MerchantRegister />} />
        <Route
          path="/merchant-dashboard"
          element={
            <ProtectedRoute>
              <MerchantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clerk-dashboard"
          element={
            <ProtectedRoute>
              <ClerkDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)