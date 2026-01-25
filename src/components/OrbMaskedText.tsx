// src/components/OrbMaskedText.tsx
"use client";

import React from "react";
import { motion, type MotionValue, useTransform } from "framer-motion";

type OrbMaskedTextProps = {
  children: React.ReactNode;

  /** Orb diameter in px */
  orbSizePx?: number;

  /** Orb center offsets in px relative to viewport center */
  orbXPx: MotionValue<number>;
  orbYPx: MotionValue<number>;

  baseClassName?: string;
  accentClassName?: string;
  className?: string;
};

export default function OrbMaskedText({
  children,
  orbSizePx = 520,
  orbXPx,
  orbYPx,
  baseClassName = "text-black/75",
  accentClassName = "text-emerald-900",
  className = "",
}: OrbMaskedTextProps) {
  const r = orbSizePx / 2;

  const mask = useTransform([orbXPx, orbYPx], ([x, y]) => {
    return `radial-gradient(circle ${r}px at calc(50% + ${x}px) calc(50% + ${y}px),
      #000 0%,
      #000 70%,
      transparent 72%)`;
  });

  return (
    <div className={`relative ${className}`}>
      <div className={baseClassName}>{children}</div>

      <motion.div
        className={`pointer-events-none absolute inset-0 ${accentClassName}`}
        style={{
          WebkitMaskImage: mask as any,
          maskImage: mask as any,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
