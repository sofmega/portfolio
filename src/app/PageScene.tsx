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
import { Mail, Phone, Github, Linkedin, MapPin } from "lucide-react";

export default function PageScene() {
  const [phase, setPhase] = useState<HeroPhase>("loading");
  const aboutRef = useRef<HTMLElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  const projectsRef = useRef<HTMLElement | null>(null);
  const educationRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: experienceProgress } = useScroll({
    target: experienceRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: projectsProgress } = useScroll({
    target: projectsRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: educationProgress } = useScroll({
    target: educationRef,
    offset: ["start start", "end start"],
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
     SCROLL MOTION (ABOUT + PROJECTS)
  ========================= */
  const aboutX = useTransform(aboutProgress, [0.0, 0.2, 1.0], [0, travelX, travelX], { clamp: true });
  const aboutY = useTransform(aboutProgress, [0.0, 0.2, 1.0], [0, travelY, travelY], { clamp: true });
  const aboutScale = useTransform(aboutProgress, [0.0, 1.0], [1, 1.65], { clamp: true });

  const experienceWeight = useTransform(experienceProgress, [0.0, 0.08, 0.92, 1.0], [0, 1, 1, 0], {
    clamp: true,
  });
  const experienceScale = useTransform(experienceProgress, [0.0, 1.0], [1.65, 0.5], { clamp: true });

  const projectsWeight = useTransform(projectsProgress, [0.0, 0.06, 0.94, 1.0], [0, 1, 1, 0], {
    clamp: true,
  });
  const projectsX = useTransform(projectsProgress, [0.0, 0.08, 1.0], [0, -vw * 0.34, -vw * 0.34], {
    clamp: true,
  });
  const projectsY = useTransform(projectsProgress, [0.0, 0.08, 1.0], [0, -vh * 0.22, -vh * 0.22], {
    clamp: true,
  });
  const projectsScale = useTransform(projectsProgress, [0.0, 0.08, 1.0], [0.5, 0.5, 0.5], {
    clamp: true,
  });

  const xScrollRawPx = useTransform([aboutX, projectsX, projectsWeight], (v) => {
    const [ax, px, w] = v as [number, number, number];
    return ax * (1 - w) + px * w;
  });

  const yScrollRawPx = useTransform([aboutY, projectsY, projectsWeight], (v) => {
    const [ay, py, w] = v as [number, number, number];
    return ay * (1 - w) + py * w;
  });

  const scaleAfterExperience = useTransform([aboutScale, experienceScale, experienceWeight], (v) => {
    const [as, es, w] = v as [number, number, number];
    return as * (1 - w) + es * w;
  });

  const scaleScrollRaw = useTransform([scaleAfterExperience, projectsScale, projectsWeight], (v) => {
    const [s, ps, w] = v as [number, number, number];
    return s * (1 - w) + ps * w;
  });

  const educationFade = useTransform(educationProgress, [0.0, 0.15, 1.0], [1, 0, 0], { clamp: true });

  const xScrollPx = useSpring(xScrollRawPx, { stiffness: 120, damping: 22, mass: 0.7 });
  const yScrollPx = useSpring(yScrollRawPx, { stiffness: 120, damping: 22, mass: 0.7 });
  const scaleScroll = useSpring(scaleScrollRaw, { stiffness: 120, damping: 22, mass: 0.7 });

  /* =========================
     ENABLE SCROLL AFTER HERO
  ========================= */
  const enabled: MotionValue<number> = useMotionValue(0);

  const orbOpacity = useTransform([educationFade, enabled], (v) => {
    const [f, e] = v as [number, number];
    return f * e;
  });

  const [orbActive, setOrbActive] = useState(true);
  useEffect(() => {
    const unsub = educationFade.on("change", (v) => {
      if (v <= 0.02) {
        setOrbActive(false);
      }
    });
    return () => unsub();
  }, [educationFade]);

  useEffect(() => {
    if (phase === "done") {
      const c = animate(enabled, 1, { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] });
      return () => c.stop();
    }
    enabled.set(0);
  }, [phase, enabled]);

  /* =========================
     âœ… FIX "unknown" BY CASTING TUPLE
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
          width: phase === "loading" ? "80px" : "min(560px,78vw)",
          height: phase === "loading" ? "80px" : "min(560px,78vw)",
        }}
        transition={{ duration: 1.15, ease: [0.2, 0.8, 0.2, 1] }}
        style={{
          x: orbXPx,
          y: orbYPx,
          scale: orbScale,
          opacity: orbOpacity,
          translateX: "-50%",
          translateY: "-50%",
          borderRadius: 9999,
        }}
      >
        <LiquidOrb className="h-full w-full" active={orbActive} />
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
        ref={experienceRef}
        id="experience"
        eyebrow="EXPERIENCE"
        title=""
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
              <li>Built a SaaS platform used by 20+ clients across HR, sales, and operations.</li>
              <li>Set up CI/CD with automated tests prior to deployment and organized code reviews.</li>
              <li>Partnered with product and clients for planning, specs, and validation.</li>
              <li>Acted as quality lead for ticket organization and team support (12 people).</li>
            </ul>
          </div>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-lg font-medium text-black">
                N2 Support Engineer · Group LabelVie
              </div>
               <div className="text-sm text-black/55">Morocco · On-site · Jun 2023 - Jun 2024</div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-black/70">
              <li>Managed L1 and L2 incidents for business applications.</li>
              <li>Processed support requests and data extraction tasks.</li>
              <li>Developed specific features using Java.</li>
              <li>Designed and implemented PL/SQL extraction queries.</li>
              <li>Performed functional validation through user scenario testing for ERP system upgrades.</li>
              <li>Conducted in-depth diagnostics and provided improvement recommendations.</li>
            </ul>
          </div>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-lg font-medium text-black">
                 Consultant technico-fonctionnel ServiceNow · DXC Technology
              </div>
              <div className="text-sm text-black/55">Rabat, Rabat-Salé-Kénitra, Morocco · Remote · Apr 2022 - Sep 2022</div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-black/70">
              <li>Completed full ServiceNow training and certification preparation.</li>
              <li>Analyzed and designed application models using MERISE methodology.</li>
              <li>Participated in project kick-off meetings.</li>
              <li>Developed ServiceNow features including Virtual Agent, MFA (OKTA Verify), approvals, notifications, record producers, plugins, Flow Designer, and scripting (JavaScript).</li>
              <li>Performed testing, deployment, final delivery, and validation of the application.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section
        ref={projectsRef}
        id="projects"
        eyebrow="PROJECTS"
        title="Selected work."
        subtitle="A curated set of projects focused on real-world constraints, performance, and polish."
      >
        <div className="grid gap-8 md:grid-cols-[260px_1fr] md:items-start">
          <div className="space-y-4">
            <p className="text-[11px] tracking-[0.35em] text-black/55">FEATURED WORK</p>
            <a
              href="https://github.com/sofmega"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-[11px] tracking-[0.35em] text-black/70 hover:bg-black/5 transition"
            >
              ALL WORK →
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <a
              href="https://github.com/sofmega/CinemaBackEnd"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-black/10 bg-white/40 p-5 transition hover:bg-white/60"
            >
              <div className="text-sm tracking-[0.2em] text-black/50">SPRING BOOT</div>
              <h3 className="mt-2 text-lg font-medium text-black">CinemaBackEnd</h3>
              <p className="mt-3 text-sm text-black/65">
                Spring Boot + JPA REST API for cinema management and ticketing, featuring rich domain modeling, data
                seeding, and transactional seat reservation.
              </p>
            </a>

            <a
              href="https://github.com/sofmega/CinemaFrontEnd"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-black/10 bg-white/40 p-5 transition hover:bg-white/60"
            >
              <div className="text-sm tracking-[0.2em] text-black/50">ANGULAR</div>
              <h3 className="mt-2 text-lg font-medium text-black">CinemaFrontEnd</h3>
              <p className="mt-3 text-sm text-black/65">
                Angular SPA that consumes the CinemaBackEnd API to browse cinemas, showtimes, and seats with real-time
                ticket reservation flow.
              </p>
            </a>

            <a
              href="https://github.com/sofmega/CV_generator"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-black/10 bg-white/40 p-5 transition hover:bg-white/60"
            >
              <div className="text-sm tracking-[0.2em] text-black/50">FULL STACK</div>
              <h3 className="mt-2 text-lg font-medium text-black">CV_generator</h3>
              <p className="mt-3 text-sm text-black/65">
                 Production-ready CV/cover letter generator built with React, Node/Express, Supabase, and Stripe—AI text
                + PDF rendering included.
              </p>
            </a>

            <a
              href="https://github.com/sofmega/RPG_Game"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-black/10 bg-white/40 p-5 transition hover:bg-white/60"
            >
              <div className="text-sm tracking-[0.2em] text-black/50">JAVA / JAVAFX</div>
              <h3 className="mt-2 text-lg font-medium text-black">RPG_Game</h3>
              <p className="mt-3 text-sm text-black/65">
                RPG prototype in Java/JavaFX showcasing clean OOP design, layered architecture, and a playable combat
                loop (character creation → battle).
              </p>
            </a>
          </div>
        </div>
      </Section>

      <Section
        ref={educationRef}
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
        title="Let's connect."
        subtitle="Open to full-stack roles, Software engineer, Engneer Support , QA Test , ServiceNow Developer."
      >
        <div className="flex flex-col gap-3 text-black/70">
          <a href="mailto:Soufiane.radouane99@gmail.com" className="inline-flex items-center gap-3 transition hover:text-black"><Mail className="h-4 w-4 text-black/60" aria-hidden="true" /><span>Soufiane.radouane99@gmail.com</span></a>
          <a href="tel:+33745767913" className="inline-flex items-center gap-3 transition hover:text-black"><Phone className="h-4 w-4 text-black/60" aria-hidden="true" /><span>+33 7 45 76 79 13</span></a>
          <a href="https://github.com/sofmega" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 transition hover:text-black"><Github className="h-4 w-4 text-black/60" aria-hidden="true" /><span>github.com/sofmega</span></a>
          <a href="https://www.linkedin.com/in/soufiane-radouane-9b047220a/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 transition hover:text-black"><Linkedin className="h-4 w-4 text-black/60" aria-hidden="true" /><span>linkedin.com/in/soufiane-radouane-9b047220a</span></a>
          <a href="https://maps.google.com/?q=Asnieres-sur-Seine+92" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 transition hover:text-black"><MapPin className="h-4 w-4 text-black/60" aria-hidden="true" /><span>Asnieres-sur-Seine (92) · Available immediately</span></a>
        </div>
      </Section>
    </div>
  );
}


