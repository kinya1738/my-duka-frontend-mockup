import { useState, useEffect } from 'react'

function Products() {
  const [products, setProducts] = useState([])
  const [formData, setFormData] = useState({ name: '', description: '', buying_price: '', selling_price: '' })
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const userType = localStorage.getItem('user_type')

  useEffect(() => {
    fetchProducts()
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editId ? `/api/product/${editId}` : '/api/product'
      const method = editId ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          ...formData,
          buying_price: parseFloat(formData.buying_price),
          selling_price: parseFloat(formData.selling_price)
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || `Failed to ${editId ? 'update' : 'create'} product`)
      if (editId) {
        setProducts(products.map(product => product.id === editId ? data : product))
        setEditId(null)
      } else {
        setProducts([...products, data])
      }
      setFormData({ name: '', description: '', buying_price: '', selling_price: '' })
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (product) => {
    setEditId(product.id)
    setFormData({
      name: product.name,
      description: product.description || '',
      buying_price: product.buying_price,
      selling_price: product.selling_price
    })
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/product/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      })
      if (!response.ok) throw new Error('Failed to delete product')
      setProducts(products.filter(product => product.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Manage Products</h2>
      {error && <p className="error">{error}</p>}
      {(userType === 'merchant' || userType === 'admin') && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="buying_price">Buying Price</label>
              <input
                type="number"
                id="buying_price"
                value={formData.buying_price}
                onChange={(e) => setFormData({ ...formData, buying_price: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="selling_price">Selling Price</label>
              <input
                type="number"
                id="selling_price"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                required
              />
            </div>
            <button type="submit">{editId ? 'Update Product' : 'Create Product'}</button>
          </form>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Buying Price</th>
              <th>Selling Price</th>
              {(userType === 'merchant' || userType === 'admin') && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description || '-'}</td>
                <td>{product.buying_price}</td>
                <td>{product.selling_price}</td>
                {(userType === 'merchant' || userType === 'admin') && (
                  <td className="action-buttons">
                    <button className="btn btn-primary" onClick={() => handleEdit(product)}>Edit</button>
                    {userType === 'merchant' && (
                      <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>Delete</button>
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

export default Products