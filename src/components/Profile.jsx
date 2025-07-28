import { useState, useEffect } from 'react'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const userType = localStorage.getItem('user_type')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch profile')
      setProfile(data)
    } catch (err) {
      setError(err.message)
    }
  }

  if (error) {
    return <p className="error">{error}</p>
  }

  if (!profile) {
    return <p>Loading profile...</p>
  }

  return (
    <div>
      <h2>User Profile</h2>
      <div className="form-container">
        <div className="form-group">
          <label>Username</label>
          <p>{profile.username}</p>
        </div>
        <div className="form-group">
          <label>Email</label>
          <p>{profile.email}</p>
        </div>
        <div className="form-group">
          <label>Role</label>
          <p>{userType.charAt(0).toUpperCase() + userType.slice(1)}</p>
        </div>
        {profile.store_id && (
          <div className="form-group">
            <label>Store</label>
            <p>{profile.store_name || 'N/A'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile