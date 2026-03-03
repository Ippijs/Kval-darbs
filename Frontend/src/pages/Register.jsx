import { useState } from 'react'
import { authAPI } from '../api/client'
import Alert from '../components/Alert'

export default function Register({ onNavigate, onRegisterSuccess }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasSpecialChar = /[@!#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    const isLongEnough = password.length >= 8
    const noSpaces = password.trim() === password
    
    return {
      valid: hasUpperCase && hasSpecialChar && isLongEnough && noSpaces,
      hasUpperCase,
      hasSpecialChar,
      isLongEnough,
      noSpaces
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.valid) {
      let errors = []
      if (!passwordValidation.noSpaces) errors.push('Password cannot have leading or trailing spaces')
      if (!passwordValidation.isLongEnough) errors.push('Password must be at least 8 characters long')
      if (!passwordValidation.hasUpperCase) errors.push('Password must contain at least 1 uppercase letter')
      if (!passwordValidation.hasSpecialChar) errors.push('Password must contain at least 1 special character (@, !, #, $, etc.)')
      setAlert({ type: 'error', message: errors.join('. ') })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setAlert({ type: 'error', message: 'Passwords do not match' })
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.register(formData.username, formData.email, formData.password)
      if (response.data.success) {
        setAlert({ type: 'success', message: 'Registration successful! Redirecting to login...' })
        setTimeout(() => onNavigate('login'), 2000)
      } else {
        setAlert({ type: 'error', message: response.data.message })
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Registration failed' })
    } finally {
      setLoading(false)
    }
  }

  const passwordValidation = validatePassword(formData.password)

  return (
    <div style={{padding: '2rem', maxWidth: '500px', margin: '2rem auto'}}>
      <h1>Register</h1>
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
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <p style={{fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem'}}>
            Password must contain:
          </p>
          <ul style={{fontSize: '0.85rem', color: '#666', marginLeft: '1.5rem', marginBottom: '0.5rem'}}>
            <li style={{color: formData.password && passwordValidation.isLongEnough ? '#27ae60' : '#666'}}>At least 8 characters</li>
            <li style={{color: formData.password && passwordValidation.hasUpperCase ? '#27ae60' : '#666'}}>At least 1 uppercase letter (A-Z)</li>
            <li style={{color: formData.password && passwordValidation.hasSpecialChar ? '#27ae60' : '#666'}}>At least 1 special character (@, !, #, $, %, etc.)</li>
          </ul>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-add-cart" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p style={{marginTop: '1rem', textAlign: 'center'}}>
        Already have an account? <a onClick={() => onNavigate('login')} style={{color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold'}}>Login</a>
      </p>
    </div>
  )
}
