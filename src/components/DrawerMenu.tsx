// src/components/DrawerMenu.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowRight, X } from "lucide-react";
import ThemeSwitch from "@/components/ThemeSwitch";

type DrawerMenuProps = {
  open: boolean;
  onClose: () => void;
};

const sections = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export default function DrawerMenu({ open, onClose }: DrawerMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* overlay */}
          <motion.button
            aria-label="Close menu"
            className="fixed inset-0 z-[60] bg-black/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* panel */}
          <motion.aside
            className="fixed right-6 top-28 z-[70] w-[320px] rounded-2xl border border-black/15 bg-[#f5f3ef]/90 backdrop-blur p-4 shadow-[0_20px_70px_rgba(0,0,0,0.12)]"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] tracking-[0.35em] text-black/55">MENU</span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-black/5"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-3 divide-y divide-black/10">
              {sections.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  onClick={onClose}
                  className="group flex items-center justify-between py-3 text-sm tracking-[0.08em] text-black/80 hover:text-black"
                >
                  <span className="relative">
                    {s.label}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-black transition-all group-hover:w-full" />
                  </span>
                  <ArrowRight size={16} className="opacity-60 group-hover:opacity-100" />
                </a>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <a className="rounded-lg p-2 hover:bg-black/5" href="https://github.com/sofmega" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <Github size={16} />
                </a>
                <a className="rounded-lg p-2 hover:bg-black/5" href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <Linkedin size={16} />
                </a>
                <a className="rounded-lg p-2 hover:bg-black/5" href="#contact" onClick={onClose} aria-label="Email">
                  <Mail size={16} />
                </a>
              </div>

              <ThemeSwitch />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
