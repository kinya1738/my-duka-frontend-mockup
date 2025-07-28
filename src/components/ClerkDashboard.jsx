import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Inventory from './Inventory.jsx'
import Transactions from './Transactions.jsx'
import SupplyRequests from './SupplyRequests.jsx'
import Profile from './Profile.jsx'

function ClerkDashboard() {
  const [activeSection, setActiveSection] = useState('overview')
  const navigate = useNavigate()

  useEffect(() => {
    const userType = localStorage.getItem('user_type')
    if (userType !== 'clerk') {
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
      case 'inventory':
        return <Inventory />
      case 'transactions':
        return <Transactions />
      case 'supply_requests':
        return <SupplyRequests />
      case 'profile':
        return <Profile />
      default:
        return <h2>Clerk Dashboard Overview</h2>
    }
  }

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>MyDuka Clerk Dashboard</h2>
        <ul>
          <li><Link to="#" onClick={() => setActiveSection('profile')}>Profile</Link></li>
          <li><Link to="#" onClick={() => setActiveSection('inventory')}>Inventory</Link></li>
          <li><Link to="#" onClick={() => setActiveSection('transactions')}>Transactions</Link></li>
          <li><Link to="#" onClick={() => setActiveSection('supply_requests')}>Supply Requests</Link></li>
          <li><Link to="#" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  )
}

export default ClerkDashboard