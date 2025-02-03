// Import dependencies
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const fetch = require('node-fetch')
const cors = require('cors')
require('dotenv').config()

// Initialize express
const app = express()

// Enable CORS
app.use(cors())

// Basic schema setup
const schema = buildSchema(`
  enum Units {
    standard
    metric
    imperial
  }

  type Wind {
    speed: Float
    deg: Int
    gust: Float
  }

  type Coordinates {
    lat: Float
    lon: Float
  }

  type Clouds {
    all: Int
  }

  type Weather {
    temperature: Float
    description: String
    feels_like: Float
    temp_min: Float
    temp_max: Float
    pressure: Int
    humidity: Int
    wind: Wind
    coordinates: Coordinates
    clouds: Clouds
    cod: Int
    message: String
  }

  type Query {
    getWeather(zip: Int!, units: Units): Weather!
    getWeatherByCoords(lat: Float!, lon: Float!, units: Units): Weather!
  }
`)

// Resolver
const root = {
  getWeather: async ({ zip, units = 'imperial' }) => {
    const apikey = process.env.OPENWEATHERMAP_API_KEY
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apikey}&units=${units}`
    
    const res = await fetch(url)
    const json = await res.json()
    
    // Handle both successful and error responses
    return {
      temperature: json.cod === 200 ? json.main.temp : null,
      description: json.cod === 200 ? json.weather[0].description : null,
      feels_like: json.cod === 200 ? json.main.feels_like : null,
      temp_min: json.cod === 200 ? json.main.temp_min : null,
      temp_max: json.cod === 200 ? json.main.temp_max : null,
      pressure: json.cod === 200 ? json.main.pressure : null,
      humidity: json.cod === 200 ? json.main.humidity : null,
      wind: json.cod === 200 ? {
        speed: json.wind.speed,
        deg: json.wind.deg,
        gust: json.wind.gust
      } : null,
      coordinates: json.cod === 200 ? {
        lat: json.coord.lat,
        lon: json.coord.lon
      } : null,
      clouds: json.cod === 200 ? {
        all: json.clouds.all
      } : null,
      cod: parseInt(json.cod),
      message: json.message
    }
  },
  
  getWeatherByCoords: async ({ lat, lon, units = 'imperial' }) => {
    const apikey = process.env.OPENWEATHERMAP_API_KEY
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=${units}`
    
    const res = await fetch(url)
    const json = await res.json()
    
    return {
      temperature: json.cod === 200 ? json.main.temp : null,
      description: json.cod === 200 ? json.weather[0].description : null,
      feels_like: json.cod === 200 ? json.main.feels_like : null,
      temp_min: json.cod === 200 ? json.main.temp_min : null,
      temp_max: json.cod === 200 ? json.main.temp_max : null,
      pressure: json.cod === 200 ? json.main.pressure : null,
      humidity: json.cod === 200 ? json.main.humidity : null,
      wind: json.cod === 200 ? {
        speed: json.wind.speed,
        deg: json.wind.deg,
        gust: json.wind.gust
      } : null,
      coordinates: json.cod === 200 ? {
        lat: json.coord.lat,
        lon: json.coord.lon
      } : null,
      clouds: json.cod === 200 ? {
        all: json.clouds.all
      } : null,
      cod: parseInt(json.cod),
      message: json.message
    }
  }
}

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}))

// Start server
const port = 4000
app.listen(port, () => {
  console.log('Running on port:' + port)
})