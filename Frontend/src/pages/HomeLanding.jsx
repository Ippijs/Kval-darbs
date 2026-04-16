import { useState, useEffect } from 'react'
import Alert from '../components/Alert'

export default function HomeLanding({ onNavigate, onAddToCart, menuOpen, setMenuOpen, weatherConsent, language, t }) {
  const [weather, setWeather] = useState(null)
  const [fishingConditions, setFishingConditions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)
  const [location, setLocation] = useState(null)

  useEffect(() => {
    if (weatherConsent === 'accepted') {
      setLoading(true)
      getLocationAndWeather()
      return
    }

    setLoading(false)
    setWeather(null)
    setFishingConditions(null)
    setLocation(null)
  }, [weatherConsent])

  const fallbackToDefaultLocation = () => {
    fetchWeather(56.9496, 24.1052)
  }

  const fetchWeatherFromIp = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()

      if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        setLocation({ latitude: data.latitude, longitude: data.longitude })
        fetchWeather(data.latitude, data.longitude)
        return
      }
    } catch (error) {
      // Ignore and use default location below
    }

    fallbackToDefaultLocation()
  }

  const getLocationAndWeather = () => {
    const isLocalhost =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

    const canUseBrowserGeolocation = 'geolocation' in navigator && (window.isSecureContext || isLocalhost)

    if (canUseBrowserGeolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ latitude, longitude })
          fetchWeather(latitude, longitude)
        },
        (error) => {
          console.log('Geolocation error:', error)
          fetchWeatherFromIp()
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 600000
        }
      )
      return
    }

    fetchWeatherFromIp()
  }

  const fetchWeather = async (latitude, longitude) => {
    try {
      // Using Open-Meteo API (free, no key required)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
      )
      const data = await response.json()
      setWeather(data)
      calculateFishingConditions(data)
    } catch (error) {
      setAlert({ type: 'error', message: t.failedFetchWeather })
    } finally {
      setLoading(false)
    }
  }

  const calculateFishingConditions = (weatherData) => {
    const current = weatherData.current
    const temp = current.temperature_2m
    const humidity = current.relative_humidity_2m
    const wind = current.wind_speed_10m
    const precipitation = current.precipitation

    let condition = 'Fair'
    let quality = 'Moderate'
    let fish = []
    let score = 0

    // Temperature check (15-20°C is ideal)
    if (temp >= 15 && temp <= 20) {
      score += 3
    } else if (temp >= 10 && temp <= 25) {
      score += 2
    } else if (temp >= 5 && temp <= 30) {
      score += 1
    }

    // Humidity check (60-80% is good)
    if (humidity >= 60 && humidity <= 80) {
      score += 2
    } else if (humidity >= 50 && humidity <= 90) {
      score += 1
    }

    // Wind check (calm to light breeze is good)
    if (wind < 5) {
      score += 3
    } else if (wind < 10) {
      score += 2
    } else if (wind < 15) {
      score += 1
    } else {
      score -= 1
    }

    // Precipitation check
    if (precipitation === 0) {
      score += 1
    } else if (precipitation > 5) {
      score -= 1
    }

    // Determine quality and fish list
    if (score >= 9) {
      quality = 'Excellent'
      condition = 'Perfect'
      fish = [
        { name: 'Līdaka (Pike)', method: 'Spinning, jerkbaits, spoons', methodLv: 'Spiningošana, džerki, šūpiņi', location: 'Shallow waters, weed beds', locationLv: 'Sekli ūdeņi, zāļu joslas', icon: '🐟' },
        { name: 'Asaris (Perch)', method: 'Drop shot, jigs, live bait', methodLv: 'Dropshots, džigi, dzīva ēsma', location: 'Rocky areas, near structures', locationLv: 'Akmeņainas vietas, pie struktūrām', icon: '🐠' },
        { name: 'Forele (Trout)', method: 'Fly fishing, spinners, worms', methodLv: 'Mušiņmakšķerēšana, rotiņi, tārpi', location: 'Flowing rivers, cold streams', locationLv: 'Tekošas upes, aukstas straumes', icon: '🎣' },
        { name: 'Karpa (Carp)', method: 'Boilies, corn, method feeder', methodLv: 'Boilas, kukurūza, method feederis', location: 'Lakes, slow rivers', locationLv: 'Ezeri, lēnas upes', icon: '🐟' }
      ]
    } else if (score >= 7) {
      quality = 'Good'
      condition = 'Very Good'
      fish = [
        { name: 'Asaris (Perch)', method: 'Jigs, worms, small lures', methodLv: 'Džigi, tārpi, mazas ēsmas', location: 'Near bottom, structures', locationLv: 'Pie grunts, pie struktūrām', icon: '🐠' },
        { name: 'Karpa (Carp)', method: 'Corn, pellets, hair rigs', methodLv: 'Kukurūza, granulas, matiņu sistēma', location: 'Warm shallow waters', locationLv: 'Silti seklumi', icon: '🐟' },
        { name: 'Breksis (Bream)', method: 'Bottom fishing, feeder, maggots', methodLv: 'Gruntsmakšķere, feederis, kāpuri', location: 'Deep pools, slow waters', locationLv: 'Dziļas bedres, lēni ūdeņi', icon: '🐟' },
        { name: 'Rauda (Roach)', method: 'Float fishing, bread, maggots', methodLv: 'Pludiņmakšķere, maize, kāpuri', location: 'Mid-water, near reeds', locationLv: 'Vidējie slāņi, pie niedrēm', icon: '🐠' },
        { name: 'Zandarts (Zander)', method: 'Jigs, live fish, trolling', methodLv: 'Džigi, dzīva zivtiņa, velcēšana', location: 'Deep water, twilight hours', locationLv: 'Dziļi ūdeņi, krēsla', icon: '🎣' }
      ]
    } else if (score >= 5) {
      quality = 'Moderate'
      condition = 'Fair'
      fish = [
        { name: 'Breksis (Bream)', method: 'Feeder fishing, groundbait', methodLv: 'Feederis, iebarošana', location: 'Deep holes, muddy bottom', locationLv: 'Dziļas bedres, dūņaina grunts', icon: '🐟' },
        { name: 'Rauda (Roach)', method: 'Float, small hooks, bread', methodLv: 'Pludiņš, mazi āķi, maize', location: 'Shallow waters, canals', locationLv: 'Sekli ūdeņi, kanāli', icon: '🐠' },
        { name: 'Līnis (Tench)', method: 'Float, worms, corn', methodLv: 'Pludiņš, tārpi, kukurūza', location: 'Weedy areas, muddy bottom', locationLv: 'Zāļainas vietas, dūņaina grunts', icon: '🐟' },
        { name: 'Plaudis (White Bream)', method: 'Bottom fishing, maggots', methodLv: 'Gruntsmakšķere, kāpuri', location: 'Slow rivers, lakes', locationLv: 'Lēnas upes, ezeri', icon: '🐠' },
        { name: 'Karūsa (Crucian)', method: 'Float, small hooks, worms', methodLv: 'Pludiņš, mazi āķi, tārpi', location: 'Ponds, shallow lakes', locationLv: 'Dīķi, sekli ezeri', icon: '🐟' }
      ]
    } else {
      quality = 'Poor'
      condition = 'Challenging'
      fish = [
        { name: 'Sams (Wels Catfish)', method: 'Bottom fishing, large bait, live fish', methodLv: 'Gruntsmakšķere, liela ēsma, dzīva zivtiņa', location: 'Deep waters, night fishing', locationLv: 'Dziļi ūdeņi, nakts makšķerēšana', icon: '🐟' },
        { name: 'Zandarts (Zander)', method: 'Deep jigs, live bait, night', methodLv: 'Dziļie džigi, dzīva ēsma, nakts', location: 'Deep channels, structures', locationLv: 'Dziļi kanāli, pie struktūrām', icon: '🎣' },
        { name: 'Līdaka (Pike)', method: 'Large lures, dead bait', methodLv: 'Lielas ēsmas, beigta ēsma', location: 'Deep waters, cold spots', locationLv: 'Dziļi ūdeņi, aukstie punkti', icon: '🐟' }
      ]
    }

    setFishingConditions({
      quality,
      condition,
      fish,
      score,
      temp,
      humidity,
      wind,
      precipitation
    })
  }

  if (loading) {
    return (
      <div className="home-landing">
        <p>{t.loadingWeatherData}</p>
      </div>
    )
  }

  const qualityLabels = {
    Excellent: t.excellent,
    Good: t.good,
    Moderate: t.moderate,
    Poor: t.poor
  }

  const conditionLabels = {
    Perfect: t.perfect,
    'Very Good': t.veryGood,
    Fair: t.fair,
    Challenging: t.challenging
  }

  return (
    <div className="home-landing">
      <Alert alert={alert} onClose={() => setAlert(null)} />

      {weatherConsent === 'accepted' && weather && fishingConditions && (
        <div className="weather-forecast">
          <div className="weather-card main-card">
            <div className="weather-icon">☀️</div>
            <div className="weather-info">
              <p className="temperature">{fishingConditions.temp}°C</p>
              <p className="condition">{conditionLabels[fishingConditions.condition] || fishingConditions.condition}</p>
              <p className="details">
                {t.humidity}: {fishingConditions.humidity}% | {t.wind}: {fishingConditions.wind} km/h
              </p>
              {location && (
                <p className="location-info">📍 {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°</p>
              )}
            </div>
          </div>

          <div className="fishing-card">
            <h2>🎣 {t.fishingConditions}</h2>
            <div className="condition-quality">
              <p>{t.overallQuality}: <strong>{qualityLabels[fishingConditions.quality] || fishingConditions.quality}</strong></p>
              <div className="quality-bar">
                <div className="quality-fill" style={{ width: `${(fishingConditions.score / 12) * 100}%` }}></div>
              </div>
            </div>

            <div className="fish-recommendation">
              <h3>{t.bestFishToday}</h3>
              <div className="fish-grid">
                {fishingConditions.fish.map((f, i) => (
                  <div key={i} className="fish-card-detail">
                    <div className="fish-header">
                      <span className="fish-icon">{f.icon}</span>
                      <strong>{f.name}</strong>
                    </div>
                    <div className="fish-info">
                      <p><strong>{t.method}:</strong> {language === 'lv' ? (f.methodLv || f.method) : f.method}</p>
                      <p><strong>{t.location}:</strong> {language === 'lv' ? (f.locationLv || f.location) : f.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tips">
              <p>💡 <strong>{t.tip}:</strong>
                {fishingConditions.quality === 'Excellent' && ` ${t.tipExcellent}`}
                {fishingConditions.quality === 'Good' && ` ${t.tipGood}`}
                {fishingConditions.quality === 'Moderate' && ` ${t.tipModerate}`}
                {fishingConditions.quality === 'Poor' && ` ${t.tipPoor}`}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="cta-section">
        <h2>{t.readyToGoFishing}</h2>
        <p>{t.checkOutGear}</p>
        <button className="btn btn-add-cart" onClick={() => onNavigate('home', { showShop: true })}>
          {t.shopAllProducts}
        </button>
      </div>
    </div>
  )
}
