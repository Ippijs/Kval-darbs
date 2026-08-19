import { useState, useEffect } from 'react'

// Cart storage key used by the frontend-only cart implementation.
const CART_STORAGE_KEY = 'cart'

// Calculates total item count from cart rows.
const getCartCount = (cartItems) => cartItems.reduce((sum, item) => sum + item.quantity, 0)

export const useCart = () => {
  const [items, setItems] = useState([])

  // Keeps React state and localStorage in sync with one call.
  const saveItems = (nextItems) => {
    setItems(nextItems)
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextItems))
  }

  useEffect(() => {
    // Loads persisted cart when the app starts.
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY)
        setItems([])
      }
    }
  }, [])

  // Adds a product or increases quantity if it already exists in cart.
  const addItem = (product, quantity) => {
    const newItems = [...items]
    const existingIndex = newItems.findIndex((i) => i.id === product.id)

    if (existingIndex >= 0) {
      newItems[existingIndex].quantity += quantity
    } else {
      newItems.push({ ...product, quantity })
    }

    saveItems(newItems)
  }

  // Removes a product row from cart.
  const removeItem = (productId) => {
    const newItems = items.filter((i) => i.id !== productId)
    saveItems(newItems)
  }

  // Clears all cart data from state and storage.
  const clearCart = () => {
    setItems([])
    localStorage.removeItem(CART_STORAGE_KEY)
  }

  const count = getCartCount(items)

  return { items, count, addItem, removeItem, clearCart }
}
