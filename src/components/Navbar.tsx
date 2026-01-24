// src/components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import DrawerMenu from "@/components/DrawerMenu";

const topLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-10 py-8">
          <div className="text-xl tracking-tight text-black/85">
            SOUFIANE<span className="text-black/35">.</span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            {topLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-xs tracking-widest text-black/60 hover:text-black"
              >
                {l.label.toUpperCase()}
              </a>
            ))}

            <a
              href="#contact"
              className="rounded-full border border-black/15 bg-white/50 px-4 py-2 text-xs tracking-widest hover:bg-white transition"
            >
              CONTACT →
            </a>
          </nav>
        </div>
      </header>

      {/* floating menu button (bottom-right) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-[55] grid h-12 w-12 place-items-center rounded-xl border border-black/10 bg-white/60 backdrop-blur hover:bg-white transition"
        aria-label="Open menu"
      >
        <div className="space-y-1">
          <div className="h-[2px] w-5 bg-black/80" />
          <div className="h-[2px] w-5 bg-black/80" />
          <div className="h-[2px] w-5 bg-black/80" />
        </div>
      </button>

      <DrawerMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
