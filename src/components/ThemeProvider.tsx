// src/components/ThemeProvider.tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

function ThemeToggleInner() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-lg border border-white/10 hover:bg-white/10 text-white"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}


export default dynamic(() => Promise.resolve(ThemeToggleInner), { ssr: false });
