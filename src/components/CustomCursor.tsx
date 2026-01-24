"use client";

import { useEffect, useMemo, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type SpringOptions,
} from "framer-motion";

const spring: SpringOptions = { stiffness: 500, damping: 40, mass: 0.6 };
const slowSpring: SpringOptions = { stiffness: 180, damping: 22, mass: 0.9 };

function isInteractive(el: Element | null) {
  if (!el) return false;
  return Boolean(
    el.closest(
      'a, button, [role="button"], input, textarea, select, summary, label, [data-cursor="pointer"]'
    )
  );
}

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  // Raw mouse position (dot follows fast)
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Ring follows slower (gives the offset feel like your screenshot)
  const ringX = useSpring(x, slowSpring);
  const ringY = useSpring(y, slowSpring);

  // Dot has a tiny spring too (but faster than ring)
  const dotX = useSpring(x, spring);
  const dotY = useSpring(y, spring);

  const scaleRing = useMotionValue(1);
  const scaleDot = useMotionValue(1);

  useEffect(() => {
    // Only enable on devices with a fine pointer (desktop / trackpad)
    const mq = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setEnabled(mq.matches && !reduced.matches);
    update();

    mq.addEventListener?.("change", update);
    reduced.addEventListener?.("change", update);

    return () => {
      mq.removeEventListener?.("change", update);
      reduced.removeEventListener?.("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const over = isInteractive(t);
      setHovering(over);

      // scale reacts instantly when over interactive elements
      scaleRing.set(over ? 1.35 : 1);
      scaleDot.set(over ? 0.85 : 1);
    };

    const onDown = () => {
      scaleRing.set(0.95);
      scaleDot.set(0.8);
    };

    const onUp = () => {
      scaleRing.set(hovering ? 1.35 : 1);
      scaleDot.set(hovering ? 0.85 : 1);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled, hovering, scaleRing, scaleDot, x, y]);

  // Hide entirely on mobile / reduced motion
  if (!enabled) return null;

  // Ring style (soft grey)
  const ringClass =
    "fixed left-0 top-0 z-[9999] pointer-events-none select-none";

  return (
    <>
      {/* Outer ring (lags behind) */}
      <motion.div
        className={ringClass}
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          scale: scaleRing,
        }}
      >
        <div
          className="
            h-8 w-8 rounded-full
            border border-black/20
            bg-black/5
            backdrop-blur-[2px]
          "
        />
      </motion.div>

      {/* Inner dot (leads slightly) */}
      <motion.div
        className={ringClass}
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          scale: scaleDot,
        }}
      >
        <div className="h-2.5 w-2.5 rounded-full bg-black/80 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]" />
      </motion.div>
    </>
  );
}
