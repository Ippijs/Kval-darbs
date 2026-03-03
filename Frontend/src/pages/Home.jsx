import { useState, useEffect } from 'react'
import { productAPI } from '../api/client'
import Alert from '../components/Alert'

export default function Home({ onNavigate, onAddToCart, menuOpen, setMenuOpen }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [alert, setAlert] = useState(null)

  const categoryFilters = {
    rods: [
      { id: 'all', label: 'All rods', keywords: [] },
      { id: 'casting', label: 'Casting', keywords: ['casting', 'spincast'] },
      { id: 'float', label: 'Fishing float', keywords: ['float'] },
      { id: 'baitcasting', label: 'Bait casting', keywords: ['baitcasting', 'bait casting'] },
      { id: 'angling', label: 'Angling', keywords: ['angling'] }
    ],
    reels: [
      { id: 'all', label: 'All reels', keywords: [] },
      { id: 'spinning', label: 'Spinning', keywords: ['spinning'] },
      { id: 'baitcasting', label: 'Bait casting', keywords: ['baitcasting', 'bait casting'] }
    ],
    line: [
      { id: 'all', label: 'All line', keywords: [] },
      { id: 'braided', label: 'Braided', keywords: ['braided'] },
      { id: 'mono', label: 'Monofilament', keywords: ['mono', 'monofilament'] },
      { id: 'fluoro', label: 'Fluorocarbon', keywords: ['fluoro', 'fluorocarbon'] }
    ],
    lures: [
      { id: 'all', label: 'All lures', keywords: [] },
      { id: 'crankbait', label: 'Crankbait', keywords: ['crankbait'] },
      { id: 'jig', label: 'Jig', keywords: ['jig'] },
      { id: 'spoon', label: 'Spoon', keywords: ['spoon'] },
      { id: 'soft', label: 'Soft bait', keywords: ['soft', 'worm'] }
    ],
    storage: [
      { id: 'all', label: 'All storage', keywords: [] },
      { id: 'box', label: 'Tackle box', keywords: ['box'] },
      { id: 'backpack', label: 'Backpack', keywords: ['backpack'] }
    ],
    hooks: [
      { id: 'all', label: 'All hooks', keywords: [] },
      { id: 'single', label: 'Single', keywords: ['single'] },
      { id: 'treble', label: 'Treble', keywords: ['treble'] }
    ],
    weights: [
      { id: 'all', label: 'All weights', keywords: [] },
      { id: 'sinker', label: 'Sinker', keywords: ['sinker'] },
      { id: 'splitshot', label: 'Split shot', keywords: ['split shot', 'splitshot'] }
    ],
    nets: [
      { id: 'all', label: 'All nets', keywords: [] },
      { id: 'landing', label: 'Landing', keywords: ['landing'] }
    ],
    clothing: [
      { id: 'all', label: 'All clothing', keywords: [] },
      { id: 'gloves', label: 'Gloves', keywords: ['gloves'] },
      { id: 'jacket', label: 'Jacket', keywords: ['jacket'] },
      { id: 'wadingpants', label: 'Wading pants', keywords: ['wading pants', 'waders'] },
      { id: 'pants', label: 'Pants', keywords: ['pants'] },
      { id: 'shoes', label: 'Fishing shoes', keywords: ['shoes', 'boots'] }
    ]
  }

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [selectedCategory, search, page])

  useEffect(() => {
    setSelectedFilter('all')
  }, [selectedCategory])

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

  const activeFilters = selectedCategory ? (categoryFilters[selectedCategory] || [{ id: 'all', label: 'All', keywords: [] }]) : []

  const displayedProducts = products.filter((product) => {
    if (!selectedCategory || selectedFilter === 'all') return true
    const filter = (categoryFilters[selectedCategory] || []).find(f => f.id === selectedFilter)
    if (!filter || filter.keywords.length === 0) return true
    const haystack = `${product.name || ''} ${product.description || ''}`.toLowerCase()
    return filter.keywords.some(keyword => haystack.includes(keyword))
  })

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
                  setSelectedFilter('all')
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
                    setSelectedFilter('all')
                    setMenuOpen(false)
                  }}
                  className={selectedCategory === cat.category ? 'active' : ''}
                >
                  {cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}
                </a>
              </li>
            ))}
          </ul>

          {selectedCategory && activeFilters.length > 0 && (
            <div className="subcategory-filters">
              <div className="filters-title">Filter {selectedCategory}</div>
              <ul className="filter-list">
                {activeFilters.map(filter => (
                  <li key={filter.id}>
                    <a
                      onClick={() => setSelectedFilter(filter.id)}
                      className={selectedFilter === filter.id ? 'active' : ''}
                    >
                      {filter.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
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
          ) : displayedProducts.length === 0 ? (
            <p>No products found</p>
          ) : (
            <div className="products-grid">
              {displayedProducts.map(product => (
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
