import { useState, useEffect } from 'react'
import { productAPI } from '../../api/client'
import Alert from '../../components/Alert'
import { translateProductDescription } from '../../utils/productDescriptionTranslate'
import { getCategoryLabel, resolveImageUrl } from '../../utils/catalog'

export default function Product({ productId, onNavigate, onAddToCart, user, t }) {
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)

  // Loads product details when route product id changes.
  useEffect(() => {
    loadProduct()
  }, [productId])

  // Fetches single product data from the API.
  const loadProduct = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getById(productId)
      setProduct(response.data.product)
    } catch (error) {
      setAlert({ type: 'error', message: t.productNotFound })
    } finally {
      setLoading(false)
    }
  }

  // Validates cart constraints before adding an item.
  const handleAddToCart = () => {
    if (!user) {
      setAlert({ type: 'warning', message: t.pleaseLoginToCart })
      return
    }

    if (quantity > 0 && quantity <= product.stock) {
      onAddToCart(product, quantity)
      setAlert({ type: 'success', message: `${product.name} ${t.addedToCart}` })
      setQuantity(1)
    } else {
      setAlert({ type: 'error', message: t.invalidQuantity })
    }
  }

  if (loading) return <p>{t.loadingProduct}</p>
  if (!product) return <p>{t.productNotFound}</p>

  const imageUrl = resolveImageUrl(product.image)

  return (
    <div className="product-detail">
      <div className="breadcrumb">
        <a onClick={() => onNavigate('home', { showShop: true })}>{t.shop}</a> &gt;
        <a onClick={() => onNavigate('home', { showShop: true, category: product.category })}> {getCategoryLabel(product.category, t)}</a> &gt;
        {product.name}
      </div>

      <Alert alert={alert} onClose={() => setAlert(null)} />

      <div className="product-detail-container">
        <div className="product-image-large">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="product-image-large-img" />
          ) : (
            <div className="image-placeholder-large">🎣</div>
          )}
        </div>

        <div className="product-details-info">
          <h1>{product.name}</h1>
          <p className="category-label">{t.category}: <span>{getCategoryLabel(product.category, t)}</span></p>

          <div className="price-section">
            <div className="current-price">€{product.price}</div>
          </div>

          <p className="description">{translateProductDescription(product.description) || t.noDescription}</p>

          <div className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? t.inStockCount(product.stock) : t.outOfStock}
          </div>

          {product.stock > 0 && (
            <>
              <div className="quantity-selector">
                <label>{t.quantity}:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>

              <button className="btn btn-primary" onClick={handleAddToCart}>
                {t.addToCart}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}