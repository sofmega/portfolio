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
  const aboutRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
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
  const xScrollRawPx = useTransform(aboutProgress, [0.0, 0.2, 1.0], [0, travelX, travelX]);
  const yScrollRawPx = useTransform(aboutProgress, [0.0, 0.2, 1.0], [0, travelY, travelY]);
  const scaleScrollRaw = useTransform(aboutProgress, [0.0, 1.0], [1, 1.65]);

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
    <div className="relative">
      {/* =========================
          SINGLE GLOBAL ORB
      ========================= */}
      <motion.div
        className="pointer-events-none fixed left-1/2 top-1/2 z-10 mix-blend-multiply"
        initial={{ opacity: 0, width: "80px", height: "80px" }}
        animate={{
          opacity: phase === "loading" ? 0 : 1,
          width: phase === "loading" ? "80px" : "min(560px,78vw)",
          height: phase === "loading" ? "80px" : "min(560px,78vw)",
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
      <Section ref={aboutRef} id="about" eyebrow="ABOUT" title="A product-minded software engineer." center>
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
            with 2 years of professional experience and a strong focus on modern web development.
            <br />
            <br />
            Experienced in building production-ready applications using{" "}
            <span className="font-medium text-black">React, TypeScript, JavaScript, Node.js</span>, PostgreSQL, and CI/CD
            pipelines, plus ServiceNow workflow automation.
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
        subtitle="ServiceNow, Java full-stack, and workflow-heavy products - delivered with clarity and maintainability."
      >
        <div className="space-y-10 text-black/75">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-lg font-medium text-black">
                Développeur Full-Stack JavaScript (Stage) · E-petitpas Startup
              </div>
              <div className="text-sm text-black/55">Argenteuil, France · May 2025 - Nov 2025</div>
            </div>
            <p className="mt-2 text-sm text-black/60">
              Stack: React, TypeScript, Tailwind CSS, Node.js, Express, PostgreSQL (Supabase & Prisma), Jest, JWT,
              Google Cloud, CI/CD, Nginx
            </p>
            <ul className="mt-3 space-y-1 text-sm text-black/70">
              <li>Built a SaaS platform used by 50+ clients across HR, sales, and operations.</li>
              <li>Set up CI/CD with automated tests prior to deployment and organized code reviews.</li>
              <li>Partnered with product and clients for planning, specs, and validation.</li>
              <li>Acted as quality lead for ticket organization and team support (12 people).</li>
            </ul>
          </div>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-lg font-medium text-black">
                Ingénieur Support N2 Applicatif · Group Labelvie
              </div>
              <div className="text-sm text-black/55">Skhirat, Maroc · Jul 2023 - Jul 2024</div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-black/70">
              <li>Handled level 1–2 incidents and user support requests.</li>
              <li>Built Java features and designed PL/SQL extraction queries.</li>
              <li>Validated ERP update scenarios with functional testing.</li>
              <li>Performed diagnostics and delivered improvement recommendations.</li>
            </ul>
          </div>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-lg font-medium text-black">
                Consultant technico-fonctionnel ServiceNow (PFE) · DXC Technology
              </div>
              <div className="text-sm text-black/55">Rabat, Maroc · Apr 2022 - Sep 2022</div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-black/70">
              <li>Delivered a content management system on ServiceNow for conferences and articles.</li>
              <li>Designed data models in Merise and built workflows with Flow Designer.</li>
              <li>Implemented Virtual Agent, MFA/OKTA, approvals, notifications, and record producers.</li>
              <li>Tested, delivered, and validated the final release.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section
        id="projects"
        eyebrow="PROJECTS"
        title="Selected work."
        subtitle="A curated set of projects focused on real-world constraints, performance, and polish."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white/40 p-5">
            <div className="text-sm tracking-[0.2em] text-black/50">SAAS PLATFORM</div>
            <h3 className="mt-2 text-lg font-medium text-black">Multi-tenant SaaS for HR & Sales</h3>
            <p className="mt-3 text-sm text-black/65">
              Built a production platform used by 50+ clients with secure auth, dashboards, and CI/CD-backed releases.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white/40 p-5">
            <div className="text-sm tracking-[0.2em] text-black/50">SERVICENOW</div>
            <h3 className="mt-2 text-lg font-medium text-black">Content Management System</h3>
            <p className="mt-3 text-sm text-black/65">
              Delivered a ServiceNow SGC with approvals, notifications, and workflow automation for conferences.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white/40 p-5">
            <div className="text-sm tracking-[0.2em] text-black/50">ERP</div>
            <h3 className="mt-2 text-lg font-medium text-black">ERP Update Validation</h3>
            <p className="mt-3 text-sm text-black/65">
              Led scenario testing and data extraction (PL/SQL) to validate an ERP upgrade.
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white/40 p-5">
            <div className="text-sm tracking-[0.2em] text-black/50">QUALITY</div>
            <h3 className="mt-2 text-lg font-medium text-black">CI/CD & QA Enablement</h3>
            <p className="mt-3 text-sm text-black/65">
              Implemented automated tests, code reviews, and release gates to improve delivery quality.
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="education"
        eyebrow="EDUCATION"
        title="Foundations & learning."
        subtitle="Engineering background + continuous learning in modern web and infrastructure."
      >
        <div className="space-y-6 text-black/75">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="text-lg font-medium text-black">
              INGETIS Paris — Master 2, Expert en Architecture & Développement Logiciel
            </div>
            <div className="text-sm text-black/55">Sep 2024 - Jul 2025</div>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="text-lg font-medium text-black">
              EMSI Casablanca — Ingénieur Informatique & Réseaux (option MIAGE)
            </div>
            <div className="text-sm text-black/55">2017 - 2022</div>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="text-lg font-medium text-black">Lycée El Farabi — Bac Sciences Physiques</div>
            <div className="text-sm text-black/55">2016 - 2017</div>
          </div>

          <div className="pt-2 text-sm text-black/60">
            Certifications: IELTS Academic B2 (2024) · Coursera Java Programming and Software Engineering Fundamentals (2021)
          </div>
          <div className="text-sm text-black/60">Languages: French · English · Arabic</div>
        </div>
      </Section>

      <Section
        id="contact"
        eyebrow="CONTACT"
        title="Let's build something."
        subtitle="Open to full-stack roles, product engineering, and modern frontend work."
      >
        <div className="space-y-2 text-black/70">
          <p>Email: Soufiane.radouane99@gmail.com</p>
          <p>Phone: 07 45 76 79 13</p>
          <p>GitHub: github.com/sofmega</p>
          <p>LinkedIn: /in/soufiane-radouane-9b047220a/</p>
          <p>Location: Asnières-sur-Seine (92) · Available immediately</p>
        </div>
      </Section>
    </div>
  );
}
