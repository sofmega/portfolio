"use client";

import ThemeToggle from "@/components/ThemeProvider";

const links = [
  { label: "Home", href: "#home" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-lg text-white">Soufiane Radouane</span>

        <div className="flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-white/80 hover:text-white transition"
            >
              {l.label}
            </a>
          ))}

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
