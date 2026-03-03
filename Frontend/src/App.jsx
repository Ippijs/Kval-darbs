import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Product from './pages/Product'
import Cart from './pages/Cart'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import HomeLanding from './pages/HomeLanding'
import { useAuth } from './api/useAuth'
import { useCart } from './api/useCart'
import './index.css'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [pageParams, setPageParams] = useState({})
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, login, logout } = useAuth()
  const { items, count, addItem, removeItem, clearCart } = useCart()

  const navigate = (page, params = {}) => {
    setCurrentPage(page)
    setPageParams(params)
    window.scrollTo(0, 0)
  }

  const handleLogout = async () => {
    await logout()
    navigate('home')
  }

  const handleLogin = async (username, password) => {
    const result = await login(username, password)
    if (result.success) {
      navigate('home')
    }
    return result
  }

  const handleAddToCart = (product, quantity) => {
    addItem(product, quantity)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return pageParams.showShop ? (
          <Home onNavigate={navigate} onAddToCart={handleAddToCart} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        ) : (
          <HomeLanding onNavigate={navigate} onAddToCart={handleAddToCart} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        )
      case 'product':
        return <Product productId={pageParams.id} onNavigate={navigate} onAddToCart={handleAddToCart} user={user} />
      case 'cart':
        return <Cart cartItems={items} onNavigate={navigate} onRemoveItem={removeItem} onClearCart={clearCart} />
      case 'about':
        return <About />
      case 'contact':
        return <Contact />
      case 'login':
        return <Login onNavigate={navigate} onLogin={handleLogin} />
      case 'register':
        return <Register onNavigate={navigate} onRegisterSuccess={() => navigate('login')} />
      case 'admin':
        return <Admin onNavigate={navigate} user={user} />
      default:
        return <HomeLanding onNavigate={navigate} onAddToCart={handleAddToCart} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    }
  }

  return (
    <>
      <Navbar
        user={user}
        cartCount={count}
        onLogout={handleLogout}
        onNavigate={navigate}
        onMenuToggle={() => setMenuOpen(!menuOpen)}
      />
      <div className="container">
        {renderPage()}
      </div>
    </>
  )
}
