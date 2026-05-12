import { Sparkles } from "lucide-react";
import { ContactButton } from "../components/ContactButton";
import { FadeIn } from "../components/FadeIn";
import { Magnet } from "../components/Magnet";

const PORTRAIT_SRC =
  "https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png";

const NAV = [
  { label: "About", href: "#about" },
  { label: "Price", href: "#price" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;

export function HeroSection() {
  return (
    <section className="relative flex h-screen min-h-0 flex-col overflow-x-clip bg-[#0C0C0C]">
      <Sparkles
        className="pointer-events-none absolute right-6 top-28 z-[5] hidden h-6 w-6 text-[#D7E2EA]/35 md:block md:h-8 md:w-8"
        aria-hidden
      />
      <FadeIn delay={0} y={-20} className="w-full shrink-0">
        <nav
          className="flex w-full justify-between px-6 pt-6 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] md:px-10 md:pt-8 md:text-lg lg:text-[1.4rem]"
          aria-label="Primary"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-opacity duration-200 hover:opacity-70"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </FadeIn>

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:w-[360px] sm:translate-y-0 md:w-[440px] lg:w-[520px]">
          <FadeIn delay={0.6} y={30} className="pointer-events-auto">
            <Magnet
              padding={150}
              strength={3}
              activeTransition="transform 0.3s ease-out"
              inactiveTransition="transform 0.6s ease-in-out"
              className="mx-auto w-full max-w-none"
            >
              <img
                src={PORTRAIT_SRC}
                alt="Jack — retrato 3D"
                className="mx-auto block h-auto w-full select-none"
                width={520}
                height={680}
                loading="eager"
                decoding="async"
              />
            </Magnet>
          </FadeIn>
        </div>

        <div className="relative z-20 flex min-h-0 flex-1 flex-col">
          <div className="w-full overflow-hidden">
            <FadeIn delay={0.15} y={40}>
              <h1 className="hero-heading w-full whitespace-nowrap font-black uppercase leading-none tracking-tight text-[14vw] sm:mt-4 sm:text-[15vw] md:-mt-5 md:text-[16vw] lg:text-[17.5vw] mt-6">
                Hi, i&apos;m jack
              </h1>
            </FadeIn>
          </div>

          <div className="mt-auto flex items-end justify-between pb-7 sm:pb-8 md:pb-10">
            <FadeIn delay={0.35} y={20} className="max-w-[160px] sm:max-w-[220px] md:max-w-[260px]">
              <p
                className="font-light uppercase leading-snug tracking-wide text-[#D7E2EA]"
                style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}
              >
                a 3d creator driven by crafting striking and unforgettable projects
              </p>
            </FadeIn>
            <FadeIn delay={0.5} y={20}>
              <a href="#contact">
                <ContactButton />
              </a>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
