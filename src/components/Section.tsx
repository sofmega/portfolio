// src/components/Section.tsx
import Reveal from "@/components/Reveal";

type SectionProps = {
  id: string;
  eyebrow: string; // small label (ABOUT, PROJECTS...)
  title: string;   // main heading
  subtitle?: string; // optional short text on the right
  children: React.ReactNode;
};

export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className="bg-[#f3f1ec] px-6 md:px-10 py-28 border-t border-black/10"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="text-xs tracking-[0.25em] text-black/50">
                {eyebrow}
              </p>
              <h2 className="mt-3 text-4xl md:text-5xl font-medium tracking-tight text-black">
                {title}
              </h2>
            </Reveal>
          </div>

          {subtitle ? (
            <Reveal delay={0.06}>
              <p className="max-w-md text-sm leading-relaxed text-black/60">
                {subtitle}
              </p>
            </Reveal>
          ) : null}
        </div>

        {/* Content */}
        <Reveal delay={0.1}>{children}</Reveal>
      </div>
    </section>
  );
}
