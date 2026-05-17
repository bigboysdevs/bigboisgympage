import type { ReactNode } from 'react';
import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import FadeIn from './FadeIn';
import ContactButton from './ContactButton';
import LiveProjectButton from './LiveProjectButton';
import { GYM_CONTACT } from '../models/branding';

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-4 sm:gap-5">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D7E2EA]/20 bg-white/[0.03]"
        aria-hidden
      >
        <Icon className="h-5 w-5 text-[#D7E2EA]/90" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D7E2EA]/45">
          {label}
        </p>
        <div className="mt-1 font-light leading-relaxed text-[#D7E2EA]">{children}</div>
      </div>
    </div>
  );
}

export default function ContactLocationSection() {
  const mailto = `mailto:${GYM_CONTACT.email}?subject=Consulta%20Big%20Boys%20Gym`;

  return (
    <section
      id="contacto"
      className="relative z-20 scroll-mt-8 border-t border-[#D7E2EA]/10 px-5 pt-24 pb-20 sm:px-8 sm:pt-32 sm:pb-28 md:px-10 md:pt-36 md:pb-32"
      style={{ backgroundColor: '#0C0C0C' }}
      aria-labelledby="contacto-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(220,38,38,0.08),transparent_60%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <FadeIn delay={0} y={36} className="mb-14 sm:mb-16 md:mb-20">
          <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-red-500/90 sm:text-left">
            Visítanos
          </p>
          <h2
            id="contacto-heading"
            className="hero-heading text-center font-black uppercase leading-[0.95] tracking-tight sm:text-left"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 5rem)' }}
          >
            Contáctanos
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-center font-light leading-relaxed text-[#D7E2EA]/75 sm:mx-0 sm:max-w-lg sm:text-left">
            Pasa por el box, escríbenos o reserva tu primera sesión. Estamos para ayudarte a
            entrenar en serio.
          </p>
        </FadeIn>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-stretch lg:gap-14">
          <FadeIn delay={0.08} y={28} className="flex flex-col gap-8 sm:gap-10">
            <InfoRow icon={MapPin} label="Ubicación">
              {GYM_CONTACT.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </InfoRow>

            <InfoRow icon={Clock} label="Horario">
              <ul className="space-y-2">
                {GYM_CONTACT.hours.map(({ label, value }) => (
                  <li key={label} className="flex justify-between gap-4 text-sm sm:text-base">
                    <span className="uppercase tracking-wide text-[#D7E2EA]/55">{label}</span>
                    <span className="text-right font-medium text-[#D7E2EA]">{value}</span>
                  </li>
                ))}
              </ul>
            </InfoRow>

            <InfoRow icon={Phone} label="Teléfono">
              <a
                href={GYM_CONTACT.phoneHref}
                className="font-medium text-[#D7E2EA] transition-colors hover:text-red-400"
              >
                {GYM_CONTACT.phoneDisplay}
              </a>
            </InfoRow>

            <InfoRow icon={Mail} label="Correo">
              <a
                href={mailto}
                className="break-all font-medium text-[#D7E2EA] transition-colors hover:text-red-400"
              >
                {GYM_CONTACT.email}
              </a>
            </InfoRow>

            <div className="flex flex-wrap gap-3 pt-2">
              <ContactButton label="Escríbenos" href={mailto} />
              <LiveProjectButton href={GYM_CONTACT.mapsPlaceUrl} label="Cómo llegar" />
              <a
                href={GYM_CONTACT.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#D7E2EA]/25 px-6 py-3 text-xs font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10 sm:text-sm"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.16} y={32} className="min-h-[280px] lg:min-h-full">
            <div className="flex h-full min-h-[280px] flex-col overflow-hidden rounded-[28px] border border-[#D7E2EA]/15 bg-[#141414] sm:rounded-[36px] lg:min-h-[420px]">
              <div className="flex items-center justify-between gap-3 border-b border-[#D7E2EA]/10 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2 text-[#D7E2EA]/80">
                  <Navigation className="h-4 w-4 text-red-500/90" aria-hidden />
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    Ubicación
                  </span>
                </div>
                <a
                  href={GYM_CONTACT.mapsPlaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-medium uppercase tracking-wider text-red-400/90 transition-colors hover:text-red-300"
                >
                  Abrir en Maps
                </a>
              </div>

              <div className="relative min-h-[240px] flex-1 lg:min-h-[360px]">
                <iframe
                  title="Mapa — Big Boys GYM, Manizales"
                  src={GYM_CONTACT.mapsEmbedUrl}
                  className="absolute inset-0 h-full w-full border-0 grayscale-[0.2] contrast-[1.05]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

