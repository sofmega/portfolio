// src/components/Section.tsx
import Reveal from "@/components/Reveal";

type SectionProps = {
  id: string;
  eyebrow: string; // small label (ABOUT, PROJECTS...)
  title: string; // main heading
  subtitle?: string; // optional short text on the right
  children: React.ReactNode;

  // ✅ NEW: center mode for "About" (or any section)
  center?: boolean;
};

export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  center = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className="bg-[var(--bg)] px-6 md:px-10 py-28"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div
          className={[
            "mb-10 flex flex-col gap-6 md:items-end",
            center ? "md:items-center md:justify-center" : "md:flex-row md:justify-between",
          ].join(" ")}
        >
          <div className={center ? "text-center" : ""}>
            <Reveal>
              <p className="text-[11px] tracking-[0.35em] text-black/55">
                {eyebrow}
              </p>
              <h2 className="mt-3 text-[clamp(28px,4vw,56px)] font-medium tracking-tight text-black">
                {title}
              </h2>
            </Reveal>
          </div>

          {subtitle ? (
            <Reveal delay={0.06}>
              <p className={center
                ? "max-w-2xl text-center text-sm leading-relaxed text-black/60"
                : "max-w-md text-sm leading-relaxed text-black/60"
              }>
                {subtitle}
              </p>
            </Reveal>
          ) : null}
        </div>

        {/* Content */}
        <div className={center ? "mx-auto max-w-4xl text-center" : ""}>
          <Reveal delay={0.1}>{children}</Reveal>
        </div>
      </div>
    </section>
  );
}
