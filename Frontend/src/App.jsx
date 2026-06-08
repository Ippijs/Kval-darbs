import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Product from './pages/Product'
import Cart from './pages/Cart'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import HomeLanding from './pages/HomeLanding'
import { useAuth } from './api/useAuth'
import { useCart } from './api/useCart'
import './index.css'

const translations = {
  en: {
    navHome: 'HOME',
    navAllProducts: 'All Products',
    navAdmin: 'Admin',
    navLogout: 'Logout',
    navSignUp: 'Sign Up',
    navLogIn: 'Log In',
    navCart: 'Cart',
    allProducts: 'All Products',
    aboutUs: 'About us',
    contacts: 'Contacts',
    language: 'Language',
    loadingProducts: 'Loading products...',
    noProductsFound: 'No products found',
    addToCart: 'Add to cart',
    addedToCart: 'added to cart!',
    noDescription: 'No description available',
    filter: 'Filter',
    allRods: 'All rods',
    casting: 'Casting',
    fishingFloat: 'Fishing float',
    baitCasting: 'Bait casting',
    angling: 'Angling',
    allReels: 'All reels',
    spinning: 'Spinning',
    allLine: 'All line',
    braided: 'Braided',
    monofilament: 'Monofilament',
    fluorocarbon: 'Fluorocarbon',
    allLures: 'All lures',
    crankbait: 'Crankbait',
    jig: 'Jig',
    spoon: 'Spoon',
    softBait: 'Soft bait',
    allStorage: 'All storage',
    tackleBox: 'Tackle box',
    backpack: 'Backpack',
    allHooks: 'All hooks',
    single: 'Single',
    treble: 'Treble',
    allWeights: 'All weights',
    sinker: 'Sinker',
    splitShot: 'Split shot',
    allNets: 'All nets',
    landing: 'Landing',
    allClothing: 'All clothing',
    gloves: 'Gloves',
    jacket: 'Jacket',
    wadingPants: 'Wading pants',
    pants: 'Pants',
    fishingShoes: 'Fishing shoes',
    cartEmptyTitle: 'Your Cart is Empty',
    cartEmptyText: 'Continue shopping to add items',
    continueShopping: 'Continue Shopping',
    shoppingCart: 'Shopping Cart',
    product: 'Product',
    price: 'Price',
    quantity: 'Quantity',
    total: 'Total',
    action: 'Action',
    remove: 'Remove',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    free: 'Free',
    proceedToCheckout: 'Proceed to Checkout',
    loadingProduct: 'Loading product...',
    productNotFound: 'Product not found',
    shop: 'Shop',
    category: 'Category',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    available: 'available',
    pleaseLoginToCart: 'Please login to add items to cart',
    invalidQuantity: 'Invalid quantity',
    aboutTitle: 'About FishingGear Pro',
    aboutText: 'Welcome to FishingGear Pro, your ultimate destination for premium fishing equipment. We are dedicated to providing fishermen and women with the highest quality gear to make their fishing experience unforgettable.',
    ourMission: 'Our Mission',
    missionText: 'To supply quality fishing products at affordable prices and provide excellent customer service.',
    editableTextTitle: 'Write your own text',
    editableTextPlaceholder: 'Write your text here...',
    downloadTextFile: 'Download text file',
    contactUs: 'Contact Us',
    contactSubtitle: "We'd love to hear from you. Send us a message!",
    name: 'Name',
    email: 'Email',
    message: 'Message',
    sending: 'Sending...',
    sendMessage: 'Send Message',
    thankYouMessage: "Thank you for your message. We'll get back to you soon!",
    sendFailed: 'Failed to send message. Please try again.',
    login: 'Login',
    username: 'Username',
    password: 'Password',
    loggingIn: 'Logging in...',
    loginSuccess: 'Login successful!',
    loginFailed: 'Login failed',
    dontHaveAccount: "Don't have an account?",
    register: 'Register',
    registerTitle: 'Register',
    confirmPassword: 'Confirm Password',
    passwordMustContain: 'Password must contain:',
    atLeast8Characters: 'At least 8 characters',
    atLeast1Uppercase: 'At least 1 uppercase letter (A-Z)',
    atLeast1Special: 'At least 1 special character (@, !, #, $, %, etc.)',
    passwordNoSpaces: 'Password cannot have leading or trailing spaces',
    passwordMismatch: 'Passwords do not match',
    registering: 'Registering...',
    alreadyHaveAccount: 'Already have an account?',
    registrationSuccess: 'Registration successful! Redirecting to login...',
    registrationFailed: 'Registration failed',
    adminAccessRequired: 'Admin access required',
    backToShop: 'Back to shop',
    adminPanel: 'Admin Panel',
    failedLoadAdminData: 'Failed to load admin data',
    nameCategoryPriceRequired: 'Name, category, and price are required',
    productUpdatedSuccessfully: 'Product updated successfully',
    productAddedSuccessfully: 'Product added successfully',
    failedSaveProduct: 'Failed to save product',
    confirmDeleteProduct: 'Delete this product?',
    productDeleted: 'Product deleted',
    failedDeleteProduct: 'Failed to delete product',
    productMarkedSoldOut: 'Product marked as sold out',
    failedUpdateProduct: 'Failed to update product',
    editProduct: 'Edit product',
    addNewProduct: 'Add new product',
    productName: 'Product name',
    stock: 'Stock',
    categoryExisting: 'Category (existing)',
    selectCategory: 'Select category',
    newCategory: 'New category',
    createNewCategory: 'Create new category',
    imageOptional: 'Image (optional)',
    imagePlaceholder: 'image file name or URL',
    description: 'Description',
    saving: 'Saving...',
    adding: 'Adding...',
    saveChanges: 'Save Changes',
    addProduct: 'Add Product',
    cancelEdit: 'Cancel Edit',
    manageProducts: 'Manage products',
    status: 'Status',
    soldOut: 'Sold out',
    markSoldOut: 'Mark Sold Out',
    edit: 'Edit',
    delete: 'Delete',
    weatherConsentTitle: 'Allow weather and location?',
    weatherConsentText: 'To show live weather and fishing conditions, we need your location. Your choice is saved in a cookie.',
    allow: 'Allow',
    decline: 'Decline',
    loadingWeatherData: 'Loading weather data...',
    humidity: 'Humidity',
    wind: 'Wind',
    fishingConditions: 'Fishing Conditions',
    overallQuality: 'Overall Quality',
    bestFishToday: 'Best Fish to Catch Today:',
    method: 'Method',
    location: 'Location',
    tip: 'Tip',
    tipExcellent: 'Perfect day to head out! Bring all your gear.',
    tipGood: 'Good conditions for fishing. Recommended time to fish.',
    tipModerate: 'Decent conditions. Early morning or dusk might be better.',
    tipPoor: 'Challenging conditions. Try deep water fishing or catfish.',
    readyToGoFishing: 'Ready to Go Fishing?',
    checkOutGear: 'Check out our premium fishing gear selection',
    shopAllProducts: 'Shop All Products',
    failedFetchWeather: 'Failed to fetch weather',
    excellent: 'Excellent',
    good: 'Good',
    moderate: 'Moderate',
    poor: 'Poor',
    perfect: 'Perfect',
    veryGood: 'Very Good',
    fair: 'Fair',
    challenging: 'Challenging',
    inStockCount: (count) => `In stock (${count})`
  },
  lv: {
    navHome: 'SĀKUMS',
    navAllProducts: 'Visi produkti',
    navAdmin: 'Administrators',
    navLogout: 'Izrakstīties',
    navSignUp: 'Reģistrēties',
    navLogIn: 'Pieslēgties',
    navCart: 'Grozs',
    allProducts: 'Visi produkti',
    aboutUs: 'Par mums',
    contacts: 'Kontakti',
    language: 'Valoda',
    loadingProducts: 'Ielādē produktus...',
    noProductsFound: 'Produkti nav atrasti',
    addToCart: 'Pievienot grozam',
    addedToCart: 'pievienots grozam!',
    noDescription: 'Apraksts nav pieejams',
    filter: 'Filtrs',
    allRods: 'Visi makšķerkāti',
    casting: 'Mešanas',
    fishingFloat: 'Pludiņš',
    baitCasting: 'Baitcasting',
    angling: 'Makšķerēšana',
    allReels: 'Visas spoles',
    spinning: 'Spininga',
    allLine: 'Visa aukla',
    braided: 'Pītā',
    monofilament: 'Monofils',
    fluorocarbon: 'Fluorkarbon',
    allLures: 'Visas ēsmas',
    crankbait: 'Vobleris',
    jig: 'Džigs',
    spoon: 'Karote',
    softBait: 'Mīkstā ēsma',
    allStorage: 'Somas/kastes',
    tackleBox: 'Piederumu kaste',
    backpack: 'Mugursoma',
    allHooks: 'Visi āķi',
    single: 'Vienžubura',
    treble: 'Trīsžuburu',
    allWeights: 'Visi svari',
    sinker: 'Svins',
    splitShot: 'Skrotis',
    allNets: 'Visi tīkli',
    landing: 'Uztveramais tīkls',
    allClothing: 'Viss apģērbs',
    gloves: 'Cimdi',
    jacket: 'Jaka',
    wadingPants: 'Brienamās bikses',
    pants: 'Bikses',
    fishingShoes: 'Makšķerēšanas apavi',
    cartEmptyTitle: 'Jūsu grozs ir tukšs',
    cartEmptyText: 'Turpiniet iepirkties, lai pievienotu preces',
    continueShopping: 'Turpināt iepirkties',
    shoppingCart: 'Iepirkumu grozs',
    product: 'Produkts',
    price: 'Cena',
    quantity: 'Daudzums',
    total: 'Kopā',
    action: 'Darbība',
    remove: 'Noņemt',
    subtotal: 'Starpsumma',
    shipping: 'Piegāde',
    free: 'Bezmaksas',
    proceedToCheckout: 'Pāriet uz apmaksu',
    loadingProduct: 'Ielādē produktu...',
    productNotFound: 'Produkts nav atrasts',
    shop: 'Veikals',
    category: 'Kategorija',
    inStock: 'Noliktavā',
    outOfStock: 'Nav noliktavā',
    available: 'pieejams',
    pleaseLoginToCart: 'Lūdzu pieslēdzieties, lai pievienotu preces grozam',
    invalidQuantity: 'Nederīgs daudzums',
    aboutTitle: 'Par FishingGear Pro',
    aboutText: 'Laipni lūdzam FishingGear Pro - jūsu galamērķis kvalitatīvam makšķerēšanas aprīkojumam. Mēs nodrošinām augstas kvalitātes inventāru neaizmirstamai makšķerēšanas pieredzei.',
    ourMission: 'Mūsu misija',
    missionText: 'Nodrošināt kvalitatīvus makšķerēšanas produktus par pieejamām cenām un izcilu klientu apkalpošanu.',
    editableTextTitle: 'Raksti savu tekstu',
    editableTextPlaceholder: 'Raksti savu tekstu šeit...',
    downloadTextFile: 'Lejupielādēt teksta failu',
    contactUs: 'Sazinieties ar mums',
    contactSubtitle: 'Mēs priecāsimies jūs dzirdēt. Nosūtiet mums ziņu!',
    name: 'Vārds',
    email: 'E-pasts',
    message: 'Ziņa',
    sending: 'Sūta...',
    sendMessage: 'Nosūtīt ziņu',
    thankYouMessage: 'Paldies par ziņu. Mēs drīz ar jums sazināsimies!',
    sendFailed: 'Ziņu neizdevās nosūtīt. Lūdzu mēģiniet vēlreiz.',
    login: 'Pieslēgties',
    username: 'Lietotājvārds',
    password: 'Parole',
    loggingIn: 'Pieslēdzas...',
    loginSuccess: 'Pieslēgšanās veiksmīga!',
    loginFailed: 'Pieslēgšanās neizdevās',
    dontHaveAccount: 'Nav konta?',
    register: 'Reģistrēties',
    registerTitle: 'Reģistrācija',
    confirmPassword: 'Apstipriniet paroli',
    passwordMustContain: 'Parolei jāsatur:',
    atLeast8Characters: 'Vismaz 8 rakstzīmes',
    atLeast1Uppercase: 'Vismaz 1 lielais burts (A-Z)',
    atLeast1Special: 'Vismaz 1 speciālā rakstzīme (@, !, #, $, %, utt.)',
    passwordNoSpaces: 'Parolei nevar būt atstarpes sākumā vai beigās',
    passwordMismatch: 'Paroles nesakrīt',
    registering: 'Reģistrē...',
    alreadyHaveAccount: 'Jau ir konts?',
    registrationSuccess: 'Reģistrācija veiksmīga! Novirza uz pieslēgšanos...',
    registrationFailed: 'Reģistrācija neizdevās',
    adminAccessRequired: 'Nepieciešama administratora pieeja',
    backToShop: 'Atpakaļ uz veikalu',
    adminPanel: 'Administratora panelis',
    failedLoadAdminData: 'Neizdevās ielādēt administratora datus',
    nameCategoryPriceRequired: 'Nosaukums, kategorija un cena ir obligāti',
    productUpdatedSuccessfully: 'Produkts veiksmīgi atjaunots',
    productAddedSuccessfully: 'Produkts veiksmīgi pievienots',
    failedSaveProduct: 'Neizdevās saglabāt produktu',
    confirmDeleteProduct: 'Dzēst šo produktu?',
    productDeleted: 'Produkts izdzēsts',
    failedDeleteProduct: 'Neizdevās dzēst produktu',
    productMarkedSoldOut: 'Produkts atzīmēts kā izpārdots',
    failedUpdateProduct: 'Neizdevās atjaunināt produktu',
    editProduct: 'Rediģēt produktu',
    addNewProduct: 'Pievienot jaunu produktu',
    productName: 'Produkta nosaukums',
    stock: 'Krājums',
    categoryExisting: 'Kategorija (esoša)',
    selectCategory: 'Izvēlieties kategoriju',
    newCategory: 'Jauna kategorija',
    createNewCategory: 'Izveidot jaunu kategoriju',
    imageOptional: 'Attēls (neobligāti)',
    imagePlaceholder: 'attēla faila nosaukums vai URL',
    description: 'Apraksts',
    saving: 'Saglabā...',
    adding: 'Pievieno...',
    saveChanges: 'Saglabāt izmaiņas',
    addProduct: 'Pievienot produktu',
    cancelEdit: 'Atcelt rediģēšanu',
    manageProducts: 'Pārvaldīt produktus',
    status: 'Statuss',
    soldOut: 'Izpārdots',
    markSoldOut: 'Atzīmēt kā izpārdotu',
    edit: 'Rediģēt',
    delete: 'Dzēst',
    weatherConsentTitle: 'Atļaut laikapstākļus un atrašanās vietu?',
    weatherConsentText: 'Lai rādītu laikapstākļus un makšķerēšanas apstākļus, mums vajag jūsu atrašanās vietu. Izvēle tiek saglabāta sīkdatnē.',
    allow: 'Atļaut',
    decline: 'Noraidīt',
    loadingWeatherData: 'Ielādē laikapstākļu datus...',
    humidity: 'Mitrums',
    wind: 'Vējš',
    fishingConditions: 'Makšķerēšanas apstākļi',
    overallQuality: 'Kopējā kvalitāte',
    bestFishToday: 'Labākās zivis šodien:',
    method: 'Metode',
    location: 'Vieta',
    tip: 'Padoms',
    tipExcellent: 'Ideāla diena! Ņemiet līdzi visu ekipējumu.',
    tipGood: 'Labi apstākļi makšķerēšanai. Ieteicams doties makšķerēt.',
    tipModerate: 'Vidēji apstākļi. Labāks laiks var būt agri no rīta vai krēslā.',
    tipPoor: 'Sarežģīti apstākļi. Mēģiniet dziļākos ūdeņos vai sams.',
    readyToGoFishing: 'Gatavs doties makšķerēt?',
    checkOutGear: 'Apskatiet mūsu premium makšķerēšanas inventāru',
    shopAllProducts: 'Skatīt visus produktus',
    failedFetchWeather: 'Neizdevās ielādēt laikapstākļus',
    excellent: 'Izcili',
    good: 'Labi',
    moderate: 'Vidēji',
    poor: 'Slikti',
    perfect: 'Perfekti',
    veryGood: 'Ļoti labi',
    fair: 'Pieņemami',
    challenging: 'Sarežģīti',
    inStockCount: (count) => `Noliktavā (${count})`
  }
}

