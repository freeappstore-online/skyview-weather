import type { DailyForecast as DailyType } from "../utils/weather";
import { getWeatherInfo, formatDay, formatTime } from "../utils/weather";

interface Props {
  daily: DailyType[];
  unit: "celsius" | "fahrenheit";
}

export function DailyForecast({ daily, unit }: Props) {
  const tempSymbol = unit === "fahrenheit" ? "°F" : "°C";
  
  // Find temp range for bar visualization
  const allMin = Math.min(...daily.map(d => d.tempMin));
  const allMax = Math.max(...daily.map(d => d.tempMax));
  const range = allMax - allMin || 1;

  return (
    <div
      style={{
        background: "var(--panel)",
        borderRadius: "1.25rem",
        border: "1px solid var(--line)",
      }}
    >
      <div className="p-4 pb-2">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--accent)" }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          7-Day Forecast
        </h3>
      </div>
      <div className="divide-y" style={{ borderColor: "var(--line)" }}>
        {daily.map((d) => {
          const info = getWeatherInfo(d.weatherCode);
          const leftPct = ((d.tempMin - allMin) / range) * 100;
          const widthPct = ((d.tempMax - d.tempMin) / range) * 100;

          return (
            <div key={d.date} className="flex items-center gap-3 px-4 py-3" style={{ borderColor: "var(--line)" }}>
              <div className="w-16 shrink-0">
                <span className="text-sm font-medium">{formatDay(d.date)}</span>
              </div>
              <span className="text-xl shrink-0">{info.icon}</span>
              <span className="text-xs w-10 text-right shrink-0" style={{ color: "var(--muted)" }}>
                {Math.round(d.tempMin)}{tempSymbol}
              </span>
              <div className="flex-1 h-1.5 rounded-full relative" style={{ background: "var(--line)", minWidth: "3rem" }}>
                <div
                  className="absolute h-full rounded-full"
                  style={{
                    left: `${leftPct}%`,
                    width: `${Math.max(widthPct, 8)}%`,
                    background: "linear-gradient(90deg, var(--accent), #06b6d4)",
                  }}
                />
              </div>
              <span className="text-xs w-10 shrink-0 font-semibold">
                {Math.round(d.tempMax)}{tempSymbol}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
