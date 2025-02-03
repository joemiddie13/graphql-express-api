import React from 'react';

function WeatherDisplay({ weather, units }) {
  const getUnitSymbol = () => {
    switch(units) {
      case 'metric': return '°C'
      case 'imperial': return '°F'
      default: return 'K'
    }
  }

  return (
    <div className="weather-data">
      <h2>{weather.temperature}{getUnitSymbol()}</h2>
      <p>{weather.description}</p>
      <p>Feels like: {weather.feels_like}{getUnitSymbol()}</p>
      <p>Min: {weather.temp_min}{getUnitSymbol()} / Max: {weather.temp_max}{getUnitSymbol()}</p>
      <p>Humidity: {weather.humidity}%</p>
      <p>Wind: {weather.wind.speed} {units === 'imperial' ? 'mph' : 'm/s'} at {weather.wind.deg}°</p>
    </div>
  );
}

export default WeatherDisplay;
