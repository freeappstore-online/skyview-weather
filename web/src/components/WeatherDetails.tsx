import type { DailyForecast, CurrentWeather } from "../utils/weather";
import { formatTime, getUVLevel } from "../utils/weather";

interface Props {
  current: CurrentWeather;
  today: DailyForecast;
}

export function WeatherDetails({ current, today }: Props) {
  const uv = getUVLevel(current.uvIndex);
  
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* UV Index */}
      <DetailCard
        icon="☀️"
        label="UV Index"
        value={`${Math.round(current.uvIndex)}`}
        extra={uv.label}
        extraColor={uv.color}
      />
      
      {/* Sunrise & Sunset */}
      <DetailCard
        icon="🌅"
        label="Sunrise"
        value={formatTime(today.sunrise)}
        extra={`Sunset ${formatTime(today.sunset)}`}
      />
      
      {/* Max Wind */}
      <DetailCard
        icon="🌬️"
        label="Max Wind"
        value={`${Math.round(today.windSpeedMax)}`}
        extra="Today's max"
      />
      
      {/* Daily Precipitation */}
      <DetailCard
        icon="☔"
        label="Precipitation"
        value={`${today.precipitationSum} mm`}
        extra="Today's total"
      />
    </div>
  );
}

function DetailCard({ icon, label, value, extra, extraColor }: {
  icon: string;
  label: string;
  value: string;
  extra?: string;
  extraColor?: string;
}) {
  return (
    <div
      className="p-4"
      style={{
        background: "var(--panel)",
        borderRadius: "1.25rem",
        border: "1px solid var(--line)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--muted)" }}>
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold" style={{ fontFamily: "Fraunces, serif" }}>
        {value}
      </div>
      {extra && (
        <p className="text-xs mt-1" style={{ color: extraColor || "var(--muted)" }}>
          {extra}
        </p>
      )}
    </div>
  );
}
