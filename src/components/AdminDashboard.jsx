import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Products from './Products.jsx'
import Inventory from './Inventory.jsx'
import Transactions from './Transactions.jsx'
import SupplyRequests from './SupplyRequests.jsx'
import Clerks from './Clerks.jsx'
import Profile from './Profile.jsx'
import Reports from './Reports.jsx'

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview')
  const navigate = useNavigate()

  useEffect(() => {
    const userType = localStorage.getItem('user_type')
    if (userType !== 'admin') {
      navigate('/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_type')
    navigate('/login')
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'products':
        return <Products />
      case 'inventory':
        return <Inventory />
      case 'transactions':
        return <Transactions />
      case 'supply_requests':
        return <SupplyRequests />
      case 'clerks':
        return <Clerks />
      case 'profile':
        return <Profile />
      case 'reports':
        return <Reports />
      default:
        return <h2>Admin Dashboard Overview</h2>
    }
  }

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>MyDuka Admin Dashboard</h2>
        <ul>
          <li><Link to="#" onClick={() => setActiveSection('profile')}>Profile</Link></li>
          <li><Link to="#" onClick={() => setActiveSection('products')}>Products</Link></li>
          <li><Link to="#" onClick={() => setActiveSection('clerks')}>Clerks</Link></li>
          <li><Link to="#" onClick={() => setActiveSection('inventory')}>Inventory</Link></li>
          <li><Link to="#" onClick={() => setActiveSection('transactions')}>Transactions</Link></li>
          <li><Link to="#" onClick={() => setActiveSection('supply_requests')}>Supply Requests</Link></li>
          <li><Link to="#" onClick={() => setActiveSection('reports')}>Reports</Link></li>
          <li><Link to="#" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  )
}

export default AdminDashboard