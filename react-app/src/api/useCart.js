import { useState, useEffect } from 'react'

export const useCart = () => {
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  const addItem = (product, quantity) => {
    const newItems = [...items]
    const existingIndex = newItems.findIndex(i => i.id === product.id)

    if (existingIndex >= 0) {
      newItems[existingIndex].quantity += quantity
    } else {
      newItems.push({ ...product, quantity })
    }

    setItems(newItems)
    localStorage.setItem('cart', JSON.stringify(newItems))
    setCount(newItems.reduce((sum, item) => sum + item.quantity, 0))
  }

  const removeItem = (productId) => {
    const newItems = items.filter(i => i.id !== productId)
    setItems(newItems)
    localStorage.setItem('cart', JSON.stringify(newItems))
    setCount(newItems.reduce((sum, item) => sum + item.quantity, 0))
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem('cart')
    setCount(0)
  }

  return { items, count, addItem, removeItem, clearCart }
}
