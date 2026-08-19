// Displays current cart rows and checkout actions.
export default function Cart({ cartItems, onNavigate, onRemoveItem, onClearCart, t }) {
  // Computes cart total for summary rows.
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <h2>{t.cartEmptyTitle}</h2>
          <p>{t.cartEmptyText}</p>
          <button className="btn btn-primary" onClick={() => onNavigate('home')}>
            {t.continueShopping}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <h1>{t.shoppingCart}</h1>

      <table className="cart-table">
        <thead>
          <tr>
            <th>{t.product}</th>
            <th>{t.price}</th>
            <th>{t.quantity}</th>
            <th>{t.total}</th>
            <th>{t.action}</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id}>
              <td data-label={t.product}>{item.name}</td>
              <td data-label={t.price}>€{item.price}</td>
              <td data-label={t.quantity}>{item.quantity}</td>
              <td data-label={t.total}>€{(item.price * item.quantity).toFixed(2)}</td>
              <td data-label={t.action}>
                <button
                  className="btn btn-danger"
                  onClick={() => onRemoveItem(item.id)}
                >
                  {t.remove}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-summary">
        <div className="summary-row">
          <span>{t.subtotal}:</span>
          <span>€{total.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>{t.shipping}:</span>
          <span>{t.free}</span>
        </div>
        <div className="summary-row total">
          <span>{t.total}:</span>
          <span>€{total.toFixed(2)}</span>
        </div>
        <button
          className="btn btn-primary"
          style={{width: '100%', marginTop: '1rem'}}
          onClick={() => onNavigate('checkout')}
        >
          {t.proceedToCheckout}
        </button>
        <button
          className="btn btn-secondary"
          style={{width: '100%', marginTop: '0.5rem'}}
          onClick={() => onNavigate('home')}
        >
          {t.continueShopping}
        </button>
      </div>
    </div>
  )
}