const VALID_PAGES = new Set(['home', 'product', 'cart', 'about', 'contact', 'login', 'register', 'admin'])

const getRouteFromUrl = () => {
  const path = (window.location.pathname || '/').replace(/\/+$/, '') || '/'
  const search = new URLSearchParams(window.location.search)

  if (path === '/') return { page: 'home', params: { showShop: false } }
  if (path === '/shop') {
    const category = search.get('category')
    const params = { showShop: true }
    if (category) params.category = category
    return { page: 'home', params }
  }
  if (path === '/cart') return { page: 'cart', params: {} }
  if (path === '/about') return { page: 'about', params: {} }
  if (path === '/contact') return { page: 'contact', params: {} }
  if (path === '/login') return { page: 'login', params: {} }
  if (path === '/register') return { page: 'register', params: {} }
  if (path === '/admin') return { page: 'admin', params: {} }

  const productMatch = path.match(/^\/product\/(\d+)$/)
  if (productMatch) {
    return { page: 'product', params: { id: parseInt(productMatch[1], 10) } }
  }

  // Backward-compatible fallback for existing query links
  const page = search.get('page')
  const safePage = VALID_PAGES.has(page) ? page : 'home'
  const params = {}

  if (safePage === 'product') {
    const id = parseInt(search.get('id') || '0', 10)
    if (id > 0) params.id = id
  }

  if (safePage === 'home') {
    params.showShop = search.get('showShop') === '1'
    const category = search.get('category')
    if (category) params.category = category
  }

  return { page: safePage, params }
}

