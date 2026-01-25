# Animation Goals and Best Practices

This document outlines the strategy for ensuring animations in this project are smooth, performant, and accessible.

## The Core Principle: CPU vs. GPU

For animations to be smooth, they must run on the device's Graphics Processing Unit (GPU) whenever possible. The browser is optimized to do this for two key CSS properties:

1.  `transform` (e.g., `translate`, `scale`, `rotate`)
2.  `opacity`

Animating other properties like `width`, `height`, `margin`, or `top` forces the browser's main thread (CPU) to do expensive work on every frame, leading to stuttering and poor performance, especially on low-end devices.

**Our goal is to exclusively animate `transform` and `opacity`.**

## Project-Specific Recommendations

The project currently has animations that can be optimized.

### 1. Refactor Loader Animations

*   **Components:** `PlusMark`, `BuildCircle`
*   **Problem:** These components animate their `width` and `height` properties to create a "loading" or "building" effect. This is CPU-intensive.
*   **Solution:** Refactor these animations to use the `transform: scale()` property instead. For example, to make a bar grow vertically, give it a final `height` of 100% and animate its `transform: scaleY()` from 0 to 1. This will be hardware-accelerated and significantly smoother.

**Conceptual Example:**

```jsx
// Instead of animating height:
<div style={{ height: `${progress * 100}%` }} />

// Animate scale instead:
<div
  style={{
    height: '100%',
    transform: `scaleY(${progress})`,
    transformOrigin: 'bottom' // Ensures it grows from the bottom
  }}
/>
```

### 2. Implement a "Reduced Motion" Mode

For accessibility and for users who prefer fewer animations, we should respect the `prefers-reduced-motion` setting.

*   **How:** Use the `motion-safe` and `motion-reduce` variants in Tailwind CSS, or a CSS media query, to conditionally disable or simplify animations. `framer-motion` also has utilities to help with this.

**Example:**

```jsx
// This animation will only run if the user has not requested reduced motion.
<div className="motion-safe:animate-spin">...</div>
```

By following these guidelines, we can make the most of `framer-motion` and ensure the portfolio is impressive, performant, and accessible to everyone.
