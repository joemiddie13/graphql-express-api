import React from 'react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog, WiDust } from 'react-icons/wi';

function WeatherDisplay({ weather, units }) {
  const getUnitSymbol = () => {
    switch(units) {
      case 'metric': return '°C'
      case 'imperial': return '°F'
      default: return 'K'
    }
  }

  const getPressureUnit = () => {
    return 'hPa';
  }

  const getWeatherIcon = () => {
    if (!weather.description) return <WiDaySunny />;
    
    const code = weather.description.toLowerCase();
    if (code.includes('clear')) return <WiDaySunny className="weather-icon" />;
    if (code.includes('cloud')) return <WiCloudy className="weather-icon" />;
    if (code.includes('rain')) return <WiRain className="weather-icon" />;
    if (code.includes('snow')) return <WiSnow className="weather-icon" />;
    if (code.includes('thunder')) return <WiThunderstorm className="weather-icon" />;
    if (code.includes('mist') || code.includes('fog')) return <WiFog className="weather-icon" />;
    if (code.includes('haze') || code.includes('dust')) return <WiDust className="weather-icon" />;
    return <WiDaySunny className="weather-icon" />;
  }

  return (
    <div className="weather-data">
      {getWeatherIcon()}
      <h2>{Math.round(weather.temperature)}{getUnitSymbol()}</h2>
      <p className="description">{weather.description}</p>
      
      <div className="weather-details">
        <div className="detail-item">
          <h4>Feels Like</h4>
          <p>{Math.round(weather.feels_like)}{getUnitSymbol()}</p>
        </div>
        <div className="detail-item">
          <h4>Min/Max</h4>
          <p>{Math.round(weather.temp_min)}/{Math.round(weather.temp_max)}{getUnitSymbol()}</p>
        </div>
        <div className="detail-item">
          <h4>Humidity</h4>
          <p>{weather.humidity}%</p>
        </div>
        <div className="detail-item">
          <h4>Pressure</h4>
          <p>{weather.pressure} {getPressureUnit()}</p>
        </div>
        <div className="detail-item">
          <h4>Wind</h4>
          <p>{Math.round(weather.wind.speed)} {units === 'imperial' ? 'mph' : 'm/s'}</p>
        </div>
        <div className="detail-item">
          <h4>Cloud Coverage</h4>
          <p>{weather.clouds.all}%</p>
        </div>
        <div className="detail-item">
          <h4>Location</h4>
          <p>{weather.coordinates.lat}°N, {weather.coordinates.lon}°E</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherDisplay;
