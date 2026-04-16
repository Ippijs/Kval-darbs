import { useState } from 'react'
import { authAPI } from '../api/client'
import Alert from '../components/Alert'

export default function Register({ onNavigate, onRegisterSuccess, t }) {
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
      if (!passwordValidation.noSpaces) errors.push(t.passwordNoSpaces)
      if (!passwordValidation.isLongEnough) errors.push(t.atLeast8Characters)
      if (!passwordValidation.hasUpperCase) errors.push(t.atLeast1Uppercase)
      if (!passwordValidation.hasSpecialChar) errors.push(t.atLeast1Special)
      setAlert({ type: 'error', message: errors.join('. ') })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setAlert({ type: 'error', message: t.passwordMismatch })
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.register(formData.username, formData.email, formData.password)
      if (response.data.success) {
        setAlert({ type: 'success', message: t.registrationSuccess })
        setTimeout(() => onNavigate('login'), 2000)
      } else {
        setAlert({ type: 'error', message: response.data.message })
      }
    } catch (error) {
      setAlert({ type: 'error', message: t.registrationFailed })
    } finally {
      setLoading(false)
    }
  }

  const passwordValidation = validatePassword(formData.password)

  return (
    <div style={{padding: '2rem', maxWidth: '500px', margin: '2rem auto'}}>
      <h1>{t.registerTitle}</h1>
      <Alert alert={alert} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t.username}</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t.email}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>{t.password}</label>
          <p style={{fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem'}}>
            {t.passwordMustContain}
          </p>
          <ul style={{fontSize: '0.85rem', color: '#666', marginLeft: '1.5rem', marginBottom: '0.5rem'}}>
            <li style={{color: formData.password && passwordValidation.isLongEnough ? '#27ae60' : '#666'}}>{t.atLeast8Characters}</li>
            <li style={{color: formData.password && passwordValidation.hasUpperCase ? '#27ae60' : '#666'}}>{t.atLeast1Uppercase}</li>
            <li style={{color: formData.password && passwordValidation.hasSpecialChar ? '#27ae60' : '#666'}}>{t.atLeast1Special}</li>
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
          <label>{t.confirmPassword}</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-add-cart" disabled={loading}>
          {loading ? t.registering : t.register}
        </button>
      </form>
      <p style={{marginTop: '1rem', textAlign: 'center'}}>
        {t.alreadyHaveAccount} <a onClick={() => onNavigate('login')} style={{color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold'}}>{t.login}</a>
      </p>
    </div>
  )
}
