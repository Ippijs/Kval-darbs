import { useEffect, useState } from 'react'
import { authAPI } from '../../api/client'

// Profile page for updating account identity and optional password.
export default function Profile({ user, onNavigate, onUserUpdated, t }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  // Loads editable profile fields from current user state.
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        username: user.username || '',
        email: user.email || ''
      }))
    }
  }, [user])

  // Mirrors backend password policy for better UX.
  const validatePassword = (password) => {
    if (!password) {
      return { valid: true }
    }

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

  // Updates one profile form field.
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Saves profile changes and propagates refreshed user state.
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.valid) {
      const errors = []
      if (!passwordValidation.noSpaces) errors.push(t.passwordNoSpaces)
      if (!passwordValidation.isLongEnough) errors.push(t.atLeast8Characters)
      if (!passwordValidation.hasUpperCase) errors.push(t.atLeast1Uppercase)
      if (!passwordValidation.hasSpecialChar) errors.push(t.atLeast1Special)
      setMessageType('error')
      setMessage(errors.join('. '))
      setLoading(false)
      return
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessageType('error')
      setMessage(t.passwordMismatch)
      setLoading(false)
      return
    }

    try {
      const response = await authAPI.updateProfile(
        formData.username.trim(),
        formData.email.trim(),
        formData.password
      )

      if (response.data.success) {
        if (onUserUpdated && response.data.user) {
          onUserUpdated(response.data.user)
        }

        setMessageType('success')
        setMessage(response.data.message || t.profileUpdateSuccess)
        setFormData((prev) => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }))
      } else {
        setMessageType('error')
        setMessage(response.data.message || t.profileUpdateFailed)
      }
    } catch (error) {
      setMessageType('error')
      setMessage(t.profileUpdateFailed)
    } finally {
      setFormData((prev) => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }))
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="profile-page">
        <h1>{t.profileTitle}</h1>
        <p>{t.profileLoginRequired}</p>
        <button className="btn btn-add-cart" onClick={() => onNavigate('login')}>
          {t.profileGoLogin}
        </button>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <h1>{t.profileTitle}</h1>
      <p className="profile-subtitle">{t.profileSubtitle}</p>

      {message && <div className={`alert alert-${messageType}`}>{message}</div>}

      <form className="profile-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t.profileUsername}</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>{t.profileEmail}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>{t.profileNewPassword}</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>{t.profileConfirmPassword}</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            disabled={loading}
          />
        </div>

        <p className="profile-password-hint">{t.profilePasswordHint}</p>

        <div className="profile-row">
          <span className="profile-label">{t.profileRole}</span>
          <span className="profile-value">{user.is_admin ? t.profileRoleAdmin : t.profileRoleUser}</span>
        </div>

        <button type="submit" className="btn btn-add-cart" disabled={loading}>
          {loading ? t.profileSaving : t.profileSave}
        </button>
      </form>
    </div>
  )
}