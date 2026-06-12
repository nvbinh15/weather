import "./PixelWeatherScene.css";

export default function PixelWeatherScene({ type }) {
  return (
    <div className={`pixel-scene ${type}`}>
      {/* Sun */}
      {(type === "clear" || type === "cloudy") && (
        <div className="pixel-sun">
          <div className="sun-core" />
          <div className="sun-ray ray-1" />
          <div className="sun-ray ray-2" />
          <div className="sun-ray ray-3" />
          <div className="sun-ray ray-4" />
        </div>
      )}

      {/* Clouds */}
      {["cloudy", "overcast", "drizzle", "rain", "heavyrain", "storm"].includes(type) && (
        <>
          <div className="pixel-cloud cloud-1" />
          <div className="pixel-cloud cloud-2" />
          {["overcast", "rain", "heavyrain", "storm"].includes(type) && (
            <div className="pixel-cloud cloud-3" />
          )}
        </>
      )}

      {/* Rain drops */}
      {["drizzle", "rain", "heavyrain", "storm"].includes(type) && (
        <div className="rain-container">
          {Array.from({ length: type === "drizzle" ? 8 : type === "heavyrain" || type === "storm" ? 24 : 14 }).map((_, i) => (
            <div
              key={i}
              className="pixel-raindrop"
              style={{
                left: `${(i * 37 + 11) % 100}%`,
                animationDelay: `${(i * 0.17) % 1.2}s`,
                animationDuration: `${0.5 + (i % 3) * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Lightning */}
      {type === "storm" && <div className="pixel-lightning" />}

      {/* Fog layers */}
      {type === "fog" && (
        <>
          <div className="pixel-fog fog-1" />
          <div className="pixel-fog fog-2" />
          <div className="pixel-fog fog-3" />
        </>
      )}

      {/* Snow */}
      {type === "snow" && (
        <div className="snow-container">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="pixel-snowflake"
              style={{
                left: `${(i * 31 + 7) % 100}%`,
                animationDelay: `${(i * 0.25) % 2}s`,
                animationDuration: `${1.5 + (i % 3) * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Ground */}
      <div className="pixel-ground" />
    </div>
  );
}
