import { useEffect, useRef, useState } from "react";

const MARQUEE_GIFS = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
] as const;

function triple<T>(arr: readonly T[]): T[] {
  return [...arr, ...arr, ...arr];
}

export function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [row1X, setRow1X] = useState(-200);
  const [row2X, setRow2X] = useState(200);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setRow1X(offset - 200);
      setRow2X(-(offset - 200));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const row1 = triple(MARQUEE_GIFS.slice(0, 11));
  const row2 = triple(MARQUEE_GIFS.slice(11));

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40"
      aria-label="Work previews"
    >
      <div className="flex flex-col gap-3">
        <div className="overflow-hidden">
          <div
            className="flex gap-3"
            style={{
              willChange: "transform",
              transform: `translateX(${row1X}px)`,
            }}
          >
            {row1.map((src, i) => (
              <img
                key={`r1-${i}-${src}`}
                src={src}
                alt=""
                width={420}
                height={270}
                loading="lazy"
                decoding="async"
                className="h-[270px] w-[420px] shrink-0 rounded-2xl object-cover"
              />
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div
            className="flex gap-3"
            style={{
              willChange: "transform",
              transform: `translateX(${row2X}px)`,
            }}
          >
            {row2.map((src, i) => (
              <img
                key={`r2-${i}-${src}`}
                src={src}
                alt=""
                width={420}
                height={270}
                loading="lazy"
                decoding="async"
                className="h-[270px] w-[420px] shrink-0 rounded-2xl object-cover"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
