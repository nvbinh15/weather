import { getWeather } from "../utils/weatherCodes";
import PixelWeatherScene from "./PixelWeatherScene";
import "./WeatherCard.css";

export default function WeatherCard({ city, data, loading, error, onRemove }) {
  const weatherType = data ? getWeather(data.current.weather_code).type : "clear";

  if (loading) {
    return (
      <div className="weather-card">
        <PixelWeatherScene type="clear" />
        <div className="card-body">
          <h2>{city}</h2>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-card">
        <PixelWeatherScene type="overcast" />
        <div className="card-body">
          <h2>{city}</h2>
          <p className="error-text">Failed to load data</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const current = data.current;
  const weather = getWeather(current.weather_code);

  return (
    <div className="weather-card">
      <PixelWeatherScene type={weather.type} />
      {onRemove && (
        <button className="remove-btn" onClick={onRemove} title="Remove city">
          x
        </button>
      )}
      <div className="card-body">
        <h2>{city}</h2>
        <p className="weather-description">{weather.description}</p>
        <div className="temp-main">{Math.round(current.temperature_2m)}°C</div>
        <div className="weather-details">
          <div className="detail">
            <span className="label">Feels</span>
            <span className="value">{Math.round(current.apparent_temperature)}°C</span>
          </div>
          <div className="detail">
            <span className="label">Humid</span>
            <span className="value">{current.relative_humidity_2m}%</span>
          </div>
          <div className="detail">
            <span className="label">Wind</span>
            <span className="value">{current.wind_speed_10m} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
