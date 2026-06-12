import { useRef, useState } from 'react'
import Alert from '../../components/Alert'

export default function Login({ onNavigate, onLogin, t }) {
  const [formData, setFormData] = useState({ username: '' })
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)
  const passwordRef = useRef(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const password = passwordRef.current?.value || ''

    try {
      const result = await onLogin(formData.username, password)
      if (result.success) {
        setAlert({ type: 'success', message: t.loginSuccess })
      } else {
        setAlert({ type: 'error', message: result.message || t.loginFailed })
      }
    } catch (error) {
      setAlert({ type: 'error', message: t.loginFailed })
    } finally {
      if (passwordRef.current) {
        passwordRef.current.value = ''
      }
      setLoading(false)
    }
  }

  return (
    <div style={{padding: '2rem', maxWidth: '400px', margin: '2rem auto'}}>
      <h1>{t.login}</h1>
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
          <label>{t.password}</label>
          <input
            type="password"
            name="password"
            ref={passwordRef}
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" className="btn btn-add-cart" disabled={loading}>
          {loading ? t.loggingIn : t.navLogIn}
        </button>
      </form>
      <p style={{marginTop: '1rem', textAlign: 'center'}}>
        {t.dontHaveAccount} <button type="button" onClick={() => onNavigate('register')} style={{color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold', background: 'none', border: 'none', padding: 0}}>{t.register}</button>
      </p>
    </div>
  )
}