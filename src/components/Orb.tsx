// src/components/Orb.tsx
"use client";

import { motion } from "framer-motion";

export default function Orb() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      animate={{ y: [0, -10, 0], rotate: [0, 6, 0], scale: [1, 1.02, 1] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      style={{
        background:
          "radial-gradient(closest-side at 30% 30%, rgba(255,255,255,0.85), rgba(255,255,255,0) 55%), conic-gradient(from 160deg, #ff3d8d, #ffcc00, #6ee7ff, #a78bfa, #ff3d8d)",
        filter: "saturate(1.05)",
      }}
    >
      <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-white/35 blur-2xl" />
      <div className="absolute inset-0 rounded-full shadow-[0_30px_120px_rgba(0,0,0,0.18)]" />
    </motion.div>
  );
}
