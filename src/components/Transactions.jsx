import { useState, useEffect } from 'react'

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [formData, setFormData] = useState({ product_id: '', store_id: '', quantity_sold: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTransactions()
    fetchProducts()
    fetchStores()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch transactions')
      setTransactions(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products', {
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
      const response = await fetch('/api/stores', {
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
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          ...formData,
          quantity_sold: parseInt(formData.quantity_sold)
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to create transaction')
      setTransactions([...transactions, data])
      setFormData({ product_id: '', store_id: '', quantity_sold: '' })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Manage Transactions</h2>
      {error && <p className="error">{error}</p>}
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
            <label htmlFor="quantity_sold">Quantity Sold</label>
            <input
              type="number"
              id="quantity_sold"
              value={formData.quantity_sold}
              onChange={(e) => setFormData({ ...formData, quantity_sold: e.target.value })}
              required
            />
          </div>
          <button type="submit">Add Transaction</button>
        </form>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Store</th>
              <th>Quantity Sold</th>
              <th>Total Revenue</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(txn => (
              <tr key={txn.id}>
                <td>{products.find(p => p.id === txn.product_id)?.name}</td>
                <td>{stores.find(s => s.id === txn.store_id)?.name}</td>
                <td>{txn.quantity_sold}</td>
                <td>{txn.total_revenue}</td>
                <td>{new Date(txn.transaction_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Transactions