import { useState, useEffect } from 'react'
import { productAPI } from '../api/client'
import Alert from '../components/Alert'

export default function Home({ onNavigate, onAddToCart, menuOpen, setMenuOpen }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [selectedCategory, search, page])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getAll(page, selectedCategory, search)
      setProducts(response.data.products || [])
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to load products' })
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await productAPI.getCategories()
      setCategories(response.data.categories || [])
    } catch (error) {
      console.error('Failed to load categories', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
  }

  return (
    <div>
      <Alert alert={alert} onClose={() => setAlert(null)} />

      <div className="shop-container">
        <aside className={`filters ${menuOpen ? 'menu-open' : ''}`}>
          <ul className="category-list">
            <li>
              <a
                onClick={() => {
                  setSelectedCategory(null)
                  setMenuOpen(false)
                }}
                className={!selectedCategory ? 'active' : ''}
              >
                All Products
              </a>
            </li>
            {categories.map(cat => (
              <li key={cat.id}>
                <a
                  onClick={() => {
                    setSelectedCategory(cat.category)
                    setMenuOpen(false)
                  }}
                  className={selectedCategory === cat.category ? 'active' : ''}
                >
                  {cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}
                </a>
              </li>
            ))}
          </ul>
          
          <div className="sidebar-bottom">
            <a className="sidebar-link" onClick={() => onNavigate('about')}>About us</a>
            <a className="sidebar-link" onClick={() => onNavigate('contact')}>Contacts</a>
            <div className="language-selector">
              <span>Language</span>
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3E%3Crect fill='%23012169' width='60' height='30'/%3E%3Cpath d='M0 0l60 30M60 0L0 30' stroke='%23FFF' stroke-width='6'/%3E%3Cpath d='M0 0l60 30M60 0L0 30' stroke='%23C8102E' stroke-width='4' clip-path='inset(0)' /%3E%3Cpath d='M30 0v30M0 15h60' stroke='%23FFF' stroke-width='10'/%3E%3Cpath d='M30 0v30M0 15h60' stroke='%23C8102E' stroke-width='6'/%3E%3C/svg%3E" 
                   alt="EN" className="language-flag" title="English" />
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Crect fill='%239e3039' width='1200' height='600'/%3E%3Crect fill='%23FFF' y='200' width='1200' height='200'/%3E%3C/svg%3E" 
                   alt="LV" className="language-flag" title="Latviešu" />
            </div>
          </div>
        </aside>

        <main className="products-section">
          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products found</p>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">🎣</div>
                  <div className="product-info">
                    <div className="product-price">€{product.price}</div>
                    <div className="product-description">Description</div>
                    <button
                      className="btn btn-add-cart"
                      onClick={() => {
                        if (product.stock > 0) {
                          onAddToCart(product, 1)
                          setAlert({ type: 'success', message: `${product.name} added to cart!` })
                        }
                      }}
                      disabled={product.stock === 0}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
