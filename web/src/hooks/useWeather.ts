import { useState, useEffect, useCallback } from "react";
import type { WeatherData, GeoLocation } from "../utils/weather";
import { fetchWeather, searchLocations } from "../utils/weather";

const STORAGE_KEY = "skyview_weather";
const LOCATIONS_KEY = "skyview_locations";
const UNIT_KEY = "skyview_unit";

interface StoredData {
  weather: WeatherData;
  location: GeoLocation;
  timestamp: number;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [savedLocations, setSavedLocations] = useState<GeoLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">(() => {
    try {
      return (localStorage.getItem(UNIT_KEY) as "celsius" | "fahrenheit") || "celsius";
    } catch {
      return "celsius";
    }
  });

  // Load saved locations
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCATIONS_KEY);
      if (saved) setSavedLocations(JSON.parse(saved));
    } catch {}
  }, []);

  // Load cached weather on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredData = JSON.parse(stored);
        // Use cache if less than 30 minutes old
        if (Date.now() - data.timestamp < 30 * 60 * 1000) {
          setWeather(data.weather);
          setLocation(data.location);
          return;
        }
        // Stale cache — still show it but refresh
        setWeather(data.weather);
        setLocation(data.location);
        loadWeather(data.location, false);
        return;
      }
    } catch {}
    // No cache — try geolocation
    detectLocation();
  }, []);

  const loadWeather = useCallback(async (loc: GeoLocation, showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const currentUnit = localStorage.getItem(UNIT_KEY) as "celsius" | "fahrenheit" || "celsius";
      const data = await fetchWeather(loc.lat, loc.lon, currentUnit);
      setWeather(data);
      setLocation(loc);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        weather: data,
        location: loc,
        timestamp: Date.now(),
      }));
    } catch (e) {
      setError("Couldn't fetch weather data. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported. Search for a city instead.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc: GeoLocation = {
          name: "Current Location",
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        // Try to reverse geocode
        try {
          const results = await searchLocations(`${pos.coords.latitude},${pos.coords.longitude}`);
          if (results.length > 0) {
            loc.name = results[0].name;
            loc.country = results[0].country;
            loc.admin1 = results[0].admin1;
          }
        } catch {}
        loadWeather(loc);
      },
      () => {
        setLoading(false);
        setError("Location access denied. Search for a city to get started.");
      }
    );
  }, [loadWeather]);

  const selectLocation = useCallback((loc: GeoLocation) => {
    loadWeather(loc);
  }, [loadWeather]);

  const saveLocation = useCallback((loc: GeoLocation) => {
    setSavedLocations(prev => {
      const exists = prev.some(l => l.lat === loc.lat && l.lon === loc.lon);
      if (exists) return prev;
      const updated = [...prev, loc];
      localStorage.setItem(LOCATIONS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeLocation = useCallback((loc: GeoLocation) => {
    setSavedLocations(prev => {
      const updated = prev.filter(l => !(l.lat === loc.lat && l.lon === loc.lon));
      localStorage.setItem(LOCATIONS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit(prev => {
      const next = prev === "celsius" ? "fahrenheit" : "celsius";
      localStorage.setItem(UNIT_KEY, next);
      // Clear cache to force refresh with new unit
      localStorage.removeItem(STORAGE_KEY);
      return next;
    });
    if (location) {
      // Small delay to let state update
      setTimeout(() => {
        if (location) loadWeather(location);
      }, 50);
    }
  }, [location, loadWeather]);

  const refresh = useCallback(() => {
    if (location) loadWeather(location);
  }, [location, loadWeather]);

  return {
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
    searchLocations,
  };
}
