import type { GeoLocation } from "../utils/weather";

interface Props {
  locations: GeoLocation[];
  currentLocation: GeoLocation | null;
  onSelect: (loc: GeoLocation) => void;
  onRemove: (loc: GeoLocation) => void;
}

export function SavedLocations({ locations, currentLocation, onSelect, onRemove }: Props) {
  if (locations.length === 0) return null;

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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" style={{ color: "var(--accent)" }}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          Saved Locations
        </h3>
      </div>
      <div className="px-4 pb-4 flex flex-wrap gap-2">
        {locations.map((loc) => {
          const isActive = currentLocation && currentLocation.lat === loc.lat && currentLocation.lon === loc.lon;
          return (
            <div
              key={`${loc.lat}-${loc.lon}`}
              className="flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 text-sm transition-colors"
              style={{
                background: isActive ? "var(--accent)" : "var(--paper)",
                color: isActive ? "white" : "var(--ink)",
                borderRadius: "0.75rem",
                border: isActive ? "1px solid var(--accent)" : "1px solid var(--line)",
                cursor: "pointer",
              }}
            >
              <span onClick={() => onSelect(loc)} className="cursor-pointer font-medium">
                {loc.name}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(loc); }}
                className="p-1 rounded-full transition-colors"
                style={{
                  color: isActive ? "rgba(255,255,255,0.7)" : "var(--muted)",
                }}
                title="Remove"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
