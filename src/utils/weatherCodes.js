const weatherCodes = {
  0: { description: "Clear sky", type: "clear" },
  1: { description: "Mainly clear", type: "clear" },
  2: { description: "Partly cloudy", type: "cloudy" },
  3: { description: "Overcast", type: "overcast" },
  45: { description: "Foggy", type: "fog" },
  48: { description: "Rime fog", type: "fog" },
  51: { description: "Light drizzle", type: "drizzle" },
  53: { description: "Drizzle", type: "drizzle" },
  55: { description: "Dense drizzle", type: "drizzle" },
  61: { description: "Slight rain", type: "rain" },
  63: { description: "Rain", type: "rain" },
  65: { description: "Heavy rain", type: "heavyrain" },
  71: { description: "Slight snow", type: "snow" },
  73: { description: "Snow", type: "snow" },
  75: { description: "Heavy snow", type: "snow" },
  80: { description: "Rain showers", type: "rain" },
  81: { description: "Rain showers", type: "heavyrain" },
  82: { description: "Violent showers", type: "storm" },
  95: { description: "Thunderstorm", type: "storm" },
  96: { description: "Thunderstorm + hail", type: "storm" },
  99: { description: "Thunderstorm + hail", type: "storm" },
};

export function getWeather(code) {
  return weatherCodes[code] || { description: "Unknown", type: "clear" };
}
