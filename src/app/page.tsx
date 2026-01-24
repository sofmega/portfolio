import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Section from "@/components/Section";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />

      <Section
        id="about"
        eyebrow="ABOUT"
        title="A product-minded software engineer."
        subtitle="I build modern web experiences with clean architecture, strong UX, and reliable delivery."
      >
        <p className="text-black/70 leading-relaxed max-w-3xl">
          Replace this with a short summary from your CV (2–4 lines). Focus on:
          impact, stack, and what you enjoy building.
        </p>
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
        <p className="text-black/70">
          Email: your@email.com • LinkedIn • GitHub
        </p>
      </Section>
    </main>
  );
}
