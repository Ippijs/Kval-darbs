import { useMemo, useState } from 'react'
import { cartAPI, ordersAPI } from '../../api/client'
import Alert from '../../components/Alert'
import { validateCheckoutDetails } from '../../utils/validation'

export default function Checkout({ cartItems, user, onNavigate, onClearCart, t }) {
  const [shippingDetails, setShippingDetails] = useState({
    receiptEmail: user?.email || '',
    country: '',
    firstName: '',
    lastName: '',
    addressLine: '',
    city: '',
    postalCode: '',
    phoneNumber: ''
  })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  // Computes checkout total from local cart state.
  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cartItems])

  // Synchronizes local cart rows to server-side cart before order creation.
  const syncServerCartFromLocal = async () => {
    const existingResponse = await cartAPI.getItems()
    const existingItems = Array.isArray(existingResponse.data?.items) ? existingResponse.data.items : []

    if (existingItems.length > 0) {
      await Promise.all(existingItems.map((item) => cartAPI.removeItem(item.id)))
    }

    await Promise.all(
      cartItems.map((item) => cartAPI.addItem(item.id, item.quantity))
    )
  }

  // Serializes shipping form fields into a single backend address string.
  const buildShippingAddress = () => [
    `Receipt email: ${shippingDetails.receiptEmail.trim()}`,
    `Country: ${shippingDetails.country.trim()}`,
    `Name: ${shippingDetails.firstName.trim()} ${shippingDetails.lastName.trim()}`,
    `Address: ${shippingDetails.addressLine.trim()}`,
    `City: ${shippingDetails.city.trim()}`,
    `Postal code: ${shippingDetails.postalCode.trim()}`,
    `Phone: ${shippingDetails.phoneNumber.trim()}`
  ].join(', ')

  // Updates one checkout field while preserving the rest of form state.
  const updateShippingField = (field, value) => {
    setShippingDetails((prev) => ({ ...prev, [field]: value }))
  }

  // Validates checkout input, syncs cart, and creates order.
  const handlePlaceOrder = async () => {
    const checkoutValidation = validateCheckoutDetails(shippingDetails)
    if (!checkoutValidation.valid) {
      const validationMessages = {
        email: t.invalidEmailMessage || 'Please enter a valid email address.',
        phone: t.invalidPhoneMessage || 'Please enter a valid phone number.'
      }

      setAlert({ type: 'warning', message: validationMessages[checkoutValidation.reason] || t.requiredFieldsMessage })
      return
    }

    setLoading(true)
    setAlert(null)

    const serializedShippingAddress = buildShippingAddress()

    try {
      await syncServerCartFromLocal()
      const response = await ordersAPI.create({
        shipping_address: serializedShippingAddress
      })

      if (response.data?.success) {
        onClearCart()
        setAlert({ type: 'success', message: `${t.orderCreated} #${response.data.order_id}` })
        setTimeout(() => onNavigate('home'), 1200)
      } else {
        setAlert({ type: 'error', message: response.data?.message || t.orderFailed })
      }
    } catch {
      setAlert({ type: 'error', message: t.orderFailed })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="cart-container">
        <h1>{t.checkoutTitle}</h1>
        <Alert type="warning" message={t.checkoutRequiresLogin} />
        <button className="btn btn-primary" onClick={() => onNavigate('login')}>
          {t.goToLogin}
        </button>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h1>{t.checkoutTitle}</h1>
        <Alert type="info" message={t.checkoutEmpty} />
        <button className="btn btn-secondary" onClick={() => onNavigate('cart')}>
          {t.backToCart}
        </button>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <h1>{t.checkoutTitle}</h1>

      <Alert type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

      <div className="cart-summary" style={{ maxWidth: '100%', marginLeft: 0, marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>{t.shippingAddress}</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>{t.receiptEmail}</label>
            <input
              type="email"
              autoComplete="email"
              aria-label={t.receiptEmail}
              value={shippingDetails.receiptEmail}
              onChange={(e) => updateShippingField('receiptEmail', e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.country}</label>
            <input
              type="text"
              autoComplete="country-name"
              aria-label={t.country}
              value={shippingDetails.country}
              onChange={(e) => updateShippingField('country', e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.firstName}</label>
            <input
              type="text"
              autoComplete="given-name"
              aria-label={t.firstName}
              value={shippingDetails.firstName}
              onChange={(e) => updateShippingField('firstName', e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.lastName}</label>
            <input
              type="text"
              autoComplete="family-name"
              aria-label={t.lastName}
              value={shippingDetails.lastName}
              onChange={(e) => updateShippingField('lastName', e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>{t.addressLine}</label>
            <input
              type="text"
              autoComplete="address-line1"
              aria-label={t.addressLine}
              value={shippingDetails.addressLine}
              onChange={(e) => updateShippingField('addressLine', e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.city}</label>
            <input
              type="text"
              autoComplete="address-level2"
              aria-label={t.city}
              value={shippingDetails.city}
              onChange={(e) => updateShippingField('city', e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.postalCode}</label>
            <input
              type="text"
              autoComplete="postal-code"
              aria-label={t.postalCode}
              value={shippingDetails.postalCode}
              onChange={(e) => updateShippingField('postalCode', e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.phoneNumber}</label>
            <input
              type="tel"
              autoComplete="tel"
              aria-label={t.phoneNumber}
              value={shippingDetails.phoneNumber}
              onChange={(e) => updateShippingField('phoneNumber', e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>
      </div>

      <div className="cart-summary" style={{ maxWidth: '100%', marginLeft: 0, marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>{t.orderSummary}</h2>
        {cartItems.map((item) => (
          <div key={item.id} className="summary-row">
            <span>{item.name} x {item.quantity}</span>
            <span>€{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="summary-row total">
          <span>{t.total}:</span>
          <span>€{total.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={handlePlaceOrder} disabled={loading}>
          {loading ? t.placingOrder : t.placeOrder}
        </button>
        <button className="btn btn-secondary" onClick={() => onNavigate('cart')} disabled={loading}>
          {t.backToCart}
        </button>
      </div>
    </div>
  )
}