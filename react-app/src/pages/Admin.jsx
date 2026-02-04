import { useEffect, useState } from 'react'
import Alert from '../components/Alert'
import { adminAPI, productAPI } from '../api/client'

const defaultForm = {
  name: '',
  category: '',
  newCategory: '',
  price: '',
  description: '',
  stock: 0,
  image: ''
}

export default function Admin({ user, onNavigate }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState(defaultForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        adminAPI.getAllProducts(),
        productAPI.getCategories()
      ])

      if (productsRes.data.success) {
        setProducts(productsRes.data.products || [])
      }

      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.categories || [])
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to load admin data' })
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (!user || !user.is_admin) {
    return (
      <div className="admin-container">
        <Alert alert={{ type: 'error', message: 'Admin access required' }} />
        <button className="btn btn-add-cart" onClick={() => onNavigate('home')}>Back to shop</button>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    setLoading(true)

    const category = formData.newCategory.trim() || formData.category

    if (!formData.name.trim() || !category.trim() || !formData.price) {
      setAlert({ type: 'error', message: 'Name, category, and price are required' })
      setLoading(false)
      return
    }

    try {
      const payload = {
        name: formData.name.trim(),
        category: category.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        stock: parseInt(formData.stock || 0, 10),
        image: formData.image.trim()
      }

      const response = editingId
        ? await adminAPI.updateProduct({ id: editingId, ...payload })
        : await adminAPI.createProduct(payload)

      if (response.data.success) {
        setAlert({ type: 'success', message: editingId ? 'Product updated successfully' : 'Product added successfully' })
        setFormData(defaultForm)
        setEditingId(null)
        await loadData()
      } else {
        setAlert({ type: 'error', message: response.data.message || 'Failed to save product' })
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to save product' })
    } finally {
      setLoading(false)
    }
  }

  const handleEditProduct = (product) => {
    setEditingId(product.id)
    setFormData({
      name: product.name || '',
      category: product.category || '',
      newCategory: '',
      price: product.price || '',
      description: product.description || '',
      stock: product.stock ?? 0,
      image: product.image || ''
    })
    window.scrollTo(0, 0)
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return

    try {
      const response = await adminAPI.deleteProduct(id)
      if (response.data.success) {
        setAlert({ type: 'success', message: 'Product deleted' })
        await loadData()
      } else {
        setAlert({ type: 'error', message: response.data.message || 'Failed to delete product' })
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete product' })
    }
  }

  const handleSoldOut = async (id) => {
    try {
      const response = await adminAPI.setSoldOut(id)
      if (response.data.success) {
        setAlert({ type: 'success', message: 'Product marked as sold out' })
        await loadData()
      } else {
        setAlert({ type: 'error', message: response.data.message || 'Failed to update product' })
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update product' })
    }
  }

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>
      <Alert alert={alert} onClose={() => setAlert(null)} />

      <div className="admin-form">
        <h2>{editingId ? 'Edit product' : 'Add new product'}</h2>
        <form onSubmit={handleCreateProduct}>
          <div className="form-grid">
            <div className="form-group">
              <label>Product name</label>
              <input name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Price (€)</label>
              <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input name="stock" type="number" value={formData.stock} onChange={handleChange} min="0" />
            </div>
            <div className="form-group">
              <label>Category (existing)</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.category} value={cat.category}>{cat.category}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>New category</label>
              <input name="newCategory" value={formData.newCategory} onChange={handleChange} placeholder="Create new category" />
            </div>
            <div className="form-group">
              <label>Image (optional)</label>
              <input name="image" value={formData.image} onChange={handleChange} placeholder="image file name or URL" />
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
            </div>
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn btn-add-cart" disabled={loading}>
              {loading ? (editingId ? 'Saving...' : 'Adding...') : (editingId ? 'Save Changes' : 'Add Product')}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-add-cart"
                onClick={() => {
                  setEditingId(null)
                  setFormData(defaultForm)
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-products">
        <h2>Manage products</h2>
        <div className="admin-products-grid">
          {products.map(product => (
            <div key={product.id} className="admin-product-card">
              <div>
                <strong>{product.name}</strong>
                <p>Category: {product.category}</p>
                <p>Price: €{product.price}</p>
                <p>Status: {product.stock > 0 ? `In stock (${product.stock})` : 'Sold out'}</p>
              </div>
              <div className="admin-actions">
                <button className="btn btn-add-cart" onClick={() => handleSoldOut(product.id)}>Mark Sold Out</button>
                <button className="btn btn-add-cart" onClick={() => handleEditProduct(product)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
