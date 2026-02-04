import { useState, useEffect } from 'react'
import Alert from '../components/Alert'

export default function HomeLanding({ onNavigate, onAddToCart, menuOpen, setMenuOpen }) {
  const [weather, setWeather] = useState(null)
  const [fishingConditions, setFishingConditions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)
  const [location, setLocation] = useState(null)

  useEffect(() => {
    getLocationAndWeather()
  }, [])

  const getLocationAndWeather = () => {
    // Try to get user's location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ latitude, longitude })
          fetchWeather(latitude, longitude)
        },
        (error) => {
          console.log('Geolocation error:', error)
          // Fallback to default (Latvia) if geolocation fails
          fetchWeather(56.9496, 24.1052)
        }
      )
    } else {
      // Fallback if geolocation not supported
      fetchWeather(56.9496, 24.1052)
    }
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
      setAlert({ type: 'error', message: 'Failed to fetch weather' })
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
        { name: 'Līdaka (Pike)', method: 'Spinning, jerkbaits, spoons', location: 'Shallow waters, weed beds', icon: '🐟' },
        { name: 'Asaris (Perch)', method: 'Drop shot, jigs, live bait', location: 'Rocky areas, near structures', icon: '🐠' },
        { name: 'Forele (Trout)', method: 'Fly fishing, spinners, worms', location: 'Flowing rivers, cold streams', icon: '🎣' },
        { name: 'Karpa (Carp)', method: 'Boilies, corn, method feeder', location: 'Lakes, slow rivers', icon: '🐟' }
      ]
    } else if (score >= 7) {
      quality = 'Good'
      condition = 'Very Good'
      fish = [
        { name: 'Asaris (Perch)', method: 'Jigs, worms, small lures', location: 'Near bottom, structures', icon: '🐠' },
        { name: 'Karpa (Carp)', method: 'Corn, pellets, hair rigs', location: 'Warm shallow waters', icon: '🐟' },
        { name: 'Breksis (Bream)', method: 'Bottom fishing, feeder, maggots', location: 'Deep pools, slow waters', icon: '🐟' },
        { name: 'Rauda (Roach)', method: 'Float fishing, bread, maggots', location: 'Mid-water, near reeds', icon: '🐠' },
        { name: 'Zandarts (Zander)', method: 'Jigs, live fish, trolling', location: 'Deep water, twilight hours', icon: '🎣' }
      ]
    } else if (score >= 5) {
      quality = 'Moderate'
      condition = 'Fair'
      fish = [
        { name: 'Breksis (Bream)', method: 'Feeder fishing, groundbait', location: 'Deep holes, muddy bottom', icon: '🐟' },
        { name: 'Rauda (Roach)', method: 'Float, small hooks, bread', location: 'Shallow waters, canals', icon: '🐠' },
        { name: 'Līnis (Tench)', method: 'Float, worms, corn', location: 'Weedy areas, muddy bottom', icon: '🐟' },
        { name: 'Plaudis (White Bream)', method: 'Bottom fishing, maggots', location: 'Slow rivers, lakes', icon: '🐠' },
        { name: 'Karūsa (Crucian)', method: 'Float, small hooks, worms', location: 'Ponds, shallow lakes', icon: '🐟' }
      ]
    } else {
      quality = 'Poor'
      condition = 'Challenging'
      fish = [
        { name: 'Sams (Wels Catfish)', method: 'Bottom fishing, large bait, live fish', location: 'Deep waters, night fishing', icon: '🐟' },
        { name: 'Zandarts (Zander)', method: 'Deep jigs, live bait, night', location: 'Deep channels, structures', icon: '🎣' },
        { name: 'Līdaka (Pike)', method: 'Large lures, dead bait', location: 'Deep waters, cold spots', icon: '🐟' }
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
        <p>Loading weather data...</p>
      </div>
    )
  }

  return (
    <div className="home-landing">
      <Alert alert={alert} onClose={() => setAlert(null)} />

      {weather && fishingConditions && (
        <div className="weather-forecast">
          <div className="weather-card main-card">
            <div className="weather-icon">☀️</div>
            <div className="weather-info">
              <p className="temperature">{fishingConditions.temp}°C</p>
              <p className="condition">{fishingConditions.condition}</p>
              <p className="details">
                Humidity: {fishingConditions.humidity}% | Wind: {fishingConditions.wind} km/h
              </p>
              {location && (
                <p className="location-info">📍 {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°</p>
              )}
            </div>
          </div>

          <div className="fishing-card">
            <h2>🎣 Fishing Conditions</h2>
            <div className="condition-quality">
              <p>Overall Quality: <strong>{fishingConditions.quality}</strong></p>
              <div className="quality-bar">
                <div className="quality-fill" style={{ width: `${(fishingConditions.score / 12) * 100}%` }}></div>
              </div>
            </div>

            <div className="fish-recommendation">
              <h3>Best Fish to Catch Today:</h3>
              <div className="fish-grid">
                {fishingConditions.fish.map((f, i) => (
                  <div key={i} className="fish-card-detail">
                    <div className="fish-header">
                      <span className="fish-icon">{f.icon}</span>
                      <strong>{f.name}</strong>
                    </div>
                    <div className="fish-info">
                      <p><strong>Method:</strong> {f.method}</p>
                      <p><strong>Location:</strong> {f.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tips">
              <p>💡 <strong>Tip:</strong> 
                {fishingConditions.quality === 'Excellent' && ' Perfect day to head out! Bring all your gear.'}
                {fishingConditions.quality === 'Good' && ' Good conditions for fishing. Recommended time to fish.'}
                {fishingConditions.quality === 'Moderate' && ' Decent conditions. Early morning or dusk might be better.'}
                {fishingConditions.quality === 'Poor' && ' Challenging conditions. Try deep water fishing or catfish.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="cta-section">
        <h2>Ready to Go Fishing?</h2>
        <p>Check out our premium fishing gear selection</p>
        <button className="btn btn-add-cart" onClick={() => onNavigate('home', { showShop: true })}>
          Shop All Products
        </button>
      </div>
    </div>
  )
}
