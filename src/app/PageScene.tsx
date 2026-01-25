// src/app/PageScene.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  animate,
  type MotionValue,
} from "framer-motion";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import LiquidOrb from "@/components/LiquidOrb";
import OrbMaskedText from "@/components/OrbMaskedText";
import type { HeroPhase } from "@/components/HeroIntro";

export default function PageScene() {
  const [phase, setPhase] = useState<HeroPhase>("loading");
  const pageRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });

  /* =========================
     VIEWPORT (px values)
  ========================= */
  const [vw, setVw] = useState(1200);
  const [vh, setVh] = useState(800);

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // travel amounts (approx = 46vw and 10vh)
  const travelX = useMemo(() => vw * 0.46, [vw]);
  const travelY = useMemo(() => vh * 0.10, [vh]);

  /* =========================
     SCROLL MOTION IN PX
  ========================= */
  const xScrollRawPx = useTransform(scrollYProgress, [0.0, 0.18, 0.34, 1.0], [0, 0, travelX, travelX]);
  const yScrollRawPx = useTransform(scrollYProgress, [0.0, 0.18, 0.34, 1.0], [0, 0, travelY, travelY]);
  const scaleScrollRaw = useTransform(scrollYProgress, [0.0, 0.18, 0.34, 1.0], [1, 1, 0.92, 0.92]);

  const xScrollPx = useSpring(xScrollRawPx, { stiffness: 120, damping: 22, mass: 0.7 });
  const yScrollPx = useSpring(yScrollRawPx, { stiffness: 120, damping: 22, mass: 0.7 });
  const scaleScroll = useSpring(scaleScrollRaw, { stiffness: 120, damping: 22, mass: 0.7 });

  /* =========================
     ENABLE SCROLL AFTER HERO
  ========================= */
  const enabled: MotionValue<number> = useMotionValue(0);

  useEffect(() => {
    if (phase === "done") {
      const c = animate(enabled, 1, { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] });
      return () => c.stop();
    }
    enabled.set(0);
  }, [phase, enabled]);

  /* =========================
     ✅ FIX "unknown" BY CASTING TUPLE
  ========================= */
  const orbXPx = useTransform([xScrollPx, enabled], (v) => {
    const [x, e] = v as [number, number];
    return x * e;
  });

  const orbYPx = useTransform([yScrollPx, enabled], (v) => {
    const [y, e] = v as [number, number];
    return y * e;
  });

  const orbScale = useTransform([scaleScroll, enabled], (v) => {
    const [s, e] = v as [number, number];
    return 1 + (s - 1) * e;
  });

  return (
    <div ref={pageRef} className="relative">
      {/* =========================
          SINGLE GLOBAL ORB
      ========================= */}
      <motion.div
        className="pointer-events-none fixed left-1/2 top-1/2 z-10"
        initial={{ opacity: 0, width: "70px", height: "70px" }}
        animate={{
          opacity: phase === "loading" ? 0 : 1,
          width: phase === "loading" ? "70px" : "min(520px,72vw)",
          height: phase === "loading" ? "70px" : "min(520px,72vw)",
        }}
        transition={{ duration: 1.15, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          x: orbXPx,
          y: orbYPx,
          scale: orbScale,
          translateX: "-50%",
          translateY: "-50%",
          borderRadius: 9999,
        }}
      >
        <LiquidOrb className="h-full w-full" />
      </motion.div>

      {/* =========================
          CONTENT
      ========================= */}
      <Navbar />
      <Hero onPhase={setPhase} />

      {/* ===== ABOUT (CENTERED + ORB COLOR-CHANGE TEXT) ===== */}
      <Section id="about" eyebrow="ABOUT" title="A product-minded software engineer." center>
        <OrbMaskedText
          orbSizePx={520}
          orbXPx={orbXPx}
          orbYPx={orbYPx}
          baseClassName="text-black/75"
          accentClassName="text-emerald-900"
          className="text-[clamp(18px,2vw,22px)] leading-relaxed"
        >
          <p>
            <span className="font-medium text-black">Recently graduated software engineer</span>{" "}
            with a strong focus on modern web development.
            <br />
            <br />
            Experienced in building production-ready applications using{" "}
            <span className="font-medium text-black">React, TypeScript, JavaScript, Node.js</span>, PostgreSQL, and CI/CD
            pipelines.
            <br />
            <br />
            Comfortable working in <span className="font-medium text-black">Agile environments</span>, with strong exposure
            to testing, continuous delivery, and{" "}
            <span className="font-medium text-black">quality-driven development</span>.
          </p>
        </OrbMaskedText>
      </Section>

      <Section
        id="experience"
        eyebrow="EXPERIENCE"
        title="Building systems that ship."
        subtitle="ServiceNow, Java full-stack, and workflow-heavy products — delivered with clarity and maintainability."
      >
        <div className="text-black/70">
          Add your timeline here (we’ll convert your CV into a clean timeline next).
        </div>
      </Section>

      <Section
        id="projects"
        eyebrow="PROJECTS"
        title="Selected work."
        subtitle="A curated set of projects focused on real-world constraints, performance, and polish."
      >
        <div className="text-black/70">
          Add your project cards here (I’ll give you premium cards that match your hero).
        </div>
      </Section>

      <Section
        id="education"
        eyebrow="EDUCATION"
        title="Foundations & learning."
        subtitle="Engineering background + continuous learning in modern web and infrastructure."
      >
        <div className="text-black/70">Add your education here.</div>
      </Section>

      <Section
        id="contact"
        eyebrow="CONTACT"
        title="Let’s build something."
        subtitle="Open to full-stack roles, product engineering, and modern frontend work."
      >
        <p className="text-black/70">Email: your@email.com • LinkedIn • GitHub</p>
      </Section>
    </div>
  );
}
