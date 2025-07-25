import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Stores from './Stores.jsx'
import Products from './Products.jsx'
import Inventory from './Inventory.jsx'
import Transactions from './Transactions.jsx'
import SupplyRequests from './SupplyRequests.jsx'
import Admins from './Admins.jsx'
import Clerks from './Clerks.jsx'

function Dashboard() {
  const [userType, setUserType] = useState('')
  const [activeSection, setActiveSection] = useState('overview')
  const navigate = useNavigate()

  useEffect(() => {
    const type = localStorage.getItem('user_type')
    setUserType(type)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_type')
    navigate('/login')
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
      default:
        return <h2>Dashboard Overview</h2>
    }
  }

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>MyDuka Dashboard</h2>
        <ul>
          {userType === 'merchant' && (
            <>
              <li><Link to="#" onClick={() => setActiveSection('stores')}>Stores</Link></li>
              <li><Link to="#" onClick={() => setActiveSection('products')}>Products</Link></li>
              <li><Link to="#" onClick={() => setActiveSection('admins')}>Admins</Link></li>
            </>
          )}
          {(userType === 'merchant' || userType === 'admin') && (
            <li><Link to="#" onClick={() => setActiveSection('clerks')}>Clerks</Link></li>
          )}
          {(userType === 'admin' || userType === 'clerk') && (
            <>
              <li><Link to="#" onClick={() => setActiveSection('inventory')}>Inventory</Link></li>
              <li><Link to="#" onClick={() => setActiveSection('transactions')}>Transactions</Link></li>
              <li><Link to="#" onClick={() => setActiveSection('supply_requests')}>Supply Requests</Link></li>
            </>
          )}
          <li><Link to="#" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  )
}

export default Dashboard