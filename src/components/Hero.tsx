"use client";

import { motion } from "framer-motion";
import CodeRain from "@/components/CodeRain";
import { Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden px-6 pt-24"
    >
      {/* Animated background */}
      <CodeRain className="z-0" opacity={0.28} speed={1.1} fontSize={16} />
      <div className="absolute inset-0 z-0 bg-black/35" />

      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-white/70 text-sm tracking-wide">
            Software Engineer • Paris • Available Immediately
          </p>

          <h1 className="mt-3 text-5xl md:text-7xl font-bold leading-tight text-white">
            Hi, I’m <span className="text-emerald-400">Soufiane</span>
          </h1>

          <p className="mt-6 text-lg text-white/75 max-w-xl">
            Recently graduated Software Engineer passionate about web development,
            with hands-on experience in <b>React</b>, <b>TypeScript</b>,{" "}
            <b>Node.js</b>, <b>PostgreSQL</b>, and <b>CI/CD</b>. Comfortable in Agile
            environments and quality-driven development.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="px-6 py-3 rounded-xl bg-emerald-500 text-black font-semibold hover:opacity-90 transition inline-flex items-center gap-2"
            >
              <Mail size={18} />
              Contact Me
            </a>

            <a
              href="https://github.com/sofmega"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              <Github size={18} />
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/soufiane-radouane-9b047220a/"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              <Linkedin size={18} />
              LinkedIn
            </a>
          </div>

          <div className="mt-8 text-white/70 text-sm">
            <span className="text-white/90 font-semibold">Core stack:</span>{" "}
            React • TypeScript • JavaScript • Node.js • PostgreSQL • CI/CD
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 p-1 shadow-2xl">
            <div className="w-full h-full rounded-full bg-black/60 backdrop-blur flex items-center justify-center overflow-hidden">
              <Image
                src="/profile.png"
                alt="Soufiane Radouane"
                width={400}
                height={400}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
