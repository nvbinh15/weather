import { getWeather } from "../utils/weatherCodes";
import "./WeatherCard.css";

export default function WeatherCard({ city, data, loading, error }) {
  if (loading) {
    return (
      <div className="weather-card loading">
        <h2>{city}</h2>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-card error">
        <h2>{city}</h2>
        <p className="error-text">Failed to load weather data</p>
      </div>
    );
  }

  if (!data) return null;

  const current = data.current;
  const weather = getWeather(current.weather_code);

  return (
    <div className="weather-card">
      <h2>{city}</h2>
      <div className="weather-icon">{weather.icon}</div>
      <p className="weather-description">{weather.description}</p>
      <div className="weather-details">
        <div className="detail">
          <span className="label">Temperature</span>
          <span className="value">{current.temperature_2m}°C</span>
        </div>
        <div className="detail">
          <span className="label">Feels like</span>
          <span className="value">{current.apparent_temperature}°C</span>
        </div>
        <div className="detail">
          <span className="label">Humidity</span>
          <span className="value">{current.relative_humidity_2m}%</span>
        </div>
        <div className="detail">
          <span className="label">Wind</span>
          <span className="value">{current.wind_speed_10m} km/h</span>
        </div>
      </div>
    </div>
  );
}