const buildUrlFromRoute = (page, params = {}) => {
  if (page === 'home' && params.showShop) {
    if (params.category) {
      return `/shop?category=${encodeURIComponent(params.category)}`
    }
    return '/shop'
  }
  if (page === 'home') return '/'
  if (page === 'product' && params.id) return `/product/${params.id}`
  if (page === 'cart') return '/cart'
  if (page === 'about') return '/about'
  if (page === 'contact') return '/contact'
  if (page === 'login') return '/login'
  if (page === 'register') return '/register'
  if (page === 'admin') return '/admin'
  return '/'
}

const WEATHER_CONSENT_COOKIE = 'weather_consent'

const getWeatherConsent = () => {
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${WEATHER_CONSENT_COOKIE}=`))

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : 'unset'
}

const setWeatherConsentCookie = (value) => {
  const expires = new Date()
  expires.setDate(expires.getDate() + 180)
  document.cookie = `${WEATHER_CONSENT_COOKIE}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
}

export default function App() {
  const initialRoute = getRouteFromUrl()
  const [currentPage, setCurrentPage] = useState(initialRoute.page)
  const [pageParams, setPageParams] = useState(initialRoute.params)
  const [menuOpen, setMenuOpen] = useState(false)
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en')
  const [weatherConsent, setWeatherConsent] = useState('unset')
  const { user, login, logout } = useAuth()
  const { items, count, addItem, removeItem, clearCart } = useCart()
  const t = translations[language] || translations.en

  useEffect(() => {
    const consent = getWeatherConsent()
    if (consent === 'accepted' || consent === 'declined') {
      setWeatherConsent(consent)
      return
    }

    setWeatherConsent('unset')
  }, [])

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  useEffect(() => {
    const normalizedUrl = buildUrlFromRoute(currentPage, pageParams)
    window.history.replaceState({ page: currentPage, params: pageParams }, '', normalizedUrl)
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      const route = getRouteFromUrl()
      setCurrentPage(route.page)
      setPageParams(route.params)
      window.scrollTo(0, 0)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (page, params = {}, options = {}) => {
    const { replace = false, skipHistory = false } = options
    setCurrentPage(page)
    setPageParams(params)

    if (!skipHistory) {
      const nextUrl = buildUrlFromRoute(page, params)
      if (replace) {
        window.history.replaceState({ page, params }, '', nextUrl)
      } else {
        window.history.pushState({ page, params }, '', nextUrl)
      }
    }

    window.scrollTo(0, 0)
  }

  const handleLogout = async () => {
    await logout()
    navigate('home')
  }

  const handleLogin = async (username, password) => {
    const result = await login(username, password)
    if (result.success) {
      navigate('home')
    }
    return result
  }

  const handleAddToCart = (product, quantity) => {
    addItem(product, quantity)
  }

  const handleWeatherConsent = (status) => {
    setWeatherConsentCookie(status)
    setWeatherConsent(status)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return pageParams.showShop ? (
          <Home
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            language={language}
            setLanguage={setLanguage}
            initialCategory={pageParams.category || null}
            t={t}
          />
        ) : (
          <HomeLanding
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            weatherConsent={weatherConsent}
            language={language}
            t={t}
          />
        )
      case 'product':
        return <Product productId={pageParams.id} onNavigate={navigate} onAddToCart={handleAddToCart} user={user} language={language} t={t} />
      case 'cart':
        return <Cart cartItems={items} onNavigate={navigate} onRemoveItem={removeItem} onClearCart={clearCart} t={t} />
      case 'about':
        return <About t={t} />
      case 'contact':
        return <Contact t={t} />
      case 'login':
        return <Login onNavigate={navigate} onLogin={handleLogin} t={t} />
      case 'register':
        return <Register onNavigate={navigate} onRegisterSuccess={() => navigate('login')} t={t} />
      case 'admin':
        return <Admin onNavigate={navigate} user={user} t={t} />
      default:
        return (
          <HomeLanding
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            weatherConsent={weatherConsent}
            language={language}
            t={t}
          />
        )
    }
  }

  return (
    <>
      <Navbar
        user={user}
        cartCount={count}
        onLogout={handleLogout}
        onNavigate={navigate}
        t={t}
      />

      {weatherConsent === 'unset' && (
        <div className="weather-consent-popup" role="dialog" aria-modal="true">
          <div className="weather-consent-modal">
            <h2>{t.weatherConsentTitle}</h2>
            <p>
              {t.weatherConsentText}
            </p>
            <div className="weather-consent-actions">
              <button className="btn btn-primary" onClick={() => handleWeatherConsent('accepted')}>
                {t.allow}
              </button>
              <button className="btn btn-secondary" onClick={() => handleWeatherConsent('declined')}>
                {t.decline}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        {renderPage()}
      </div>
    </>
  )
}
