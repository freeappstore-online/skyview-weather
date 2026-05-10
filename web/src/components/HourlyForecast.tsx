import type { HourlyForecast as HourlyType } from "../utils/weather";
import { getWeatherInfo, formatHour } from "../utils/weather";

interface Props {
  hourly: HourlyType[];
  unit: "celsius" | "fahrenheit";
}

export function HourlyForecast({ hourly, unit }: Props) {
  const tempSymbol = unit === "fahrenheit" ? "°F" : "°C";
  
  // Show next 24 hours starting from current hour
  const now = new Date();
  const currentHour = now.getHours();
  const todayStr = now.toISOString().split("T")[0];
  
  const startIdx = hourly.findIndex(h => {
    const hDate = new Date(h.time);
    return hDate >= now;
  });
  
  const next24 = hourly.slice(Math.max(0, startIdx), Math.max(0, startIdx) + 24);

  return (
    <div
      style={{
        background: "var(--panel)",
        borderRadius: "1.25rem",
        border: "1px solid var(--line)",
      }}
    >
      <div className="p-4 pb-0">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--accent)" }}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Hourly Forecast
        </h3>
      </div>
      <div className="flex overflow-x-auto gap-2 p-4 scrollbar-hide">
        {next24.map((h, i) => {
          const info = getWeatherInfo(h.weatherCode);
          return (
            <div
              key={h.time}
              className="flex flex-col items-center gap-1.5 px-3 py-3 shrink-0"
              style={{
                background: i === 0 ? "var(--accent)" : "var(--paper)",
                color: i === 0 ? "white" : "var(--ink)",
                borderRadius: "0.75rem",
                minWidth: "4.5rem",
                border: i === 0 ? "none" : "1px solid var(--line)",
              }}
            >
              <span className="text-xs font-medium" style={{ color: i === 0 ? "rgba(255,255,255,0.8)" : "var(--muted)" }}>
                {i === 0 ? "Now" : formatHour(h.time)}
              </span>
              <span className="text-xl">{info.icon}</span>
              <span className="text-sm font-bold">{Math.round(h.temperature)}{tempSymbol}</span>
              {h.precipitation > 0 && (
                <span className="text-xs" style={{ color: i === 0 ? "rgba(255,255,255,0.8)" : "var(--accent)" }}>
                  {h.precipitation}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
