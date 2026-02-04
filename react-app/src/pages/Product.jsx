import { useState, useEffect } from 'react'
import { productAPI } from '../api/client'
import Alert from '../components/Alert'

export default function Product({ productId, onNavigate, onAddToCart, user }) {
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    loadProduct()
  }, [productId])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getById(productId)
      setProduct(response.data.product)
    } catch (error) {
      setAlert({ type: 'error', message: 'Product not found' })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!user) {
      setAlert({ type: 'warning', message: 'Please login to add items to cart' })
      return
    }

    if (quantity > 0 && quantity <= product.stock) {
      onAddToCart(product, quantity)
      setAlert({ type: 'success', message: `${product.name} added to cart!` })
      setQuantity(1)
    } else {
      setAlert({ type: 'error', message: 'Invalid quantity' })
    }
  }

  if (loading) return <p>Loading product...</p>
  if (!product) return <p>Product not found</p>

  return (
    <div className="product-detail">
      <div className="breadcrumb">
        <a onClick={() => onNavigate('home')}>Shop</a> &gt;
        <a onClick={() => onNavigate('home', { category: product.category })}> {product.category}</a> &gt;
        {product.name}
      </div>

      <Alert alert={alert} onClose={() => setAlert(null)} />

      <div className="product-detail-container">
        <div className="product-image-large">
          <div className="image-placeholder-large">🎣</div>
        </div>

        <div className="product-details-info">
          <h1>{product.name}</h1>
          <p className="category-label">Category: <span>{product.category}</span></p>

          <div className="price-section">
            <div className="current-price">${product.price}</div>
          </div>

          <p className="description">{product.description || 'No description available'}</p>

          <div className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? `In Stock: ${product.stock} available` : 'Out of Stock'}
          </div>

          {product.stock > 0 && (
            <>
              <div className="quantity-selector">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>

              <button className="btn btn-primary" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
