import { useEffect, useState } from 'react'
import Alert from '../../components/Alert'
import { adminAPI, productAPI } from '../../api/client'

const defaultForm = {
  name: '',
  category: '',
  newCategory: '',
  price: '',
  description: '',
  stock: 0,
  image: ''
}

// Admin catalog page for creating, editing, and deleting products.
export default function Admin({ user, onNavigate, t }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState(defaultForm)
  const [selectedImageFile, setSelectedImageFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [alert, setAlert] = useState(null)

  // Loads products and categories needed for admin forms and list.
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
      setAlert({ type: 'error', message: t.failedLoadAdminData })
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (!user || !user.is_admin) {
    return (
      <div className="admin-container">
        <Alert alert={{ type: 'error', message: t.adminAccessRequired }} />
        <button className="btn btn-add-cart" onClick={() => onNavigate('home')}>{t.backToShop}</button>
      </div>
    )
  }

  // Updates product form fields.
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Validates selected file before upload.
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0] || null

    if (!file) {
      setSelectedImageFile(null)
      return
    }

    const allowedTypes = ['image/png', 'image/jpeg']
    if (!allowedTypes.includes(file.type)) {
      setAlert({ type: 'error', message: t.invalidImageType })
      e.target.value = ''
      setSelectedImageFile(null)
      return
    }

    setSelectedImageFile(file)
    setAlert(null)
  }

  // Creates or updates a product based on editing state.
  const handleCreateProduct = async (e) => {
    e.preventDefault()
    setLoading(true)

    const category = formData.newCategory.trim() || formData.category

    if (!formData.name.trim() || !category.trim() || !formData.price) {
      setAlert({ type: 'error', message: t.nameCategoryPriceRequired })
      setLoading(false)
      return
    }

    try {
      let imagePath = formData.image.trim()

      if (selectedImageFile) {
        setUploadingImage(true)
        const uploadResponse = await adminAPI.uploadProductImage(selectedImageFile)
        if (!uploadResponse.data.success) {
          setAlert({ type: 'error', message: uploadResponse.data.message || t.failedUploadImage })
          setLoading(false)
          setUploadingImage(false)
          return
        }

        imagePath = uploadResponse.data.image || imagePath
      }

      const payload = {
        name: formData.name.trim(),
        category: category.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        stock: parseInt(formData.stock || 0, 10),
        image: imagePath
      }

      const response = editingId
        ? await adminAPI.updateProduct({ id: editingId, ...payload })
        : await adminAPI.createProduct(payload)

      if (response.data.success) {
        setAlert({ type: 'success', message: editingId ? t.productUpdatedSuccessfully : t.productAddedSuccessfully })
        setFormData(defaultForm)
        setSelectedImageFile(null)
        setEditingId(null)
        await loadData()
      } else {
        setAlert({ type: 'error', message: response.data.message || t.failedSaveProduct })
      }
    } catch (error) {
      setAlert({ type: 'error', message: t.failedSaveProduct })
    } finally {
      setUploadingImage(false)
      setLoading(false)
    }
  }

  // Loads product values into form for editing.
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
    setSelectedImageFile(null)
    window.scrollTo(0, 0)
  }

  // Deletes a product after confirmation.
  const handleDeleteProduct = async (id) => {
    if (!window.confirm(t.confirmDeleteProduct)) return

    try {
      const response = await adminAPI.deleteProduct(id)
      if (response.data.success) {
        setAlert({ type: 'success', message: t.productDeleted })
        await loadData()
      } else {
        setAlert({ type: 'error', message: response.data.message || t.failedDeleteProduct })
      }
    } catch (error) {
      setAlert({ type: 'error', message: t.failedDeleteProduct })
    }
  }

  return (
    <div className="admin-container">
      <h1>{t.adminPanel}</h1>
      <Alert alert={alert} onClose={() => setAlert(null)} />

      <div className="admin-form">
        <h2>{editingId ? t.editProduct : t.addNewProduct}</h2>
        <form onSubmit={handleCreateProduct}>
          <div className="form-grid">
            <div className="form-group">
              <label>{t.productName}</label>
              <input name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>{t.price} (€)</label>
              <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>{t.stock}</label>
              <input name="stock" type="number" value={formData.stock} onChange={handleChange} min="0" />
            </div>
            <div className="form-group">
              <label>{t.categoryExisting}</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">{t.selectCategory}</option>
                {categories.map(cat => (
                  <option key={cat.category} value={cat.category}>{cat.category}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t.newCategory}</label>
              <input name="newCategory" value={formData.newCategory} onChange={handleChange} placeholder={t.createNewCategory} />
            </div>
            <div className="form-group">
              <label>{t.imageOptional}</label>
              <input name="image" value={formData.image} onChange={handleChange} placeholder={t.imagePlaceholder} />
              <input
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                onChange={handleImageFileChange}
                className="admin-file-input"
                style={{ marginTop: '0.5rem' }}
              />
              {selectedImageFile && (
                <small>{t.selectedFile}: {selectedImageFile.name}</small>
              )}
            </div>
            <div className="form-group full-width">
              <label>{t.description}</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
            </div>
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn btn-add-cart" disabled={loading}>
              {(loading || uploadingImage)
                ? (uploadingImage ? t.uploadingImage : (editingId ? t.saving : t.adding))
                : (editingId ? t.saveChanges : t.addProduct)}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-add-cart"
                onClick={() => {
                  setEditingId(null)
                  setFormData(defaultForm)
                  setSelectedImageFile(null)
                }}
              >
                {t.cancelEdit}
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-products-list">
        {products.map((product) => (
          <div key={product.id} className="admin-product-card">
            <div>
              <strong>{product.name}</strong>
              <p>{product.category}</p>
            </div>
            <div className="admin-product-actions">
              <button className="btn btn-secondary" onClick={() => handleEditProduct(product)}>{t.edit}</button>
              <button className="btn btn-danger" onClick={() => handleDeleteProduct(product.id)}>{t.delete}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}