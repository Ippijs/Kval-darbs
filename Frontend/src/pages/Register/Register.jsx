import { useState } from 'react'
import { authAPI } from '../../api/client'
import Alert from '../../components/Alert'
import { isStrongPassword } from '../../utils/validation'

// Registration form with client-side password policy checks.
export default function Register({ onNavigate, onRegisterSuccess, t }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  // Updates registration form fields.
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Validates and submits registration request.
  const handleSubmit = async (e) => {
    e.preventDefault()

    const passwordValidation = isStrongPassword(formData.password)
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
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }))
      setLoading(false)
    }
  }

  const passwordValidationState = isStrongPassword(formData.password)

  return (
    <div style={{padding: '2rem', maxWidth: '500px', margin: '2rem auto'}}>
      <h1>{t.registerTitle}</h1>
      <Alert type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t.username}</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            spellCheck="false"
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
            autoComplete="email"
            required
          />
        </div>
        <div className="form-group">
          <label>{t.password}</label>
          <p style={{fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem'}}>
            {t.passwordMustContain}
          </p>
          <ul style={{fontSize: '0.85rem', color: '#666', marginLeft: '1.5rem', marginBottom: '0.5rem'}}>
            <li style={{color: formData.password && passwordValidationState.isLongEnough ? '#27ae60' : '#666'}}>{t.atLeast8Characters}</li>
            <li style={{color: formData.password && passwordValidationState.hasUpperCase ? '#27ae60' : '#666'}}>{t.atLeast1Uppercase}</li>
            <li style={{color: formData.password && passwordValidationState.hasSpecialChar ? '#27ae60' : '#666'}}>{t.atLeast1Special}</li>
          </ul>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
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
            autoComplete="new-password"
            required
          />
        </div>
        <button type="submit" className="btn btn-add-cart" disabled={loading}>
          {loading ? t.registering : t.register}
        </button>
      </form>
      <p style={{marginTop: '1rem', textAlign: 'center'}}>
        {t.alreadyHaveAccount} <button type="button" onClick={() => onNavigate('login')} style={{color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold', background: 'none', border: 'none', padding: 0}}>{t.login}</button>
      </p>
    </div>
  )
}