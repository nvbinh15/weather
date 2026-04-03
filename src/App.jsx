import { useState, useEffect, useCallback } from "react";
import WeatherCard from "./components/WeatherCard";
import "./App.css";

const CITIES = [
  { name: "Singapore", lat: 1.2897, lon: 103.8501 },
  { name: "Ho Chi Minh City", lat: 10.8231, lon: 106.6297 },
];

const API_URL = "https://api.open-meteo.com/v1/forecast";
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

function App() {
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeather = useCallback(async () => {
    for (const city of CITIES) {
      setLoading((prev) => ({ ...prev, [city.name]: true }));
      setErrors((prev) => ({ ...prev, [city.name]: null }));
    }

    const results = await Promise.allSettled(
      CITIES.map(async (city) => {
        const params = new URLSearchParams({
          latitude: city.lat,
          longitude: city.lon,
          current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
        });
        const res = await fetch(`${API_URL}?${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return { city: city.name, data: await res.json() };
      })
    );

    const newData = {};
    const newErrors = {};
    const newLoading = {};

    for (const result of results) {
      if (result.status === "fulfilled") {
        const { city, data } = result.value;
        newData[city] = data;
        newErrors[city] = null;
      } else {
        // Find which city failed based on index
        const idx = results.indexOf(result);
        const cityName = CITIES[idx].name;
        newErrors[cityName] = result.reason.message;
      }
    }

    for (const city of CITIES) {
      newLoading[city.name] = false;
    }

    setWeatherData((prev) => ({ ...prev, ...newData }));
    setErrors((prev) => ({ ...prev, ...newErrors }));
    setLoading(newLoading);
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  return (
    <div className="app">
      <h1 className="title">Weather Now</h1>
      <div className="cards">
        {CITIES.map((city) => (
          <WeatherCard
            key={city.name}
            city={city.name}
            data={weatherData[city.name]}
            loading={loading[city.name]}
            error={errors[city.name]}
          />
        ))}
      </div>
      {lastUpdated && (
        <p className="last-updated">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}

export default App;
