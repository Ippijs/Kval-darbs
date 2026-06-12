import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { isValidEmail } from '../../utils/validation'
import './Contact.css'

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export default function Contact({ t }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = formData.name.trim()
    const email = formData.email.trim()
    const message = formData.message.trim()

    if (!name || !email || !message) {
      setError(t.requiredFieldsMessage || 'Please fill in all required fields.')
      return
    }

    if (!isValidEmail(email)) {
      setError(t.invalidEmailMessage || 'Please enter a valid email address.')
      return
    }

    if (message.length < 10) {
      setError(t.messageTooShort || 'Message is too short.')
      return
    }

    setLoading(true)
    setError(null)

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setError('Email service is not configured. Please set EmailJS environment variables.')
      setLoading(false)
      return
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: name,
          from_email: email,
          message
        },
        {
          publicKey: EMAILJS_PUBLIC_KEY
        }
      )

      setSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(t.sendFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>{t.contactUs}</h1>
        <p className="contact-subtitle">{t.contactSubtitle}</p>

        {submitted && (
          <div className="alert alert-success">
            {t.thankYouMessage}
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>{t.name}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              aria-label={t.name}
              autoComplete="name"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>{t.email}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              aria-label={t.email}
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>{t.message}</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              aria-label={t.message}
              minLength={10}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn btn-add-cart" disabled={loading}>
            {loading ? t.sending : t.sendMessage}
          </button>
        </form>
      </div>
    </div>
  )
}