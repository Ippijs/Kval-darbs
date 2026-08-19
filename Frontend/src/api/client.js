import axios from 'axios'

// Resolves API base URL from env or current host fallback.
const getApiBase = () => {
  const envBase = import.meta.env.VITE_API_BASE_URL
  if (envBase) {
    return envBase
  }

  const host = window.location.hostname
  return `http://${host}/KvalDarbs`
}

const API_BASE = getApiBase()

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 10000
})

// Helper for action-based GET requests routed through api.php.
const getByAction = (action, params = {}) =>
  api.get('api.php', {
    params: {
      action,
      ...params
    }
  })

// Helper for action-based POST requests routed through api.php.
const postByAction = (action, payload = {}) =>
  api.post('api.php', {
    action,
    ...payload
  })

export const productAPI = {
  getAll: (page = 1, category = null, search = null) => getByAction('getProducts', { page, category, search }),
  getById: (id) => getByAction('getProduct', { id }),
  getCategories: () => getByAction('getCategories')
}

export const cartAPI = {
  getItems: () => getByAction('getCart'),
  addItem: (productId, quantity) => postByAction('addToCart', { product_id: productId, quantity }),
  removeItem: (cartItemId) => postByAction('removeFromCart', { cart_item_id: cartItemId }),
  updateItem: (cartItemId, quantity) => postByAction('updateCartItem', { cart_item_id: cartItemId, quantity })
}

export const authAPI = {
  login: (username, password) => postByAction('login', { username, password }),
  register: (username, email, password) => postByAction('register', { username, email, password }),
  getCurrentUser: () => getByAction('getCurrentUser'),
  updateProfile: (username, email, password = '') => postByAction('updateProfile', { username, email, password }),
  logout: () => postByAction('logout')
}

export const ordersAPI = {
  getAll: () => getByAction('getOrders'),
  create: (orderData) => postByAction('createOrder', orderData)
}

export const adminAPI = {
  getAllProducts: () => getByAction('getAllProductsAdmin'),

  uploadProductImage: (file) => {
    const formData = new FormData()
    formData.append('image', file)

    return api.post('api.php?action=uploadProductImage', formData)
  },

  createProduct: (productData) => postByAction('createProduct', productData),
  updateProduct: (productData) => postByAction('updateProduct', productData),
  deleteProduct: (id) => postByAction('deleteProduct', { id })
}

export default api
