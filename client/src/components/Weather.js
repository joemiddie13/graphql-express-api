import { useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import WeatherDisplay from './WeatherDisplay'

// Define the GraphQL query
const GET_WEATHER = gql`
  query GetWeather($zip: Int!, $units: Units) {
    getWeather(zip: $zip, units: $units) {
      temperature
      description
      feels_like
      temp_min
      temp_max
      humidity
      pressure
      wind {
        speed
        deg
      }
      coordinates {
        lat
        lon
      }
      clouds {
        all
      }
      cod
      message
    }
  }
`

function Weather() {
  const [zip, setZip] = useState('')
  const [units, setUnits] = useState('imperial')
  const [validationError, setValidationError] = useState('')
  
  const [getWeather, { loading, error, data }] = useLazyQuery(GET_WEATHER)

  const handleSubmit = (e) => {
    e.preventDefault()
    setValidationError('')

    // Validate ZIP code
    if (!/^\d{5}$/.test(zip)) {
      setValidationError('Please enter a valid 5-digit ZIP code')
      return
    }

    getWeather({ 
      variables: { 
        zip: parseInt(zip), 
        units 
      },
      onError: (error) => {
        console.error('GraphQL Error:', error)
      }
    })
  }

  const getUnitSymbol = () => {
    switch(units) {
      case 'metric': return '°C'
      case 'imperial': return '°F'
      default: return 'K'
    }
  }

  return (
    <div className="Weather">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="Enter ZIP code"
          className={validationError ? 'error' : ''}
        />
        <select value={units} onChange={(e) => setUnits(e.target.value)}>
          <option value="imperial">Fahrenheit</option>
          <option value="metric">Celsius</option>
          <option value="standard">Kelvin</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </form>

      {validationError && <p className="error-message">{validationError}</p>}
      {error && <p className="error-message">Error: {error.message}</p>}
      
      {data?.getWeather?.cod !== 200 && data?.getWeather?.message && (
        <p className="error-message">Error: {data.getWeather.message}</p>
      )}

      {data?.getWeather?.cod === 200 && (
        <WeatherDisplay 
          weather={data.getWeather} 
          units={units}
        />
      )}
    </div>
  )
}

export default Weather
