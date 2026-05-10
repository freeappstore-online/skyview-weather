import { useState } from "react";
import { Shell } from "./components/Shell";
import { SearchBar } from "./components/SearchBar";
import { CurrentWeatherCard } from "./components/CurrentWeatherCard";
import { HourlyForecast } from "./components/HourlyForecast";
import { DailyForecast } from "./components/DailyForecast";
import { WeatherDetails } from "./components/WeatherDetails";
import { SavedLocations } from "./components/SavedLocations";
import { useWeather } from "./hooks/useWeather";

export default function App() {
  const [activeTab, setActiveTab] = useState("weather");
  const {
    weather,
    location,
    savedLocations,
    loading,
    error,
    unit,
    selectLocation,
    saveLocation,
    removeLocation,
    detectLocation,
    toggleUnit,
    refresh,
  } = useWeather();

  const isSaved = location
    ? savedLocations.some((l) => l.lat === location.lat && l.lon === location.lon)
    : false;

  return (
    <Shell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      unit={unit}
      onToggleUnit={toggleUnit}
      onDetectLocation={detectLocation}
      onRefresh={refresh}
    >
      {/* Search bar — always visible */}
      <div className="mb-6">
        <SearchBar onSelect={selectLocation} />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin mb-4"
            style={{ borderColor: "var(--line)", borderTopColor: "var(--accent)" }}
          />
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Fetching weather data...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div
          className="p-6 text-center"
          style={{
            background: "var(--panel)",
            borderRadius: "1.25rem",
            border: "1px solid var(--line)",
          }}
        >
          <div className="text-4xl mb-3">🌤️</div>
          <h2
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Welcome to SkyView
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
            {error}
          </p>
          <button
            onClick={detectLocation}
            className="px-5 py-2.5 text-sm font-semibold text-white transition-colors"
            style={{ background: "var(--accent)", borderRadius: "0.75rem" }}
          >
            📍 Use My Location
          </button>
        </div>
      )}

      {/* Empty state */}
      {!weather && !loading && !error && (
        <div
          className="p-6 text-center"
          style={{
            background: "var(--panel)",
            borderRadius: "1.25rem",
            border: "1px solid var(--line)",
          }}
        >
          <div className="text-4xl mb-3">🔍</div>
          <h2
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Search for a City
          </h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Type a city name above or allow location access to see your weather.
          </p>
        </div>
      )}

      {/* Weather content */}
      {weather && location && !loading && (
        <>
          {activeTab === "weather" && (
            <div className="space-y-4 max-w-3xl">
              <CurrentWeatherCard
                current={weather.current}
                location={location}
                unit={unit}
                onSave={() =>
                  isSaved ? removeLocation(location) : saveLocation(location)
                }
                isSaved={isSaved}
              />
              <HourlyForecast hourly={weather.hourly} unit={unit} />
              <WeatherDetails
                current={weather.current}
                today={weather.daily[0]}
              />
            </div>
          )}

          {activeTab === "forecast" && (
            <div className="space-y-4 max-w-3xl">
              <h2
                className="text-2xl font-bold"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                7-Day Forecast
              </h2>
              <p className="text-sm -mt-2" style={{ color: "var(--muted)" }}>
                {location.name}
                {location.country ? `, ${location.country}` : ""}
              </p>
              <DailyForecast daily={weather.daily} unit={unit} />
              <HourlyForecast hourly={weather.hourly} unit={unit} />
            </div>
          )}

          {activeTab === "locations" && (
            <div className="space-y-4 max-w-3xl">
              <h2
                className="text-2xl font-bold"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                Locations
              </h2>
              <p className="text-sm -mt-2" style={{ color: "var(--muted)" }}>
                Save your favorite cities for quick access.
              </p>

              <SavedLocations
                locations={savedLocations}
                currentLocation={location}
                onSelect={selectLocation}
                onRemove={removeLocation}
              />

              {savedLocations.length === 0 && (
                <div
                  className="p-6 text-center"
                  style={{
                    background: "var(--panel)",
                    borderRadius: "1.25rem",
                    border: "1px solid var(--line)",
                  }}
                >
                  <div className="text-3xl mb-3">📌</div>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    No saved locations yet. Search for a city and tap the
                    bookmark icon to save it.
                  </p>
                </div>
              )}

              <div
                className="p-4"
                style={{
                  background: "var(--panel)",
                  borderRadius: "1.25rem",
                  border: "1px solid var(--line)",
                }}
              >
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ color: "var(--accent)" }}
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                  </svg>
                  Current Location
                </h3>
                <button
                  onClick={detectLocation}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white transition-colors"
                  style={{
                    background: "var(--accent)",
                    borderRadius: "0.75rem",
                  }}
                >
                  📍 Detect My Location
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </Shell>
  );
}
