// src/components/Hero.tsx
import HeroIntro, { type HeroPhase } from "@/components/HeroIntro";

export default function Hero({ onPhase }: { onPhase?: (p: HeroPhase) => void }) {
  return <HeroIntro onPhase={onPhase} />;
}
