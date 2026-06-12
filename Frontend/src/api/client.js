import axios from 'axios'

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

export const productAPI = {
  getAll: (page = 1, category = null, search = null) =>
    api.get('api.php', {
      params: {
        action: 'getProducts',
        page,
        category,
        search
      }
    }),
  
  getById: (id) =>
    api.get('api.php', {
      params: {
        action: 'getProduct',
        id
      }
    }),
  
  getCategories: () =>
    api.get('api.php', {
      params: { action: 'getCategories' }
    })
}

export const cartAPI = {
  getItems: () =>
    api.get('api.php', {
      params: { action: 'getCart' }
    }),
  
  addItem: (productId, quantity) =>
    api.post('api.php', {
      action: 'addToCart',
      product_id: productId,
      quantity
    }),
  
  removeItem: (cartItemId) =>
    api.post('api.php', {
      action: 'removeFromCart',
      cart_item_id: cartItemId
    }),
  
  updateItem: (cartItemId, quantity) =>
    api.post('api.php', {
      action: 'updateCartItem',
      cart_item_id: cartItemId,
      quantity
    })
}

export const authAPI = {
  login: (username, password) =>
    api.post('api.php', {
      action: 'login',
      username,
      password
    }),
  
  register: (username, email, password) =>
    api.post('api.php', {
      action: 'register',
      username,
      email,
      password
    }),
  
  getCurrentUser: () =>
    api.get('api.php', {
      params: { action: 'getCurrentUser' }
    }),

  updateProfile: (username, email, password = '') =>
    api.post('api.php', {
      action: 'updateProfile',
      username,
      email,
      password
    }),
  
  logout: () =>
    api.post('api.php', {
      action: 'logout'
    })
}

export const ordersAPI = {
  getAll: () =>
    api.get('api.php', {
      params: { action: 'getOrders' }
    }),
  
  create: (orderData) =>
    api.post('api.php', {
      action: 'createOrder',
      ...orderData
    })
}

export const adminAPI = {
  getAllProducts: () =>
    api.get('api.php', {
      params: { action: 'getAllProductsAdmin' }
    }),

  uploadProductImage: (file) => {
    const formData = new FormData()
    formData.append('image', file)

    return api.post('api.php?action=uploadProductImage', formData)
  },

  createProduct: (productData) =>
    api.post('api.php', {
      action: 'createProduct',
      ...productData
    }),

  updateProduct: (productData) =>
    api.post('api.php', {
      action: 'updateProduct',
      ...productData
    }),

  deleteProduct: (id) =>
    api.post('api.php', {
      action: 'deleteProduct',
      id
    }),

  setSoldOut: (id) =>
    api.post('api.php', {
      action: 'setSoldOut',
      id
    })
}

export default api
