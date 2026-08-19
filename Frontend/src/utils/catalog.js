// Maps backend category keys to translation keys used in the UI.
const CATEGORY_KEY_MAP = {
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

// Resolves a human-readable category label from translation strings.
export const getCategoryLabel = (category, t) => {
  const key = CATEGORY_KEY_MAP[(category || '').toLowerCase()]
  if (key && t[key]) return t[key]
  if (!category) return ''
  return category.charAt(0).toUpperCase() + category.slice(1)
}

// Resolves product image URLs for local relative paths and absolute URLs.
export const resolveImageUrl = (imagePath) => {
  const value = String(imagePath || '').trim()
  if (!value) return null

  if (/^(https?:\/\/|data:|blob:)/i.test(value) || value.startsWith('/')) {
    return value
  }

  return `http://${window.location.hostname}/KvalDarbs/${value.replace(/^\/+/, '')}`
}
