export default function Navbar({ user, cartCount, onLogout, onNavigate, t }) {

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
              <a className="logo" onClick={(e) => { e.preventDefault(); onNavigate('home') }}>{t.navHome}</a>
              <a className="logo" onClick={(e) => { e.preventDefault(); onNavigate('home', { showShop: true }) }}>{t.navAllProducts}</a>
        </div>
        <div className="nav-auth-buttons">
          {user ? (
            <>
              <button
                className="account-link"
                type="button"
                onClick={() => onNavigate('profile')}
                title={t.navProfile}
              >
                {user.username}
              </button>
              {user.is_admin && (
                    <button className="btn-signup" onClick={() => onNavigate('admin')}>{t.navAdmin}</button>
              )}
                  <button className="btn-signup" onClick={onLogout}>{t.navLogout}</button>
            </>
          ) : (
            <>
                  <button className="btn-signup" onClick={() => onNavigate('register')}>{t.navSignUp}</button>
                  <button className="btn-login" onClick={() => onNavigate('login')}>{t.navLogIn}</button>
            </>
          )}
          <button className="btn btn-add-cart nav-cart-btn" onClick={() => onNavigate('cart')}>
                {t.navCart} {cartCount > 0 && `(${cartCount})`}
          </button>
        </div>
      </div>
    </nav>
  )
}
