import { useState, useEffect } from 'react'

function Admins() {
  const [admins, setAdmins] = useState([])
  const [stores, setStores] = useState([])
  const [formData, setFormData] = useState({ username: '', email: '', password: '', store_id: '' })
  const [error, setError] = useState('')
  const userType = localStorage.getItem('user_type')

  useEffect(() => {
    fetchAdmins()
    fetchStores()
  }, [])

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admins', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch admins')
      setAdmins(data)
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
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to create admin')
      setAdmins([...admins, data])
      setFormData({ username: '', email: '', password: '', store_id: '' })
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeactivate = async (id) => {
    try {
      const response = await fetch(`/api/admins/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ is_active: false })
      })
      if (!response.ok) throw new Error('Failed to deactivate admin')
      setAdmins(admins.map(admin => admin.id === id ? { ...admin, is_active: false } : admin))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/admins/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      })
      if (!response.ok) throw new Error('Failed to delete admin')
      setAdmins(admins.filter(admin => admin.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleAssignStore = async (adminId, storeId) => {
    try {
      const response = await fetch(`/api/admins/${adminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ store_id: storeId || 0 })
      })
      if (!response.ok) throw new Error('Failed to assign/unassign store')
      setAdmins(admins.map(admin => admin.id === adminId ? { ...admin, store_id: storeId || 0 } : admin))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Manage Admins</h2>
      {error && <p className="error">{error}</p>}
      {userType === 'merchant' && (
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
            <button type="submit">Create Admin</button>
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
              <th>Status</th>
              {userType === 'merchant' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id}>
                <td>{admin.username}</td>
                <td>{admin.email}</td>
                <td>{stores.find(s => s.id === admin.store_id)?.name || '-'}</td>
                <td>{admin.is_active ? 'Active' : 'Inactive'}</td>
                {userType === 'merchant' && (
                  <td className="action-buttons">
                    <button className="btn btn-warning" onClick={() => handleDeactivate(admin.id)}>Deactivate</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(admin.id)}>Delete</button>
                    <select
                      onChange={(e) => handleAssignStore(admin.id, e.target.value)}
                      value={admin.store_id || ''}
                    >
                      <option value="0">Unassign Store</option>
                      {stores.map(store => (
                        <option key={store.id} value={store.id}>{store.name}</option>
                      ))}
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Admins