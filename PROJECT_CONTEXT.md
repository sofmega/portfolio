# Project Context for LLMs

This document summarizes the tools and technologies actually used in this repo so another LLM can orient quickly.

## Project Overview

This is a personal portfolio built with Next.js App Router and TypeScript. The UI relies on Framer Motion for animation, Tailwind CSS for styling, and a custom WebGL shader for the liquid orb visual.

## Technologies, Frameworks, and Libraries (In Use)

- Framework: Next.js (v15.1.3, App Router in `src/app`)
- Language: TypeScript (v5.5.4)
- UI Library: React (v18.3.1)
- Styling: Tailwind CSS (v4, via `@import "tailwindcss";` in `src/app/globals.css`)
- Animation: Framer Motion (v12.26.2)
- Theming: `next-themes` (v0.4.6, class-based theme toggle)
- Icons: `lucide-react` (v0.562.0)
- Lottie: `@lottiefiles/dotlottie-react` (loader animation)
- WebGL: Custom shader-driven canvas in `src/components/LiquidOrb.tsx`
- Canvas 2D: Code rain effect in `src/components/CodeRain.tsx`
- Utilities: `clsx` (v2.1.1)
- Linting: ESLint (v9 + `eslint-config-next` v15.1.3)
- Package Manager: npm (`package-lock.json`)

## Project Structure (Actual)

```
.
├── .next/               # Next.js build output
├── node_modules/        # Project dependencies
├── public/              # Static assets
├── src/                 # Main source code
│   ├── app/             # Next.js App Router
│   │   ├── favicon.ico
│   │   ├── globals.css  # Global styles (Tailwind import + theme vars)
│   │   ├── layout.tsx   # Root layout + ThemeProvider + CustomCursor
│   │   ├── page.tsx     # Root page
│   │   └── PageScene.tsx # Main scene with orb + sections
│   ├── components/      # Reusable React components
│   │   ├── CodeRain.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── DrawerMenu.tsx
│   │   ├── HeroIntro.tsx
│   │   ├── LiquidOrb.tsx
│   │   ├── Navbar.tsx
│   │   ├── OrbMaskedText.tsx
│   │   ├── Rings.tsx
│   │   ├── Section.tsx
│   │   └── ThemeSwitch.tsx
│   └── type/
│       └── css.d.ts
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

## How to Work with the Code

- Adding new pages: Create new folders inside `src/app` with a `page.tsx` file.
- Adding new components: Create new `.tsx` files inside `src/components`.
- Styling: Use Tailwind classes in JSX; global variables and theme styles live in `src/app/globals.css`.
- Animation: Use Framer Motion for transitions; prefer animating `transform` and `opacity`.
- Theming: Theme toggling uses `next-themes` with class-based dark mode.
- Dependencies: Use `npm install` to add packages.

## Common Commands

- Dev server: `npm run dev`
- Production build: `npm run build`
- Start production: `npm run start`
- Lint: `npm run lint`
