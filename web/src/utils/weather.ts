// Weather code descriptions and icons (WMO codes)
export const weatherCodes: Record<number, { label: string; icon: string }> = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mainly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Foggy", icon: "🌫️" },
  48: { label: "Rime fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Moderate drizzle", icon: "🌦️" },
  55: { label: "Dense drizzle", icon: "🌧️" },
  56: { label: "Freezing drizzle", icon: "🌧️" },
  57: { label: "Dense freezing drizzle", icon: "🌧️" },
  61: { label: "Slight rain", icon: "🌧️" },
  63: { label: "Moderate rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  66: { label: "Freezing rain", icon: "🌧️" },
  67: { label: "Heavy freezing rain", icon: "🌧️" },
  71: { label: "Slight snow", icon: "🌨️" },
  73: { label: "Moderate snow", icon: "🌨️" },
  75: { label: "Heavy snow", icon: "❄️" },
  77: { label: "Snow grains", icon: "❄️" },
  80: { label: "Slight showers", icon: "🌦️" },
  81: { label: "Moderate showers", icon: "🌧️" },
  82: { label: "Violent showers", icon: "🌧️" },
  85: { label: "Slight snow showers", icon: "🌨️" },
  86: { label: "Heavy snow showers", icon: "❄️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm w/ hail", icon: "⛈️" },
  99: { label: "Thunderstorm w/ heavy hail", icon: "⛈️" },
};

export function getWeatherInfo(code: number) {
  return weatherCodes[code] ?? { label: "Unknown", icon: "🌡️" };
}

export interface CurrentWeather {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  humidity: number;
  apparentTemperature: number;
  isDay: boolean;
  precipitation: number;
  pressure: number;
  uvIndex: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  windSpeedMax: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  timezone: string;
}

export interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  admin1?: string;
}

export async function searchLocations(query: string): Promise<GeoLocation[]> {
  if (query.length < 2) return [];
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  );
  const data = await res.json();
  if (!data.results) return [];
  return data.results.map((r: any) => ({
    name: r.name,
    lat: r.latitude,
    lon: r.longitude,
    country: r.country,
    admin1: r.admin1,
  }));
}

export async function fetchWeather(lat: number, lon: number, unit: "celsius" | "fahrenheit" = "celsius"): Promise<WeatherData> {
  const tempUnit = unit === "fahrenheit" ? "&temperature_unit=fahrenheit" : "";
  const windUnit = unit === "fahrenheit" ? "&wind_speed_unit=mph" : "";
  
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,sunrise,sunset,uv_index_max&timezone=auto&forecast_days=7${tempUnit}${windUnit}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather data");
  const data = await res.json();

  const current: CurrentWeather = {
    temperature: data.current.temperature_2m,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    weatherCode: data.current.weather_code,
    humidity: data.current.relative_humidity_2m,
    apparentTemperature: data.current.apparent_temperature,
    isDay: data.current.is_day === 1,
    precipitation: data.current.precipitation,
    pressure: data.current.surface_pressure,
    uvIndex: data.current.uv_index,
  };

  const hourly: HourlyForecast[] = data.hourly.time.slice(0, 48).map((t: string, i: number) => ({
    time: t,
    temperature: data.hourly.temperature_2m[i],
    weatherCode: data.hourly.weather_code[i],
    precipitation: data.hourly.precipitation_probability[i],
    windSpeed: data.hourly.wind_speed_10m[i],
    humidity: data.hourly.relative_humidity_2m[i],
  }));

  const daily: DailyForecast[] = data.daily.time.map((d: string, i: number) => ({
    date: d,
    weatherCode: data.daily.weather_code[i],
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    precipitationSum: data.daily.precipitation_sum[i],
    windSpeedMax: data.daily.wind_speed_10m_max[i],
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
    uvIndexMax: data.daily.uv_index_max[i],
  }));

  return { current, hourly, daily, timezone: data.timezone };
}

export function getWindDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export function getUVLevel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: "Low", color: "var(--success)" };
  if (uv <= 5) return { label: "Moderate", color: "var(--warning)" };
  if (uv <= 7) return { label: "High", color: "#f97316" };
  if (uv <= 10) return { label: "Very High", color: "var(--error)" };
  return { label: "Extreme", color: "#7c3aed" };
}

export function formatHour(isoTime: string): string {
  const date = new Date(isoTime);
  const hours = date.getHours();
  if (hours === 0) return "12 AM";
  if (hours === 12) return "12 PM";
  return hours > 12 ? `${hours - 12} PM` : `${hours} AM`;
}

export function formatDay(isoDate: string): string {
  const date = new Date(isoDate + "T00:00:00");
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function formatTime(isoTime: string): string {
  const date = new Date(isoTime);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
