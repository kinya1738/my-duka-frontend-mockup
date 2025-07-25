import { useState, useEffect } from 'react'

function Inventory() {
  const [inventory, setInventory] = useState([])
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [formData, setFormData] = useState({
    product_id: '',
    store_id: '',
    quantity_received: '',
    items_in_stock: '',
    items_spoilt: '',
    payment_status: false
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchInventory()
    fetchProducts()
    fetchStores()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/inventory', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch inventory')
      setInventory(data)
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
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          ...formData,
          quantity_received: parseInt(formData.quantity_received),
          items_in_stock: parseInt(formData.items_in_stock),
          items_spoilt: parseInt(formData.items_spoilt)
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to create inventory record')
      setInventory([...inventory, data])
      setFormData({
        product_id: '',
        store_id: '',
        quantity_received: '',
        items_in_stock: '',
        items_spoilt: '',
        payment_status: false
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Manage Inventory</h2>
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
            <label htmlFor="quantity_received">Quantity Received</label>
            <input
              type="number"
              id="quantity_received"
              value={formData.quantity_received}
              onChange={(e) => setFormData({ ...formData, quantity_received: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="items_in_stock">Items in Stock</label>
            <input
              type="number"
              id="items_in_stock"
              value={formData.items_in_stock}
              onChange={(e) => setFormData({ ...formData, items_in_stock: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="items_spoilt">Items Spoilt</label>
            <input
              type="number"
              id="items_spoilt"
              value={formData.items_spoilt}
              onChange={(e) => setFormData({ ...formData, items_spoilt: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="payment_status">Payment Status</label>
            <input
              type="checkbox"
              id="payment_status"
              checked={formData.payment_status}
              onChange={(e) => setFormData({ ...formData, payment_status: e.target.checked })}
            />
          </div>
          <button type="submit">Add Inventory Record</button>
        </form>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Store</th>
              <th>Quantity Received</th>
              <th>Items in Stock</th>
              <th>Items Spoilt</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(record => (
              <tr key={record.id}>
                <td>{products.find(p => p.id === record.product_id)?.name}</td>
                <td>{stores.find(s => s.id === record.store_id)?.name}</td>
                <td>{record.quantity_received}</td>
                <td>{record.items_in_stock}</td>
                <td>{record.items_spoilt}</td>
                <td>{record.payment_status ? 'Paid' : 'Unpaid'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Inventory