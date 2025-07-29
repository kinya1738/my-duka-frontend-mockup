import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Stores from './Stores.jsx'
import Products from './Products.jsx'
import Inventory from './Inventory.jsx'
import Transactions from './Transactions.jsx'
import SupplyRequests from './SupplyRequests.jsx'
import Admins from './Admins.jsx'
import Clerks from './Clerks.jsx'
import Reports from './Reports.jsx'

function MerchantDashboard() {
  const [activeSection, setActiveSection] = useState('overview')
  const navigate = useNavigate()

  useEffect(() => {
    const userType = localStorage.getItem('user_type')
    if (userType !== 'merchant') {
      navigate('/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_type')
    navigate('/login')
  }

  const handleInviteAdmin = async () => {
    const email = prompt('Enter admin email:');
    if (!email) return;
    try {
      const response = await fetch('/api/auth/invite-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ email })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to send invitation')
      alert(`Invitation sent: ${data.invitation_link}`)
    } catch (err) {
      alert(err.message)
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'stores':
        return <Stores />
      case 'products':
        return <Products />
      case 'inventory':
        return <Inventory />
      case 'transactions':
        return <Transactions />
      case 'supply_requests':
        return <SupplyRequests />
      case 'admins':
        return <Admins />
      case 'clerks':
        return <Clerks />
      case 'reports':
        return <Reports />
      default:
        return <h2>Merchant Dashboard Overview</h2>
    }
  }

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>MyDuka Merchant Dashboard</h2>
        <ul>
          <li><Link to="#" onClick={() => setActiveSection('stores')}>Stores</Link></li>
          <li><Link to="#" onClick={() => setActiveSection('products')}>Products</Link></li>
          <li><Link to="#" onClick={() => setActiveSection('admins')}>Admins</Link></li>
          <li><Link to="#" onClick={() => setActiveSection('clerks')}>Clerks</Link></li>
          <li><Link to="#" onClick={() => setActiveSection('inventory')}>Inventory</Link></li>
          <li><Link to="#" onClick={() => setActiveSection('transactions')}>Transactions</Link></li>
          <li><Link to="#" onClick={() => setActiveSection('supply_requests')}>Supply Requests</Link></li>
          <li><Link to="#" onClick={() => setActiveSection('reports')}>Reports</Link></li>
          <li><Link to="#" onClick={handleInviteAdmin}>Invite Admin</Link></li>
          <li><Link to="#" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  )
}

export default MerchantDashboard