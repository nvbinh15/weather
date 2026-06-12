import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "./lib/supabase";
import WeatherCard from "./components/WeatherCard";
import CitySearch from "./components/CitySearch";
import Auth from "./components/Auth";
import PixelAnimals from "./components/PixelAnimals";
import "./App.css";

const DEFAULT_CITIES = [
  { id: 1880252, name: "Singapore", country: "Singapore", lat: 1.2897, lon: 103.8501 },
  { id: 1566083, name: "Ho Chi Minh City", country: "Vietnam", lat: 10.8231, lon: 106.6297 },
];

const STORAGE_KEY = "weather-cities";
const API_URL = "https://api.open-meteo.com/v1/forecast";
const REFRESH_INTERVAL = 10 * 60 * 1000;

function loadLocalCities() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_CITIES;
}

function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load cities: from Supabase if logged in, else localStorage
  useEffect(() => {
    if (authLoading) return;

    if (session) {
      loadSupabaseCities();
    } else {
      setCities(loadLocalCities());
    }
  }, [session, authLoading]);

  async function loadSupabaseCities() {
    const { data, error } = await supabase
      .from("user_cities")
      .select("*")
      .order("position", { ascending: true });

    if (error) {
      console.error("Failed to load cities:", error);
      setCities(loadLocalCities());
      return;
    }

    if (data.length === 0) {
      // First login: migrate localStorage cities to Supabase
      const localCities = loadLocalCities();
      await syncCitiesToSupabase(localCities);
      setCities(localCities);
    } else {
      setCities(
        data.map((row) => ({
          id: row.city_id,
          name: row.name,
          country: row.country,
          lat: row.lat,
          lon: row.lon,
        }))
      );
    }
  }

  async function syncCitiesToSupabase(cityList) {
    if (!session) return;
    const rows = cityList.map((c, i) => ({
      user_id: session.user.id,
      city_id: c.id,
      name: c.name,
      country: c.country || "",
      lat: c.lat,
      lon: c.lon,
      position: i,
    }));
    if (rows.length > 0) {
      await supabase.from("user_cities").upsert(rows, { onConflict: "user_id,city_id" });
    }
  }

  // Save cities
  useEffect(() => {
    if (authLoading || cities.length === 0) return;
    if (!session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
    }
  }, [cities, session, authLoading]);

  // Fetch weather
  const fetchWeather = useCallback(async (cityList) => {
    if (cityList.length === 0) return;

    for (const city of cityList) {
      setLoading((prev) => ({ ...prev, [city.id]: true }));
      setErrors((prev) => ({ ...prev, [city.id]: null }));
    }

    const results = await Promise.allSettled(
      cityList.map(async (city) => {
        const params = new URLSearchParams({
          latitude: city.lat,
          longitude: city.lon,
          current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
        });
        const res = await fetch(`${API_URL}?${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return { id: city.id, data: await res.json() };
      })
    );

    const newData = {};
    const newErrors = {};
    const newLoading = {};

    results.forEach((result, idx) => {
      const cityId = cityList[idx].id;
      if (result.status === "fulfilled") {
        newData[cityId] = result.value.data;
        newErrors[cityId] = null;
      } else {
        newErrors[cityId] = result.reason.message;
      }
      newLoading[cityId] = false;
    });

    setWeatherData((prev) => ({ ...prev, ...newData }));
    setErrors((prev) => ({ ...prev, ...newErrors }));
    setLoading((prev) => ({ ...prev, ...newLoading }));
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    if (cities.length === 0) return;
    fetchWeather(cities);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => fetchWeather(cities), REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [cities, fetchWeather]);

  async function handleAddCity(city) {
    const updated = [...cities, city];
    setCities(updated);
    if (session) {
      await supabase.from("user_cities").insert({
        user_id: session.user.id,
        city_id: city.id,
        name: city.name,
        country: city.country || "",
        lat: city.lat,
        lon: city.lon,
        position: updated.length - 1,
      });
    }
  }

  async function handleRemoveCity(id) {
    setCities((prev) => prev.filter((c) => c.id !== id));
    setWeatherData((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (session) {
      await supabase
        .from("user_cities")
        .delete()
        .eq("user_id", session.user.id)
        .eq("city_id", id);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setCities(loadLocalCities());
  }

  const existingIds = new Set(cities.map((c) => c.id));

  if (authLoading) {
    return (
      <div className="app">
        <h1 className="title">Weather Now</h1>
        <p className="loading-hint">Loading...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <PixelAnimals />
      <header className="app-header">
        <h1 className="title">Weather Now</h1>
        {session ? (
          <div className="user-bar">
            <span className="user-email">{session.user.email}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <p className="guest-hint">Login to sync cities across devices</p>
        )}
      </header>

      {!session && <Auth />}

      <CitySearch onAdd={handleAddCity} existingIds={existingIds} />
      <div className="cards">
        {cities.map((city) => (
          <WeatherCard
            key={city.id}
            city={city.name}
            data={weatherData[city.id]}
            loading={loading[city.id]}
            error={errors[city.id]}
            onRemove={() => handleRemoveCity(city.id)}
          />
        ))}
      </div>
      {cities.length === 0 && (
        <p className="empty-hint">Search for a city above to get started!</p>
      )}
      {lastUpdated && cities.length > 0 && (
        <p className="last-updated">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}

export default App;
