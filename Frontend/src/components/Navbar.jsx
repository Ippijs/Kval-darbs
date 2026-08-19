// Top navigation with auth actions and cart entry point.
export default function Navbar({ user, cartCount, onLogout, onNavigate, t }) {
  const goTo = (page, params = {}) => onNavigate(page, params)
  const handleNavClick = (e, page, params = {}) => {
    e.preventDefault()
    goTo(page, params)
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
            <a className="logo" onClick={(e) => handleNavClick(e, 'home')}>{t.navHome}</a>
            <a className="logo" onClick={(e) => handleNavClick(e, 'home', { showShop: true })}>{t.navAllProducts}</a>
        </div>
        <div className="nav-auth-buttons">
          {user ? (
            <>
              <button
                className="account-link"
                type="button"
                onClick={() => goTo('profile')}
                title={t.navProfile}
              >
                {user.username}
              </button>
              {user.is_admin && (
                    <button className="btn-signup" onClick={() => goTo('admin')}>{t.navAdmin}</button>
              )}
                  <button className="btn-signup" onClick={onLogout}>{t.navLogout}</button>
            </>
          ) : (
            <>
                  <button className="btn-signup" onClick={() => goTo('register')}>{t.navSignUp}</button>
                  <button className="btn-login" onClick={() => goTo('login')}>{t.navLogIn}</button>
            </>
          )}
          <button className="btn btn-add-cart nav-cart-btn" onClick={() => goTo('cart')}>
                {t.navCart} {cartCount > 0 && `(${cartCount})`}
          </button>
        </div>
      </div>
    </nav>
  )
}
