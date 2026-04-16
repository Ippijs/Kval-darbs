import { useState, useEffect } from 'react'
import { productAPI } from '../api/client'
import Alert from '../components/Alert'
import { translateProductDescription } from '../utils/productDescriptionTranslate'

export default function Home({ onNavigate, onAddToCart, menuOpen, setMenuOpen, language, setLanguage, t, initialCategory }) {
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
      { id: 'all', labelKey: 'allRods', keywords: [] },
      { id: 'casting', labelKey: 'casting', keywords: ['casting', 'spincast'] },
      { id: 'float', labelKey: 'fishingFloat', keywords: ['float'] },
      { id: 'baitcasting', labelKey: 'baitCasting', keywords: ['baitcasting', 'bait casting'] },
      { id: 'angling', labelKey: 'angling', keywords: ['angling'] }
    ],
    reels: [
      { id: 'all', labelKey: 'allReels', keywords: [] },
      { id: 'spinning', labelKey: 'spinning', keywords: ['spinning'] },
      { id: 'baitcasting', labelKey: 'baitCasting', keywords: ['baitcasting', 'bait casting'] }
    ],
    line: [
      { id: 'all', labelKey: 'allLine', keywords: [] },
      { id: 'braided', labelKey: 'braided', keywords: ['braided'] },
      { id: 'mono', labelKey: 'monofilament', keywords: ['mono', 'monofilament'] },
      { id: 'fluoro', labelKey: 'fluorocarbon', keywords: ['fluoro', 'fluorocarbon'] }
    ],
    lures: [
      { id: 'all', labelKey: 'allLures', keywords: [] },
      { id: 'crankbait', labelKey: 'crankbait', keywords: ['crankbait'] },
      { id: 'jig', labelKey: 'jig', keywords: ['jig'] },
      { id: 'spoon', labelKey: 'spoon', keywords: ['spoon'] },
      { id: 'soft', labelKey: 'softBait', keywords: ['soft', 'worm'] }
    ],
    storage: [
      { id: 'all', labelKey: 'allStorage', keywords: [] },
      { id: 'box', labelKey: 'tackleBox', keywords: ['box'] },
      { id: 'backpack', labelKey: 'backpack', keywords: ['backpack'] }
    ],
    hooks: [
      { id: 'all', labelKey: 'allHooks', keywords: [] },
      { id: 'single', labelKey: 'single', keywords: ['single'] },
      { id: 'treble', labelKey: 'treble', keywords: ['treble'] }
    ],
    weights: [
      { id: 'all', labelKey: 'allWeights', keywords: [] },
      { id: 'sinker', labelKey: 'sinker', keywords: ['sinker'] },
      { id: 'splitshot', labelKey: 'splitShot', keywords: ['split shot', 'splitshot'] }
    ],
    nets: [
      { id: 'all', labelKey: 'allNets', keywords: [] },
      { id: 'landing', labelKey: 'landing', keywords: ['landing'] }
    ],
    clothing: [
      { id: 'all', labelKey: 'allClothing', keywords: [] },
      { id: 'gloves', labelKey: 'gloves', keywords: ['gloves'] },
      { id: 'jacket', labelKey: 'jacket', keywords: ['jacket'] },
      { id: 'wadingpants', labelKey: 'wadingPants', keywords: ['wading pants', 'waders'] },
      { id: 'pants', labelKey: 'pants', keywords: ['pants'] },
      { id: 'shoes', labelKey: 'fishingShoes', keywords: ['shoes', 'boots'] }
    ]
  }

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [selectedCategory, search, page])

  useEffect(() => {
    setSelectedFilter('all')
  }, [selectedCategory])

  useEffect(() => {
    if (initialCategory === undefined) return
    setSelectedCategory(initialCategory || null)
    setSelectedFilter('all')
    setPage(1)
  }, [initialCategory])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getAll(page, selectedCategory, search)
      setProducts(response.data.products || [])
    } catch (error) {
      setAlert({ type: 'error', message: t.noProductsFound })
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

  const activeFilters = selectedCategory ? (categoryFilters[selectedCategory] || [{ id: 'all', labelKey: 'allProducts', keywords: [] }]) : []

  const displayedProducts = products.filter((product) => {
    if (!selectedCategory || selectedFilter === 'all') return true
    const filter = (categoryFilters[selectedCategory] || []).find(f => f.id === selectedFilter)
    if (!filter || filter.keywords.length === 0) return true
    const haystack = `${product.name || ''} ${product.description || ''}`.toLowerCase()
    return filter.keywords.some(keyword => haystack.includes(keyword))
  })

  const getShortDescription = (description) => {
    if (!description) return t.noDescription
    const cleaned = description.trim()
    if (cleaned.length <= 90) return cleaned
    return `${cleaned.slice(0, 90)}...`
  }

  const getCategoryLabel = (category) => {
    const categoryKeyMap = {
      rods: 'allRods',
      reels: 'allReels',
      line: 'allLine',
      lures: 'allLures',
      storage: 'allStorage',
      hooks: 'allHooks',
      weights: 'allWeights',
      nets: 'allNets',
      clothing: 'allClothing'
    }

    const key = categoryKeyMap[(category || '').toLowerCase()]
    if (key && t[key]) return t[key]
    if (!category) return ''
    return category.charAt(0).toUpperCase() + category.slice(1)
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
                  setSelectedFilter('all')
                  setMenuOpen(false)
                }}
                className={!selectedCategory ? 'active' : ''}
              >
                {t.allProducts}
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
                  {getCategoryLabel(cat.category)}
                </a>
              </li>
            ))}
          </ul>

          {selectedCategory && activeFilters.length > 0 && (
            <div className="subcategory-filters">
              <div className="filters-title">{t.filter} {getCategoryLabel(selectedCategory)}</div>
              <ul className="filter-list">
                {activeFilters.map(filter => (
                  <li key={filter.id}>
                    <a
                      onClick={() => setSelectedFilter(filter.id)}
                      className={selectedFilter === filter.id ? 'active' : ''}
                    >
                      {t[filter.labelKey] || filter.labelKey}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="sidebar-bottom">
            <a className="sidebar-link" onClick={() => onNavigate('about')}>{t.aboutUs}</a>
            <a className="sidebar-link" onClick={() => onNavigate('contact')}>{t.contacts}</a>
            <div className="language-selector">
              <span>{t.language}</span>
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3E%3Crect fill='%23012169' width='60' height='30'/%3E%3Cpath d='M0 0l60 30M60 0L0 30' stroke='%23FFF' stroke-width='6'/%3E%3Cpath d='M0 0l60 30M60 0L0 30' stroke='%23C8102E' stroke-width='4' clip-path='inset(0)' /%3E%3Cpath d='M30 0v30M0 15h60' stroke='%23FFF' stroke-width='10'/%3E%3Cpath d='M30 0v30M0 15h60' stroke='%23C8102E' stroke-width='6'/%3E%3C/svg%3E" 
                   alt="EN"
                   className={`language-flag ${language === 'en' ? 'active' : ''}`}
                   title="English"
                   onClick={() => setLanguage('en')}
                 />
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Crect fill='%239e3039' width='1200' height='600'/%3E%3Crect fill='%23FFF' y='200' width='1200' height='200'/%3E%3C/svg%3E" 
                   alt="LV"
                   className={`language-flag ${language === 'lv' ? 'active' : ''}`}
                   title="Latviešu"
                   onClick={() => setLanguage('lv')}
                 />
            </div>
          </div>
        </aside>

        <main className="products-section">
          {loading ? (
            <p>{t.loadingProducts}</p>
          ) : displayedProducts.length === 0 ? (
            <p>{t.noProductsFound}</p>
          ) : (
            <div className="products-grid">
              {displayedProducts.map(product => (
                <div
                  key={product.id}
                  className="product-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => onNavigate('product', { id: product.id })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onNavigate('product', { id: product.id })
                    }
                  }}
                >
                  <div className="product-image">🎣</div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">€{product.price}</div>
                    <div className="product-description">{getShortDescription(translateProductDescription(product.description, language))}</div>
                    <button
                      className="btn btn-add-cart"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (product.stock > 0) {
                          onAddToCart(product, 1)
                          setAlert({ type: 'success', message: `${product.name} ${t.addedToCart}` })
                        }
                      }}
                      disabled={product.stock === 0}
                    >
                      {t.addToCart}
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
