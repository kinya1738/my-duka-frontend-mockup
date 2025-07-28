import { useState, useEffect } from 'react'

function Reports() {
  const [reportType, setReportType] = useState('sales')
  const [reportData, setReportData] = useState([])
  const [error, setError] = useState('')
  const [timeFrame, setTimeFrame] = useState('daily')

  useEffect(() => {
    fetchReport()
  }, [reportType, timeFrame])

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/reports/${reportType}?type=${timeFrame}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || `Failed to fetch ${reportType} report`)
      setReportData(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const renderTableHeaders = () => {
    switch (reportType) {
      case 'sales':
        return (
          <tr>
            <th>Store</th>
            <th>Product</th>
            <th>Quantity Sold</th>
            <th>Total Revenue</th>
            <th>Date</th>
          </tr>
        )
      case 'stock':
        return (
          <tr>
            <th>Store</th>
            <th>Product</th>
            <th>Items in Stock</th>
          </tr>
        )
      case 'spoilt':
        return (
          <tr>
            <th>Store</th>
            <th>Product</th>
            <th>Items Spoilt</th>
          </tr>
        )
      case 'payment_status':
        return (
          <tr>
            <th>Store</th>
            <th>Product</th>
            <th>Quantity Received</th>
            <th>Payment Status</th>
          </tr>
        )
      default:
        return null
    }
  }

  const renderTableRows = () => {
    return reportData.map((item, index) => {
      switch (reportType) {
        case 'sales':
          return (
            <tr key={index}>
              <td>{item.store_name}</td>
              <td>{item.product_name}</td>
              <td>{item.quantity_sold}</td>
              <td>{item.total_revenue}</td>
              <td>{new Date(item.transaction_date).toLocaleDateString()}</td>
            </tr>
          )
        case 'stock':
          return (
            <tr key={index}>
              <td>{item.store_name}</td>
              <td>{item.product_name}</td>
              <td>{item.items_in_stock}</td>
            </tr>
          )
        case 'spoilt':
          return (
            <tr key={index}>
              <td>{item.store_name}</td>
              <td>{item.product_name}</td>
              <td>{item.items_spoilt}</td>
            </tr>
          )
        case 'payment_status':
          return (
            <tr key={index}>
              <td>{item.store_name}</td>
              <td>{item.product_name}</td>
              <td>{item.quantity_received}</td>
              <td>{item.payment_status ? 'Paid' : 'Unpaid'}</td>
            </tr>
          )
        default:
          return null
      }
    })
  }

  return (
    <div>
      <h2>Reports</h2>
      {error && <p className="error">{error}</p>}
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="report_type">Report Type</label>
          <select
            id="report_type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="sales">Sales</option>
            <option value="stock">Stock</option>
            <option value="spoilt">Spoilt Items</option>
            <option value="payment_status">Payment Status</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="time_frame">Time Frame</label>
          <select
            id="time_frame"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>{renderTableHeaders()}</thead>
          <tbody>{renderTableRows()}</tbody>
        </table>
      </div>
    </div>
  )
}

export default Reports