const weatherCodes = {
  0: { description: "Clear sky", icon: "\u2600\uFE0F" },
  1: { description: "Mainly clear", icon: "\U0001F324\uFE0F" },
  2: { description: "Partly cloudy", icon: "\u26C5" },
  3: { description: "Overcast", icon: "\u2601\uFE0F" },
  45: { description: "Foggy", icon: "\U0001F32B\uFE0F" },
  48: { description: "Depositing rime fog", icon: "\U0001F32B\uFE0F" },
  51: { description: "Light drizzle", icon: "\U0001F326\uFE0F" },
  53: { description: "Moderate drizzle", icon: "\U0001F326\uFE0F" },
  55: { description: "Dense drizzle", icon: "\U0001F326\uFE0F" },
  61: { description: "Slight rain", icon: "\U0001F327\uFE0F" },
  63: { description: "Moderate rain", icon: "\U0001F327\uFE0F" },
  65: { description: "Heavy rain", icon: "\U0001F327\uFE0F" },
  71: { description: "Slight snow", icon: "\U0001F328\uFE0F" },
  73: { description: "Moderate snow", icon: "\U0001F328\uFE0F" },
  75: { description: "Heavy snow", icon: "\U0001F328\uFE0F" },
  80: { description: "Slight rain showers", icon: "\U0001F326\uFE0F" },
  81: { description: "Moderate rain showers", icon: "\U0001F327\uFE0F" },
  82: { description: "Violent rain showers", icon: "\u26C8\uFE0F" },
  95: { description: "Thunderstorm", icon: "\u26C8\uFE0F" },
  96: { description: "Thunderstorm with slight hail", icon: "\u26C8\uFE0F" },
  99: { description: "Thunderstorm with heavy hail", icon: "\u26C8\uFE0F" },
};

export function getWeather(code) {
  return weatherCodes[code] || { description: "Unknown", icon: "\u2753" };
}
