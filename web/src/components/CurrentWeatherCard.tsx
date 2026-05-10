import type { CurrentWeather, GeoLocation } from "../utils/weather";
import { getWeatherInfo, getWindDirection } from "../utils/weather";

interface Props {
  current: CurrentWeather;
  location: GeoLocation;
  unit: "celsius" | "fahrenheit";
  onSave?: () => void;
  isSaved?: boolean;
}

export function CurrentWeatherCard({ current, location, unit, onSave, isSaved }: Props) {
  const info = getWeatherInfo(current.weatherCode);
  const tempSymbol = unit === "fahrenheit" ? "°F" : "°C";
  const speedUnit = unit === "fahrenheit" ? "mph" : "km/h";

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "var(--panel)",
        borderRadius: "1.25rem",
        border: "1px solid var(--line)",
      }}
    >
      {/* Gradient accent bar */}
      <div
        className="h-1"
        style={{
          background: current.isDay
            ? "linear-gradient(90deg, #3b82f6, #06b6d4, #fbbf24)"
            : "linear-gradient(90deg, #1e3a5f, #6366f1, #8b5cf6)",
        }}
      />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--accent)" }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="font-semibold text-sm">{location.name}</span>
              {location.country && (
                <span className="text-xs" style={{ color: "var(--muted)" }}>{location.country}</span>
              )}
            </div>
            <p className="text-xs" style={{ color: "var(--muted)" }}>{info.label}</p>
          </div>
          {onSave && (
            <button
              onClick={onSave}
              className="p-2 transition-colors"
              style={{ borderRadius: "0.75rem", color: isSaved ? "var(--accent)" : "var(--muted)" }}
              title={isSaved ? "Location saved" : "Save location"}
            >
              {isSaved ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-6xl">{info.icon}</span>
          <div>
            <div className="text-5xl font-bold" style={{ fontFamily: "Fraunces, serif" }}>
              {Math.round(current.temperature)}{tempSymbol}
            </div>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              Feels like {Math.round(current.apparentTemperature)}{tempSymbol}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon="💧" label="Humidity" value={`${current.humidity}%`} />
          <StatCard icon="💨" label="Wind" value={`${Math.round(current.windSpeed)} ${speedUnit} ${getWindDirection(current.windDirection)}`} />
          <StatCard icon="🌡️" label="Pressure" value={`${Math.round(current.pressure)} hPa`} />
          <StatCard icon="🌧️" label="Precip." value={`${current.precipitation} mm`} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div
      className="p-3 text-center"
      style={{
        background: "var(--paper)",
        borderRadius: "0.75rem",
        border: "1px solid var(--line)",
      }}
    >
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-xs font-medium" style={{ color: "var(--muted)" }}>{label}</div>
      <div className="text-sm font-semibold mt-0.5">{value}</div>
    </div>
  );
}
