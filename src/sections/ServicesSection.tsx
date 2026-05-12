import { FadeIn } from "../components/FadeIn";

const SERVICES: { num: string; title: string; body: string }[] = [
  {
    num: "01",
    title: "3D Modeling",
    body: "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.",
  },
  {
    num: "02",
    title: "Rendering",
    body: "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.",
  },
  {
    num: "03",
    title: "Motion Design",
    body: "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.",
  },
  {
    num: "04",
    title: "Branding",
    body: "Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.",
  },
  {
    num: "05",
    title: "Web Design",
    body: "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.",
  },
];

export function ServicesSection() {
  return (
    <section
      id="price"
      className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32"
    >
      <h2
        className="mb-16 text-center font-black uppercase text-[#0C0C0C] sm:mb-20 md:mb-28"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        Services
      </h2>

      <div className="mx-auto max-w-5xl divide-y divide-[rgba(12,12,12,0.15)] border-y border-[rgba(12,12,12,0.15)]">
        {SERVICES.map((item, i) => (
          <FadeIn key={item.num} delay={i * 0.1}>
            <article className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-[minmax(0,auto)_1fr] sm:gap-10 sm:py-10 md:gap-12 md:py-12">
              <p
                className="font-black leading-none text-[#0C0C0C]"
                style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
              >
                {item.num}
              </p>
              <div className="flex flex-col gap-3">
                <h3
                  className="font-medium uppercase text-[#0C0C0C]"
                  style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="max-w-2xl font-light leading-relaxed text-[#0C0C0C]/60"
                  style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}
                >
                  {item.body}
                </p>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
