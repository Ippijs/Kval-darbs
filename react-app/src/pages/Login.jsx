import { useState } from 'react'
import Alert from '../components/Alert'

export default function Login({ onNavigate, onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await onLogin(formData.username, formData.password)
      if (result.success) {
        setAlert({ type: 'success', message: 'Login successful!' })
      } else {
        setAlert({ type: 'error', message: result.message || 'Login failed' })
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Login failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{padding: '2rem', maxWidth: '400px', margin: '2rem auto'}}>
      <h1>Login</h1>
      <Alert alert={alert} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-add-cart" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <p style={{marginTop: '1rem', textAlign: 'center'}}>
        Don't have an account? <a onClick={() => onNavigate('register')} style={{color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold'}}>Register</a>
      </p>
    </div>
  )
}
