import { useState, useEffect } from 'react'

function SupplyRequests() {
  const [requests, setRequests] = useState([])
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [formData, setFormData] = useState({ product_id: '', store_id: '', quantity_requested: '', notes: '' })
  const [error, setError] = useState('')
  const userType = localStorage.getItem('user_type')

  useEffect(() => {
    fetchRequests()
    fetchProducts()
    fetchStores()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/supply-requests', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch requests')
      setRequests(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/product', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch products')
      setProducts(data)
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
      const response = await fetch('/api/supply-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          ...formData,
          quantity_requested: parseInt(formData.quantity_requested)
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to create request')
      setRequests([...requests, data])
      setFormData({ product_id: '', store_id: '', quantity_requested: '', notes: '' })
    } catch (err) {
      setError(err.message)
    }
  }

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`/api/supply-requests/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to approve request')
      setRequests(requests.map(req => req.id === id ? { ...req, status: 'Approved' } : req))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/supply-requests/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      })
      if (!response.ok) throw new Error('Failed to delete supply request')
      setRequests(requests.filter(req => req.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Manage Supply Requests</h2>
      {error && <p className="error">{error}</p>}
      {userType === 'clerk' && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="product_id">Product</label>
              <select
                id="product_id"
                value={formData.product_id}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                required
              >
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="store_id">Store</label>
              <select
                id="store_id"
                value={formData.store_id}
                onChange={(e) => setFormData({ ...formData, store_id: e.target.value })}
                required
              >
                <option value="">Select Store</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="quantity_requested">Quantity Requested</label>
              <input
                type="number"
                id="quantity_requested"
                value={formData.quantity_requested}
                onChange={(e) => setFormData({ ...formData, quantity_requested: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <input
                type="text"
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
            <button type="submit">Create Request</button>
          </form>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Store</th>
              <th>Quantity Requested</th>
              <th>Status</th>
              <th>Notes</th>
              {(userType === 'admin' || userType === 'merchant') && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td>{products.find(p => p.id === req.product_id)?.name}</td>
                <td>{stores.find(s => s.id === req.store_id)?.name}</td>
                <td>{req.quantity_requested}</td>
                <td>{req.status}</td>
                <td>{req.notes || '-'}</td>
                {(userType === 'admin' || userType === 'merchant') && (
                  <td className="action-buttons">
                    {userType === 'admin' && req.status === 'Pending' && (
                      <button className="btn btn-primary" onClick={() => handleApprove(req.id)}>Approve</button>
                    )}
                    {userType === 'merchant' && (
                      <button className="btn btn-danger" onClick={() => handleDelete(req.id)}>Delete</button>
                    )}
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

export default SupplyRequests