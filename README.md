# GraphQL Weather API Project for ACS 4330 Front End Query Languages

This project demonstrates how to build a GraphQL API using Express.js that fetches weather data from the OpenWeatherMap API. The API allows users to query weather information by ZIP code and supports different unit systems (metric, imperial, standard).

## Prerequisites

- Node.js installed on your system
- OpenWeatherMap API key (sign up at [OpenWeatherMap](https://openweathermap.org/api))
- Basic knowledge of JavaScript and GraphQL

## Setup Instructions

1. Create a new project directory and initialize it:
   ```bash
   mkdir weather-graphql-api
   cd weather-graphql-api
   npm init -y
   ```

2. Install the required dependencies:
   ```bash
   npm install express express-graphql graphql node-fetch dotenv
   ```

3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:
   ```
   OPENWEATHERMAP_API_KEY=your_api_key_here
   ```

4. Create `server.js` in the root directory.

## Project Structure

The project consists of the following main components:

1. Dependencies and Setup
2. GraphQL Schema Definition
3. Resolver Implementation
4. Express Server Configuration

## Implementation Steps

### 1. Setting up Dependencies

First, import all necessary packages:

```javascript
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const fetch = require('node-fetch')
require('dotenv').config()
```

### 2. Define GraphQL Schema

Create a schema that defines the structure of your data:

```graphql
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
}
```

### 3. Implement Resolver

Create a resolver that handles the GraphQL query:

```javascript
const root = {
  getWeather: async ({ zip, units = 'imperial' }) => {
    const apikey = process.env.OPENWEATHERMAP_API_KEY
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apikey}&units=${units}`
    
    const res = await fetch(url)
    const json = await res.json()
    
    return {
      temperature: json.cod === 200 ? json.main.temp : null,
      description: json.cod === 200 ? json.weather[0].description : null,
      // ... other fields
    }
  }
}
```

### 4. Configure Express Server

Set up the Express server with GraphQL middleware:

```javascript
const app = express()

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}))

const port = 4000
app.listen(port, () => {
  console.log('Running on port:' + port)
})
```

## Running the Application

1. Start the server:
   ```bash
   node server.js
   ```

2. Open GraphiQL interface in your browser:
   ```
   http://localhost:4000/graphql
   ```

## Example Query

Try this query in GraphiQL:

```graphql
{
  getWeather(zip: 94040, units: imperial) {
    temperature
    description
    feels_like
    wind {
      speed
      deg
    }
    coordinates {
      lat
      lon
    }
  }
}
```

## Features

- Fetch weather data using ZIP codes
- Support for different unit systems (metric, imperial, standard)
- Detailed weather information including:
  - Temperature (current, feels like, min, max)
  - Wind information (speed, direction, gusts)
  - Location coordinates
  - Cloud coverage
  - Pressure and humidity
- Error handling for invalid requests
- GraphiQL interface for testing queries

## Error Handling

The API includes error handling for:
- Invalid ZIP codes
- API key issues
- Network errors
- Invalid unit specifications

## Contributing

Feel free to fork this repository and submit pull requests for improvements.

## License

MIT License

## Acknowledgments

- OpenWeatherMap API for providing weather data
- Express.js and GraphQL communities for excellent documentation
