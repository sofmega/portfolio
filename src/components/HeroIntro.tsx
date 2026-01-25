// src/components/HeroIntro.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, animate, useMotionValue, type Variants } from "framer-motion";
import Rings from "@/components/Rings";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

/* =========================
   Loader Shapes (Plus + Circle)
========================= */

function PlusMark({ progress }: { progress: number }) {
  const p = clamp01(progress);
  const thickness = 68;
  const radius = 34;

  return (
    <div className="relative h-[240px] w-[240px]" aria-hidden="true">
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: thickness,
          height: 240,
          borderRadius: radius,
          border: "2px solid rgba(0,0,0,0.10)",
        }}
      />
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2"
        style={{
          width: 240,
          height: thickness,
          borderRadius: radius,
          border: "2px solid rgba(0,0,0,0.10)",
        }}
      />

      <div className="absolute inset-0">
        <div
          className="absolute left-1/2 bottom-0 -translate-x-1/2 bg-black/95"
          style={{
            width: thickness,
            height: 240 * p,
            borderRadius: radius,
          }}
        />
        <div
          className="absolute left-0 bottom-[calc(50%-34px)] bg-black/95"
          style={{
            width: 240,
            height: thickness * p,
            borderRadius: radius,
            transformOrigin: "left center",
          }}
        />
      </div>

      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/95"
        style={{
          width: 240 * clamp01((p - 0.25) / 0.75),
          height: thickness,
          borderRadius: radius,
        }}
      />
    </div>
  );
}

function BuildCircle({ progress }: { progress: number }) {
  const p = clamp01(progress);
  return (
    <div className="relative h-[70px] w-[70px]" aria-hidden="true">
      <div className="absolute inset-0 rounded-full border border-black/15" />
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <div className="absolute bottom-0 left-0 right-0 bg-black/95" style={{ height: `${p * 100}%` }} />
      </div>
    </div>
  );
}

/* =========================
   Falling Text
========================= */

const wordVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const charVariants: Variants = {
  hidden: { y: -90, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 220, damping: 18 },
  },
};

function FallingText() {
  const big = "text-[clamp(56px,7.5vw,132px)] font-medium tracking-tight leading-[0.9]";
  const navy = "text-[#0b1020]";

  const makeChars = (word: string) =>
    word.split("").map((c, i) => (
      <motion.span key={`${c}-${i}`} variants={charVariants} className="inline-block">
        {c === " " ? "\u00A0" : c}
      </motion.span>
    ));

  return (
    <div className="pointer-events-none absolute inset-0 z-30 mx-auto max-w-7xl px-6 md:px-10">
      <motion.p
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-28 text-sm text-black/60"
      >
        Soufiane Radouane • Software Engineer • React / TypeScript / Node.js
      </motion.p>

      <div className="absolute inset-0 mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid h-full grid-cols-12 grid-rows-[1fr_auto_1fr] items-center">
          <motion.h1 className={`col-span-8 row-start-1 self-end ${big}`} variants={wordVariants} initial="hidden" animate="show">
            {makeChars("BUILDING")}
          </motion.h1>

          <motion.h2
            className={`col-span-6 col-start-7 row-start-2 justify-self-end ${big} ${navy}`}
            variants={wordVariants}
            initial="hidden"
            animate="show"
          >
            {makeChars("MODERN")}
          </motion.h2>

          <motion.h3 className={`col-span-10 row-start-3 self-start ${big}`} variants={wordVariants} initial="hidden" animate="show">
            {makeChars("EXPERIENCES")}
          </motion.h3>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 h-2 w-2 rounded-full bg-black/80" />
      <div className="absolute bottom-10 right-10 text-xs tracking-widest text-black/50">SCROLL ↓</div>
    </div>
  );
}

/* =========================
   HERO INTRO (NO ORB)
   We export phase so PageScene can animate the ONE orb.
========================= */

export type HeroPhase = "loading" | "morph" | "done";

export default function HeroIntro({ onPhase }: { onPhase?: (p: HeroPhase) => void }) {
  const progressMV = useMotionValue(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<HeroPhase>("loading");

  useEffect(() => {
    onPhase?.(phase);
  }, [phase, onPhase]);

  useEffect(() => {
    const unsub = progressMV.on("change", (v) => setProgress(v));
    return () => unsub();
  }, [progressMV]);

  useEffect(() => {
    const controls = animate(progressMV, 100, {
      duration: 2.2,
      ease: [0.2, 0.8, 0.2, 1],
    });

    const t1 = window.setTimeout(() => {
      setPhase("morph");
      const t2 = window.setTimeout(() => setPhase("done"), 1300);
      return () => window.clearTimeout(t2);
    }, 2300);

    return () => {
      controls.stop();
      window.clearTimeout(t1);
    };
  }, [progressMV]);

  const p01 = useMemo(() => clamp01(progress / 100), [progress]);

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-[#f3f1ec] text-black">
      {/* rings behind */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Rings />
      </div>

      {/* LOADER UI */}
      <AnimatePresence>
        {phase === "loading" && (
          <motion.div
            className="absolute inset-0 z-40 grid place-items-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="relative flex items-center gap-10">
              <PlusMark progress={p01} />

              <div className="flex flex-col items-center gap-4">
                {/* ONLY the circle now */}
                <BuildCircle progress={p01} />

                <div className="flex items-center gap-4 text-xs tracking-widest text-black/60">
                  <span>BUILD</span>
                  <span className="tabular-nums">{Math.round(progress)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* text shows while morph + after */}
      <AnimatePresence>
        {phase === "morph" && (
          <motion.div
            key="text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <FallingText />
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "done" && <FallingText />}
    </section>
  );
}
