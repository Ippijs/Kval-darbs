import { useState } from 'react'

export default function Navbar({ user, cartCount, onLogout, onNavigate, onMenuToggle }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen)
    if (onMenuToggle) {
      onMenuToggle()
    }
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <div className="hamburger-menu" onClick={handleMenuClick}>☰</div>
          <a className="logo" onClick={() => onNavigate('home')}>HOME</a>
          <a className="logo" onClick={() => onNavigate('home', { showShop: true })}>All Products</a>
        </div>
        <div className="nav-auth-buttons">
          {user ? (
            <>
              <span style={{marginRight: '1rem'}}>{user.username}</span>
              {user.is_admin && (
                <button className="btn-signup" onClick={() => onNavigate('admin')}>Admin</button>
              )}
              <button className="btn-signup" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn-signup" onClick={() => onNavigate('register')}>Sign Up</button>
              <button className="btn-login" onClick={() => onNavigate('login')}>Log In</button>
            </>
          )}
          <button className="btn btn-add-cart" onClick={() => onNavigate('cart')} style={{width: '120px', padding: '0.5rem'}}>
            Cart {cartCount > 0 && `(${cartCount})`}
          </button>
        </div>
      </div>
    </nav>
  )
}
