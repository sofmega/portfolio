// src/components/ThemeSwitch.tsx
"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

function ThemeSwitchInner() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-6 w-12 rounded-full border border-black/15 bg-black/5"
    >
      <span
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-black transition ${
          isDark ? "left-7" : "left-1"
        }`}
      />
    </button>
  );
}

// ✅ client-only to avoid hydration mismatch
export default dynamic(() => Promise.resolve(ThemeSwitchInner), { ssr: false });
