"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  animate,
  type Variants,
} from "framer-motion";
import LiquidOrb from "@/components/LiquidOrb";
import Rings from "@/components/Rings";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

/* =========================
   Loader Shapes (Plus + Circle)
========================= */

/**
 * ✅ Thinner plus like your reference:
 * We build it with 2 rounded rectangles (vertical + horizontal),
 * instead of the chunky blob path.
 */
function PlusMark({ progress }: { progress: number }) {
  const p = clamp01(progress);

  // thickness and rounding to match the reference
  const thickness = 68; // thinner than before
  const radius = 34;

  return (
    <div className="relative h-[240px] w-[240px]" aria-hidden="true">
      {/* outline */}
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

      {/* fill (bottom-up using mask height) */}
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
            height: thickness * p, // subtle fill effect on horizontal arm
            borderRadius: radius,
            transformOrigin: "left center",
          }}
        />
      </div>

      {/* Cutout to keep horizontal always visible but not overly thick:
          We overlay a full horizontal fill once progress is high. */}
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
        <div
          className="absolute bottom-0 left-0 right-0 bg-black/95"
          style={{ height: `${p * 100}%` }}
        />
      </div>
    </div>
  );
}

/* =========================
   Falling Text (typed variants)
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
  const big =
    "text-[clamp(56px,7.5vw,132px)] font-medium tracking-tight leading-[0.9]";
  const navy = "text-[#0b1020]";

  const makeChars = (word: string) =>
    word.split("").map((c, i) => (
      <motion.span
        key={`${c}-${i}`}
        variants={charVariants}
        className="inline-block"
      >
        {c === " " ? "\u00A0" : c}
      </motion.span>
    ));

  return (
    <div className="pointer-events-none absolute inset-0 z-30 mx-auto max-w-7xl px-6 md:px-10">
      {/* top meta */}
      <motion.p
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-28 text-sm text-black/60"
      >
        Soufiane Radouane • Software Engineer • React / TypeScript / Node.js
      </motion.p>

      {/* grid words */}
      <div className="absolute inset-0 mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid h-full grid-cols-12 grid-rows-[1fr_auto_1fr] items-center">
          <motion.h1
            className={`col-span-8 row-start-1 self-end ${big}`}
            variants={wordVariants}
            initial="hidden"
            animate="show"
          >
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

          <motion.h3
            className={`col-span-10 row-start-3 self-start ${big}`}
            variants={wordVariants}
            initial="hidden"
            animate="show"
          >
            {makeChars("EXPERIENCES")}
          </motion.h3>
        </div>
      </div>

      {/* bottom UI */}
      <div className="absolute bottom-10 left-10 h-2 w-2 rounded-full bg-black/80" />
      <div className="absolute bottom-10 right-10 text-xs tracking-widest text-black/50">
        SCROLL ↓
      </div>
    </div>
  );
}

/* =========================
   HERO INTRO
========================= */

export default function HeroIntro() {
  const progressMV = useMotionValue(0);
  const [progress, setProgress] = useState(0);

  // phases: loading -> morph -> done
  const [phase, setPhase] = useState<"loading" | "morph" | "done">("loading");

  // subscribe motion value to state
  useEffect(() => {
    const unsub = progressMV.on("change", (v) => setProgress(v));
    return () => unsub();
  }, [progressMV]);

  useEffect(() => {
    // 0->100 build
    const controls = animate(progressMV, 100, {
      duration: 2.2,
      ease: [0.2, 0.8, 0.2, 1],
    });

    // morph start right after build ends
    const t1 = window.setTimeout(() => {
      setPhase("morph");
      // after morph completes, done
      const t2 = window.setTimeout(() => setPhase("done"), 1300);
      return () => window.clearTimeout(t2);
    }, 2300);

    return () => {
      controls.stop();
      window.clearTimeout(t1);
    };
  }, [progressMV]);

  const p01 = useMemo(() => clamp01(progress / 100), [progress]);

  // When progress is near end, show orb in place of the circle
  const showOrbInLoader = progress >= 98;

  return (
    <section
      id="home"
      className="relative min-h-[100svh] overflow-hidden bg-[#f3f1ec] text-black"
    >
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
                {/* ✅ Circle OR Orb (orb replaces circle at the end) */}
                <div className="relative h-[70px] w-[70px]">
                  <AnimatePresence initial={false}>
                    {!showOrbInLoader && (
                      <motion.div
                        key="circle"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                      >
                        <BuildCircle progress={p01} />
                      </motion.div>
                    )}

                    {showOrbInLoader && (
                      <motion.div
                        key="orb-mini"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0"
                        style={{ borderRadius: 9999 }}
                      >
                        <LiquidOrb className="h-full w-full" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-4 text-xs tracking-widest text-black/60">
                  <span>BUILD</span>
                  <span className="tabular-nums">{Math.round(progress)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ ORB MORPH: starts EXACTLY where the loader circle was, then grows to final */}
      <AnimatePresence>
        {phase !== "loading" && (
          <motion.div
            key="orb-morph"
            className="absolute z-20"
            initial={{
              left: "calc(50% + 150px)",
              top: "calc(50% + 45px)",
              x: "-50%",
              y: "-50%",
              width: "70px",
              height: "70px",
              opacity: 1,
            }}
            animate={{
              left: "50%",
              top: "50%",
              x: "-50%",
              y: "-50%",
              width: "min(520px,72vw)",
              height: "min(520px,72vw)",
              opacity: 1,
            }}
            transition={{
              duration: 1.15, // ✅ slower grow
              ease: [0.2, 0.8, 0.2, 1],
            }}
            style={{ borderRadius: 9999 }}
          >
            <LiquidOrb className="h-full w-full" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ TEXT FALLS WHILE ORB IS GROWING */}
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

      {/* keep text visible after done */}
      {phase === "done" && <FallingText />}
    </section>
  );
}
