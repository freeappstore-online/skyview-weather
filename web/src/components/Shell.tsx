import type { ReactNode } from "react";

interface ShellProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  unit: "celsius" | "fahrenheit";
  onToggleUnit: () => void;
  onDetectLocation: () => void;
  onRefresh: () => void;
}

const tabs = [
  { id: "weather", label: "Weather", icon: "☀️" },
  { id: "forecast", label: "Forecast", icon: "📅" },
  { id: "locations", label: "Locations", icon: "📍" },
];

export function Shell({ children, activeTab, onTabChange, unit, onToggleUnit, onDetectLocation, onRefresh }: ShellProps) {
  return (
    <>
      {/* Desktop layout */}
      <div className="hidden md:flex h-screen">
        <aside
          className="flex flex-col border-r h-full shrink-0"
          style={{ width: "17rem", borderColor: "var(--line)", background: "var(--panel)" }}
        >
          <div className="p-6 font-bold text-lg" style={{ fontFamily: "Fraunces, serif" }}>
            ☁️ SkyView Weather
          </div>
          <nav className="flex-1 px-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="w-full flex items-center gap-3 px-4 py-3 mb-1 text-sm font-medium transition-colors"
                style={{
                  borderRadius: "0.75rem",
                  background: activeTab === tab.id ? "var(--accent)" : "transparent",
                  color: activeTab === tab.id ? "white" : "var(--ink)",
                }}
              >
                <span className="text-base">{tab.icon}</span>
                {tab.label}
              </button>
            ))}

            <div className="mt-6 px-2">
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>
                Quick Actions
              </div>
              <button
                onClick={onDetectLocation}
                className="w-full flex items-center gap-3 px-4 py-2.5 mb-1 text-sm transition-colors"
                style={{ borderRadius: "0.75rem", color: "var(--ink)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--line)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                </svg>
                My Location
              </button>
              <button
                onClick={onRefresh}
                className="w-full flex items-center gap-3 px-4 py-2.5 mb-1 text-sm transition-colors"
                style={{ borderRadius: "0.75rem", color: "var(--ink)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--line)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                Refresh
              </button>
              <button
                onClick={onToggleUnit}
                className="w-full flex items-center gap-3 px-4 py-2.5 mb-1 text-sm transition-colors"
                style={{ borderRadius: "0.75rem", color: "var(--ink)" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--line)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <span className="text-base">🌡️</span>
                {unit === "celsius" ? "Switch to °F" : "Switch to °C"}
              </button>
            </div>
          </nav>
          <div className="p-4 text-xs" style={{ color: "var(--muted)" }}>
            <a href="https://freeappstore.online" target="_blank" rel="noopener noreferrer"
              className="hover:underline" style={{ color: "var(--muted)" }}>
              Part of FreeAppStore — free forever
            </a>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col h-screen md:hidden">
        <header
          className="flex items-center justify-between px-4 h-14 border-b shrink-0"
          style={{ borderColor: "var(--line)", background: "var(--panel)" }}
        >
          <span className="font-bold" style={{ fontFamily: "Fraunces, serif" }}>
            ☁️ SkyView
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={onRefresh}
              className="p-2"
              style={{ color: "var(--muted)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            </button>
            <button
              onClick={onToggleUnit}
              className="px-2 py-1 text-xs font-bold"
              style={{
                borderRadius: "0.5rem",
                background: "var(--paper)",
                border: "1px solid var(--line)",
                color: "var(--ink)",
              }}
            >
              {unit === "celsius" ? "°C" : "°F"}
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">{children}</main>
        <nav
          className="flex items-center justify-around h-16 border-t shrink-0"
          style={{ borderColor: "var(--line)", background: "var(--dock)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1 px-4 py-2 transition-colors"
              style={{
                color: activeTab === tab.id ? "var(--accent)" : "var(--muted)",
              }}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
