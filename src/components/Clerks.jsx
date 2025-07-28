import { useState, useEffect } from 'react'

function Clerks() {
  const [clerks, setClerks] = useState([])
  const [stores, setStores] = useState([])
  const [formData, setFormData] = useState({ username: '', email: '', password: '', store_id: '' })
  const [error, setError] = useState('')
  const userType = localStorage.getItem('user_type')

  useEffect(() => {
    fetchClerks()
    fetchStores()
  }, [])

  const fetchClerks = async () => {
    try {
      const response = await fetch('/api/clerk', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch clerks')
      setClerks(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/store', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch stores')
      setStores(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/clerk/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to create clerk')
      setClerks([...clerks, data])
      setFormData({ username: '', email: '', password: '', store_id: '' })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Manage Clerks</h2>
      {error && <p className="error">{error}</p>}
      {userType === 'admin' && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="store_id">Store</label>
              <select
                id="store_id"
                value={formData.store_id}
                onChange={(e) => setFormData({ ...formData, store_id: e.target.value })}
              >
                <option value="">Select Store (Optional)</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>
            <button type="submit">Create Clerk</button>
          </form>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Store</th>
            </tr>
          </thead>
          <tbody>
            {clerks.map(clerk => (
              <tr key={clerk.id}>
                <td>{clerk.username}</td>
                <td>{clerk.email}</td>
                <td>{stores.find(s => s.id === clerk.store_id)?.name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Clerks