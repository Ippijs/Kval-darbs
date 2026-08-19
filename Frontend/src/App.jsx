import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home/Home'
import Product from './pages/Product/Product'
import Cart from './pages/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Admin from './pages/Admin/Admin'
import Profile from './pages/Profile/Profile'
import HomeLanding from './pages/HomeLanding/HomeLanding'
import { useAuth } from './api/useAuth'
import { useCart } from './api/useCart'
import './index.css'
import strings from './strings'

// Client-side routes supported by this SPA.
const VALID_PAGES = new Set(['home', 'product', 'cart', 'checkout', 'about', 'contact', 'login', 'register', 'admin', 'profile'])

// Parses current URL into app page state and params.
const getRouteFromUrl = () => {
  const path = (window.location.pathname || '/').replace(/\/+$/, '') || '/'
  const search = new URLSearchParams(window.location.search)

  if (path === '/') return { page: 'home', params: { showShop: false } }
  if (path === '/shop') {
    const category = search.get('category')
    const params = { showShop: true }
    if (category) params.category = category
    return { page: 'home', params }
  }
  if (path === '/cart') return { page: 'cart', params: {} }
  if (path === '/checkout') return { page: 'checkout', params: {} }
  if (path === '/about') return { page: 'about', params: {} }
  if (path === '/contact') return { page: 'contact', params: {} }
  if (path === '/login') return { page: 'login', params: {} }
  if (path === '/register') return { page: 'register', params: {} }
  if (path === '/admin') return { page: 'admin', params: {} }
  if (path === '/profile') return { page: 'profile', params: {} }

  const productMatch = path.match(/^\/product\/(\d+)$/)
  if (productMatch) {
    return { page: 'product', params: { id: parseInt(productMatch[1], 10) } }
  }

  // Backward-compatible fallback for existing query links
  const page = search.get('page')
  const safePage = VALID_PAGES.has(page) ? page : 'home'
  const params = {}

  if (safePage === 'product') {
    const id = parseInt(search.get('id') || '0', 10)
    if (id > 0) params.id = id
  }

  if (safePage === 'home') {
    params.showShop = search.get('showShop') === '1'
    const category = search.get('category')
    if (category) params.category = category
  }

  return { page: safePage, params }
}

// Builds a URL path from app page state and params.
const buildUrlFromRoute = (page, params = {}) => {
  if (page === 'home' && params.showShop) {
    if (params.category) {
      return `/shop?category=${encodeURIComponent(params.category)}`
    }
    return '/shop'
  }
  if (page === 'home') return '/'
  if (page === 'product' && params.id) return `/product/${params.id}`
  if (page === 'cart') return '/cart'
  if (page === 'checkout') return '/checkout'
  if (page === 'about') return '/about'
  if (page === 'contact') return '/contact'
  if (page === 'login') return '/login'
  if (page === 'register') return '/register'
  if (page === 'admin') return '/admin'
  if (page === 'profile') return '/profile'
  return '/'
}

const WEATHER_CONSENT_COOKIE = 'weather_consent'

// Reads weather consent from cookies.
const getWeatherConsent = () => {
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${WEATHER_CONSENT_COOKIE}=`))

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : 'unset'
}

// Stores weather consent in a long-lived cookie.
const setWeatherConsentCookie = (value) => {
  const expires = new Date()
  expires.setDate(expires.getDate() + 180)
  document.cookie = `${WEATHER_CONSENT_COOKIE}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
}

export default function App() {
  const initialRoute = getRouteFromUrl()
  const [currentPage, setCurrentPage] = useState(initialRoute.page)
  const [pageParams, setPageParams] = useState(initialRoute.params)
  const [menuOpen, setMenuOpen] = useState(false)
  // no language state — app is English-only
  const [weatherConsent, setWeatherConsent] = useState('unset')
  const { user, login, logout, setCurrentUser } = useAuth()
  const { items, count, addItem, removeItem, clearCart } = useCart()
  const t = strings

  // Initializes consent state from persisted cookie.
  useEffect(() => {
    const consent = getWeatherConsent()
    if (consent === 'accepted' || consent === 'declined') {
      setWeatherConsent(consent)
      return
    }

    setWeatherConsent('unset')
  }, [])

  // language is always English now

  // Normalizes URL once on initial load.
  useEffect(() => {
    const normalizedUrl = buildUrlFromRoute(currentPage, pageParams)
    window.history.replaceState({ page: currentPage, params: pageParams }, '', normalizedUrl)
  }, [])

  // Syncs app state with browser back/forward navigation.
  useEffect(() => {
    const handlePopState = () => {
      const route = getRouteFromUrl()
      setCurrentPage(route.page)
      setPageParams(route.params)
      window.scrollTo(0, 0)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Central page navigation helper used by components.
  const navigate = (page, params = {}, options = {}) => {
    const { replace = false, skipHistory = false } = options
    setCurrentPage(page)
    setPageParams(params)

    if (!skipHistory) {
      const nextUrl = buildUrlFromRoute(page, params)
      if (replace) {
        window.history.replaceState({ page, params }, '', nextUrl)
      } else {
        window.history.pushState({ page, params }, '', nextUrl)
      }
    }

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

  const handleWeatherConsent = (status) => {
    setWeatherConsentCookie(status)
    setWeatherConsent(status)
  }

  // Resolves the active page component by route state.
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return pageParams.showShop ? (
          <Home
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            initialCategory={pageParams.category || null}
            t={t}
          />
        ) : (
          <HomeLanding
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            weatherConsent={weatherConsent}
            t={t}
          />
        )
      case 'product':
        return <Product productId={pageParams.id} onNavigate={navigate} onAddToCart={handleAddToCart} user={user} t={t} />
      case 'cart':
        return <Cart cartItems={items} onNavigate={navigate} onRemoveItem={removeItem} onClearCart={clearCart} t={t} />
      case 'checkout':
        return <Checkout cartItems={items} user={user} onNavigate={navigate} onClearCart={clearCart} t={t} />
      case 'about':
        return <About t={t} />
      case 'contact':
        return <Contact t={t} />
      case 'login':
        return <Login onNavigate={navigate} onLogin={handleLogin} t={t} />
      case 'register':
        return <Register onNavigate={navigate} onRegisterSuccess={() => navigate('login')} t={t} />
      case 'admin':
        return <Admin onNavigate={navigate} user={user} t={t} />
      case 'profile':
        return <Profile user={user} onNavigate={navigate} onUserUpdated={setCurrentUser} t={t} />
      default:
        return (
          <HomeLanding
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            weatherConsent={weatherConsent}
            t={t}
          />
        )
    }
  }

  return (
    <>
      <Navbar
        user={user}
        cartCount={count}
        onLogout={handleLogout}
        onNavigate={navigate}
        t={t}
      />

      {weatherConsent === 'unset' && (
        <div className="weather-consent-popup" role="dialog" aria-modal="true">
          <div className="weather-consent-modal">
            <h2>{t.weatherConsentTitle}</h2>
            <p>
              {t.weatherConsentText}
            </p>
            <div className="weather-consent-actions">
              <button className="btn btn-primary" onClick={() => handleWeatherConsent('accepted')}>
                {t.allow}
              </button>
              <button className="btn btn-secondary" onClick={() => handleWeatherConsent('declined')}>
                {t.decline}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        {renderPage()}
      </div>
    </>
  )
}
