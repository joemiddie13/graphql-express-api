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

const GET_WEATHER_BY_COORDS = gql`
  query GetWeatherByCoords($lat: Float!, $lon: Float!, $units: Units) {
    getWeatherByCoords(lat: $lat, lon: $lon, units: $units) {
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
  const [getWeatherByCoords, { loading: locationLoading, error: locationError, data: locationData }] = 
    useLazyQuery(GET_WEATHER_BY_COORDS)

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

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getWeatherByCoords({
            variables: {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              units
            },
            onError: (error) => {
              console.error('GraphQL Error:', error);
            }
          });
        },
        (error) => {
          setValidationError(`Error getting location: ${error.message}`);
        }
      );
    } else {
      setValidationError("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="Weather">
      <div className="location-options">
        <button 
          type="button" 
          onClick={handleGetLocation}
          className="location-button"
          disabled={locationLoading}
        >
          {locationLoading ? 'Getting Location...' : 'Use My Location'}
        </button>
        <p>- or -</p>
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
      </div>

      {validationError && <p className="error-message">{validationError}</p>}
      {error && <p className="error-message">Error: {error.message}</p>}
      {locationError && <p className="error-message">Error: {locationError.message}</p>}
      
      {(data?.getWeather?.cod === 200 || locationData?.getWeatherByCoords?.cod === 200) && (
        <WeatherDisplay 
          weather={data?.getWeather || locationData?.getWeatherByCoords} 
          units={units}
        />
      )}
    </div>
  )
}

export default Weather
