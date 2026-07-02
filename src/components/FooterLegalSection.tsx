import { GYM_CONTACT, GYM_LOGO_TRANSPARENT_PNG } from '../models/branding';

const LEGAL_ITEMS = [
  {
    id: 'aviso-legal',
    title: 'Aviso legal',
    body: (
      <>
        <p>
          Este sitio web es operado por <strong>{GYM_CONTACT.name}</strong>, con domicilio en{' '}
          {GYM_CONTACT.addressLines.join(', ')}. El acceso y uso de esta página implica la
          aceptación de los avisos aquí publicados.
        </p>
        <p className="mt-3">
          Los contenidos (textos, imágenes, marca y diseño) están protegidos por la legislación
          aplicable en Colombia. Queda prohibida su reproducción sin autorización expresa.
        </p>
        <p className="mt-3">
          Para consultas sobre este sitio, escríbenos a{' '}
          <a
            href={`mailto:${GYM_CONTACT.email}`}
            className="text-red-400/90 underline-offset-2 hover:text-red-300 hover:underline"
          >
            {GYM_CONTACT.email}
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'privacidad',
    title: 'Política de privacidad',
    body: (
      <>
        <p>
          Recopilamos únicamente los datos que nos facilitas de forma voluntaria (por ejemplo, al
          escribirnos por correo, teléfono o WhatsApp) con el fin de responder consultas, gestionar
          membresías o información sobre nuestros servicios.
        </p>
        <p className="mt-3">
          No vendemos ni cedemos tus datos personales a terceros con fines comerciales. Podemos
          utilizar herramientas de terceros (mapas, redes sociales o analítica web) que procesan
          datos según sus propias políticas cuando interactúas con ellas desde este sitio.
        </p>
        <p className="mt-3">
          Puedes solicitar la actualización o eliminación de tus datos contactándonos por los
          canales indicados en la sección Contáctanos. El tratamiento se realiza conforme a la Ley
          1581 de 2012 y normas complementarias sobre protección de datos personales en Colombia.
        </p>
      </>
    ),
  },
  {
    id: 'terminos',
    title: 'Términos y condiciones',
    body: (
      <>
        <p>
          La información publicada en este sitio tiene carácter orientativo. Los horarios, precios
          y programas pueden variar; la información definitiva se confirma directamente en el box.
        </p>
        <p className="mt-3">
          La práctica de actividad física conlleva riesgos inherentes. Al participar en
          entrenamientos en {GYM_CONTACT.name} declaras que cuentas con condición médica adecuada o
          contarás con autorización profesional cuando corresponda. El centro no se hace responsable
          de lesiones derivadas del incumplimiento de indicaciones del personal o de tu propia
          negligencia.
        </p>
        <p className="mt-3">
          Las membresías, pagos y políticas de cancelación se rigen por los acuerdos firmados en
          recepción. El uso indebido de instalaciones o conducta que ponga en riesgo a terceros
          puede implicar la suspensión del acceso al servicio.
        </p>
      </>
    ),
  },
] as const;

export default function FooterLegalSection() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="legal"
      className="relative border-t border-white/10 px-5 py-14 sm:px-8 sm:py-16 md:px-10 md:py-20"
      style={{ backgroundColor: '#080808' }}
      aria-label="Pie de página"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(220,38,38,0.06),transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-[auto_1fr] lg:items-start lg:gap-x-10">
          <div className="flex shrink-0 justify-center sm:row-span-2 sm:justify-start lg:row-span-1 lg:pt-1">
            <img
              src={GYM_LOGO_TRANSPARENT_PNG}
              alt="Big Boys Gym"
              className="h-16 w-auto object-contain opacity-90 sm:h-20 lg:h-24"
              width={96}
              height={96}
              loading="lazy"
              decoding="async"
            />
          </div>

          <nav
            className="min-w-0 sm:col-start-2 lg:col-start-2 lg:pr-4"
            aria-label="Información legal"
          >
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
              Información legal
            </p>
            <ul className="space-y-3">
              {LEGAL_ITEMS.map(({ id, title, body }) => (
                <li key={id}>
                  <details className="group rounded-2xl border border-white/10 bg-white/[0.02] open:bg-white/[0.04]">
                    <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium uppercase tracking-wider text-white/85 transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
                      <span className="flex items-center justify-between gap-3">
                        {title}
                        <span
                          className="text-[10px] font-semibold text-red-500/80 transition-transform duration-200 group-open:rotate-45"
                          aria-hidden
                        >
                          +
                        </span>
                      </span>
                    </summary>
                    <div className="border-t border-white/10 px-5 py-4 text-left text-sm font-light leading-relaxed text-white/65">
                      {body}
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-12 border-t border-white/10 pt-8 text-center text-xs font-light leading-relaxed text-white/40">
          © {year} {GYM_CONTACT.name}. Todos los derechos reservados. {GYM_CONTACT.addressLines[1]}.
        </p>

        <p className="mt-3 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-white/35">
          Developed by{' '}
          <a
            href="https://landing-page-codevs-ia.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/55 underline-offset-2 transition-colors hover:text-red-400/90 hover:underline"
          >
            CODEVS IA
          </a>
        </p>
      </div>
    </footer>
  );
}
