import { ShoppingBag } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import ContactButton from '@/components/ContactButton';
import { GYM_CONTACT } from '@/models/branding';

const PRODUCTOS = [
  {
    name: 'Camiseta Big Boys',
    category: 'Ropa',
    price: 'Próximamente',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Hoodie del box',
    category: 'Ropa',
    price: 'Próximamente',
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Shaker oficial',
    category: 'Accesorios',
    price: 'Próximamente',
    image:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Straps & gear',
    category: 'Entrenamiento',
    price: 'Próximamente',
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
  },
] as const;

export default function TiendaPage() {
  return (
    <div className="relative min-h-screen scroll-mt-8 pt-24 sm:pt-28 md:pt-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(220,38,38,0.1),transparent_55%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28 md:px-10 md:pb-32">
        <FadeIn delay={0} y={36} className="mb-14 sm:mb-16 md:mb-20">
          <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-red-500/90 sm:text-left">
            Merch & suplementos
          </p>
          <h1
            className="hero-heading text-center font-black uppercase leading-[0.95] tracking-tight sm:text-left"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 5rem)' }}
          >
            Tienda
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-center font-light leading-relaxed text-[#D7E2EA]/75 sm:mx-0 sm:max-w-lg sm:text-left">
            Ropa, accesorios y productos del gym. Pregunta por disponibilidad en recepción o por
            WhatsApp.
          </p>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {PRODUCTOS.map((product, index) => (
            <FadeIn key={product.name} delay={0.05 * index} y={24}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#D7E2EA]/10 bg-white/[0.02] transition-colors hover:border-red-500/30">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#111]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-transparent to-transparent opacity-80"
                    aria-hidden
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D7E2EA]/45">
                    {product.category}
                  </p>
                  <h2 className="font-semibold uppercase tracking-wide text-[#D7E2EA]">
                    {product.name}
                  </h2>
                  <p className="mt-auto text-sm font-medium text-red-400/90">{product.price}</p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.25} y={20} className="mt-16 flex flex-col items-center gap-6 sm:mt-20">
          <div className="flex items-center gap-3 text-[#D7E2EA]/60">
            <ShoppingBag className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            <p className="text-center text-sm font-light sm:text-left">
              Catálogo en expansión — escríbenos para pedidos y tallas.
            </p>
          </div>
          <ContactButton
            label="Pedir por WhatsApp"
            href={GYM_CONTACT.whatsappHref}
          />
        </FadeIn>
      </div>
    </div>
  );
}
