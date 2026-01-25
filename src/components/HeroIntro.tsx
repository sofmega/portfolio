// src/components/HeroIntro.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, animate, useMotionValue, type Variants } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Rings from "@/components/Rings";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

/* =========================
   Loader Shapes (Plus + Circle)
========================= */

function PlusMark({ progress }: { progress: number }) {
  const p = clamp01(progress);
  return (
    <div className="relative h-[180px] w-[180px]" aria-hidden="true">
      <DotLottieReact
        src="/loading.lottie"
        autoplay
        loop
        className="h-[180px] w-[180px]"
      />
    </div>
  );
}

function BuildCircle({ progress }: { progress: number }) {
  const p = clamp01(progress);
  return (
    <div className="relative h-[64px] w-[64px]" aria-hidden="true">
      <div className="absolute inset-0 rounded-full border border-black/20" />
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
  const big = "text-[clamp(52px,7vw,128px)] font-medium tracking-tight leading-[0.92]";
  const ink = "text-black";
  const muted = "text-black/55";

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
        className="pt-24 text-[11px] tracking-[0.35em] text-black/55"
      >
        SOUFIANE RADOUANE
      </motion.p>

      <div className="absolute inset-0 mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid h-full grid-cols-12 grid-rows-[1fr_auto_auto_1fr] items-center">
          <motion.h1
            className={`col-span-10 row-start-1 self-end ${big} ${ink}`}
            variants={wordVariants}
            initial="hidden"
            animate="show"
          >
            {makeChars("Software")}
          </motion.h1>

          <motion.h2
            className={`col-span-12 row-start-2 ${big} ${ink}`}
            variants={wordVariants}
            initial="hidden"
            animate="show"
          >
            {makeChars("ENGINEER")}
          </motion.h2>

          <motion.h3
            className={`col-span-10 row-start-3 self-start ${big} ${ink}`}
            variants={wordVariants}
            initial="hidden"
            animate="show"
          >
            {makeChars("Looking for CDI")}
          </motion.h3>

          <div className="col-span-5 col-start-8 row-start-4 mt-8 text-sm leading-relaxed text-black/60">
            
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 h-[6px] w-[6px] rounded-full bg-black/80" />
      <div className={`absolute bottom-10 right-10 text-[11px] tracking-[0.35em] ${muted}`}>SCROLL ↓</div>
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
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-[var(--bg)] text-black">
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
                <div className="flex items-center gap-4 text-xs tracking-widest text-black/60 translate-x-8">
                  <span>BUILD</span>
                  <span className="tabular-nums">{Math.round(progress)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* single circle that grows into the orb */}
      {(phase === "loading" || phase === "morph") && (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-[44px] w-[44px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
          animate={{
            scale: phase === "loading" ? 0.2 + p01 * 0.9 : 11,
            opacity: phase === "loading" ? 1 : 0,
          }}
          transition={{ ease: [0.2, 0.8, 0.2, 1], duration: phase === "loading" ? 0.2 : 1.1 }}
          style={{ x: 80 }}
        />
      )}

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
