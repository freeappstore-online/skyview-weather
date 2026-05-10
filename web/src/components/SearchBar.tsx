import { useState, useEffect, useRef, useCallback } from "react";
import type { GeoLocation } from "../utils/weather";
import { searchLocations } from "../utils/weather";

interface SearchBarProps {
  onSelect: (loc: GeoLocation) => void;
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const locs = await searchLocations(q);
      setResults(locs);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, doSearch]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          background: "var(--panel)",
          borderRadius: "1.25rem",
          border: "1px solid var(--line)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted)", flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search cities..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: "var(--ink)" }}
        />
        {searching && (
          <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "var(--line)", borderTopColor: "var(--accent)" }} />
        )}
      </div>
      {open && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 overflow-hidden z-50 shadow-lg"
          style={{
            background: "var(--panel)",
            borderRadius: "1.25rem",
            border: "1px solid var(--line)",
          }}
        >
          {results.map((loc, i) => (
            <button
              key={`${loc.lat}-${loc.lon}-${i}`}
              onClick={() => {
                onSelect(loc);
                setQuery("");
                setOpen(false);
                setResults([]);
              }}
              className="w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-2"
              style={{ color: "var(--ink)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--line)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ color: "var(--muted)" }}>📍</span>
              <div>
                <div className="font-medium">{loc.name}</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>
                  {[loc.admin1, loc.country].filter(Boolean).join(", ")}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
