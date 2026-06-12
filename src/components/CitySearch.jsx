import { useState, useEffect, useRef } from "react";
import "./CitySearch.css";

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";

export default function CitySearch({ onAdd, existingIds }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${GEO_URL}?name=${encodeURIComponent(query)}&count=6&language=en`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(result) {
    onAdd({
      id: result.id,
      name: result.name,
      country: result.country || "",
      lat: result.latitude,
      lon: result.longitude,
    });
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div className="city-search" ref={wrapperRef}>
      <div className="search-input-wrapper">
        <span className="search-icon">+</span>
        <input
          type="text"
          placeholder="Add a city..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && (query.length >= 2) && (
        <div className="search-dropdown">
          {searching && <div className="search-status">Searching...</div>}
          {!searching && results.length === 0 && query.length >= 2 && (
            <div className="search-status">No cities found</div>
          )}
          {results.map((r) => {
            const alreadyAdded = existingIds.has(r.id);
            return (
              <button
                key={r.id}
                className={`search-result ${alreadyAdded ? "disabled" : ""}`}
                onClick={() => !alreadyAdded && handleSelect(r)}
                disabled={alreadyAdded}
              >
                <span className="result-name">{r.name}</span>
                <span className="result-country">
                  {[r.admin1, r.country].filter(Boolean).join(", ")}
                </span>
                {alreadyAdded && <span className="result-added">Added</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
