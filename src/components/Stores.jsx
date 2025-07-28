import { useState, useEffect } from 'react'

function Stores() {
  const [stores, setStores] = useState([])
  const [formData, setFormData] = useState({ name: '', location: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStores()
  }, [])

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
      const response = await fetch('/api/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to create store')
      setStores([...stores, data])
      setFormData({ name: '', location: '' })
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeactivate = async (id) => {
    try {
      const response = await fetch(`/api/store/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ is_active: false })
      })
      if (!response.ok) throw new Error('Failed to deactivate store')
      setStores(stores.map(store => store.id === id ? { ...store, is_active: false } : store))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/store/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      })
      if (!response.ok) throw new Error('Failed to delete store')
      setStores(stores.filter(store => store.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Manage Stores</h2>
      {error && <p className="error">{error}</p>}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Store Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>
          <button type="submit">Create Store</button>
        </form>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.location}</td>
                <td>{store.is_active ? 'Active' : 'Inactive'}</td>
                <td className="action-buttons">
                  <button className="btn btn-warning" onClick={() => handleDeactivate(store.id)}>Deactivate</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(store.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Stores