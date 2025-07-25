import { Link } from 'react-router-dom'

function App() {
  return (
    <div
      className="landing"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1549479732-ee0adb0f5d32?q=80&w=1113&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      }}
    >
      <div className="landing-overlay">
        <h1>Welcome to MyDuka App</h1>
        <p>Your Home for Inventory Keeping and Report Generation & Visualization</p>
        <div className="button-container">
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
          <Link to="/register" className="btn btn-secondary">
            Register
          </Link>
          <Link to="/register-merchant" className="btn btn-success">
            Register as Merchant
          </Link>
        </div>
      </div>
    </div>
  )
}

export default App