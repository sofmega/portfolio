# Project Context for LLMs

This document provides an overview of the project structure, technologies, and conventions to help Large Language Models (LLMs) understand and assist with development.

## Project Overview

This is a modern web application built with [Next.js](https://nextjs.org/), a React framework for building server-rendered and statically generated web applications. The project uses [TypeScript](https://www.typescriptlang.org/) for type safety and modern JavaScript features.

## Technologies, Frameworks, and Libraries

*   **Framework**: [Next.js](https://nextjs.org/) (v14 or later, using the App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Animation**: [Framer Motion](https://www.framer.com/motion/) for performant and complex animations.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with PostCSS for CSS transformations and utility-first styling.
*   **Linting**: [ESLint](httpss://eslint.org/) for code quality and consistency.
*   **Package Manager**: [npm](https://www.npmjs.com/)

## Project Structure

The project follows the standard structure for a Next.js application using the App Router.

```
.
├── .next/         # Next.js build output
├── node_modules/  # Project dependencies
├── public/        # Static assets (images, fonts, etc.)
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   └── profile.png
├── src/           # Main source code
│   ├── app/       # Next.js App Router directory
│   │   ├── favicon.ico
│   │   ├── globals.css # Global stylesheets
│   │   ├── layout.tsx  # Root layout component
│   │   └── page.tsx    # Main page component (route: /)
│   ├── components/  # Reusable React components
│   │   ├── CodeRain.tsx
│   │   ├── Hero.tsx
│   │   └── Navbar.tsx
│   └── type/        # TypeScript type definitions
│       └── css.d.ts
├── .gitignore       # Files and folders to be ignored by Git
├── eslint.config.mjs # ESLint configuration
├── next.config.ts   # Next.js configuration
├── package.json     # Project metadata and dependencies
├── postcss.config.mjs # PostCSS configuration
├── README.md        # Project documentation
└── tsconfig.json    # TypeScript compiler configuration
```

### Key Directories

*   **`./public`**: Contains static assets that are publicly accessible, such as images, svgs, and fonts.
*   **`./src/app`**: This is the core of the Next.js application, using the App Router paradigm.
    *   `layout.tsx`: The root layout that wraps all pages. It's used to define the global HTML structure (e.g., `<html>` and `<body>` tags) and share UI elements like headers and footers.
    *   `page.tsx`: The main entry point for the root URL (`/`).
    *   `globals.css`: Global CSS styles applied to the entire application.
*   **`./src/components`**: This directory should contain all reusable React components. The components are well-organized and have specific purposes (e.g., `Navbar`, `Hero`).
*   **`./src/type`**: Home for custom TypeScript type definitions.

## How to Work with the Code

*   **Adding new pages**: Create new folders inside `src/app` with a `page.tsx` file.
*   **Adding new components**: Create new `.tsx` files inside `src/components`.
*   **Styling**: Primarily use utility classes from Tailwind CSS. For global styles, modify `src/app/globals.css`.
*   **Dependencies**: Use `npm install` to add new dependencies.

This context should guide you in understanding the codebase and making changes that align with the project's architecture and conventions.
