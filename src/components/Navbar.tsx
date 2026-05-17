import { useCallback, useEffect, useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const SCROLL_LINKS = [
  { label: 'Inicio', id: 'inicio' as const, href: '#inicio' },
  { label: 'Entrenamientos', id: 'entrenamientos' as const, href: '#entrenamientos' },
  { label: 'Rutinas', id: 'rutinas' as const, href: '#rutinas' },
  { label: 'Contacto', id: 'contacto' as const, href: '#contacto' },
] as const;

type ScrollSectionId = (typeof SCROLL_LINKS)[number]['id'];

const contactoHref = '#contacto';

function sectionDocumentTop(el: HTMLElement): number {
  return el.getBoundingClientRect().top + window.scrollY;
}

const contactoButtonClass =
  'inline-flex items-center justify-center rounded-full uppercase tracking-widest font-semibold ' +
  'border-2 border-red-500/80 bg-red-600/15 text-[#fafafa] px-5 py-2.5 text-xs sm:text-sm ' +
  'shadow-[0_0_24px_rgba(220,38,38,0.15)] transition-colors duration-200 ' +
  'hover:bg-red-600/35 hover:border-red-400 active:bg-red-700/40';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<ScrollSectionId | null>('inicio');
  const panelId = useId();

  const updateActiveSection = useCallback(() => {
    const header = document.getElementById('site-header');
    const headerH = header?.offsetHeight ?? 80;
    const anchor = window.scrollY + headerH + 12;

    let next: ScrollSectionId = 'inicio';
    for (let i = SCROLL_LINKS.length - 1; i >= 0; i--) {
      const { id } = SCROLL_LINKS[i];
      const el = document.getElementById(id);
      if (!el) continue;
      if (sectionDocumentTop(el) <= anchor) {
        next = id;
        break;
      }
    }
    setActiveSection(next);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateActiveSection);
    };
    updateActiveSection();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      cancelAnimationFrame(raf);
    };
  }, [updateActiveSection]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        className="flex w-full items-center justify-end gap-2 px-3 py-3 sm:gap-3 sm:px-5 md:px-8 lg:px-10 md:py-4"
        aria-label="Principal"
      >
        <a href="#inicio" className="sr-only">
          Inicio — Big Boys Gym
        </a>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a href={contactoHref} className={contactoButtonClass}>
            Contacto
          </a>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#D7E2EA]/30 bg-[#0C0C0C]/35 text-[#D7E2EA] backdrop-blur-[2px] hover:border-red-500/50 hover:bg-[#0C0C0C]/55 transition-colors"
            aria-expanded={menuOpen}
            aria-controls={panelId}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="sr-only">{menuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
            {menuOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.div
              key="nav-backdrop"
              role="presentation"
              aria-hidden
              className="fixed inset-0 z-[80] bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
            />
            <motion.aside
              key="nav-drawer"
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación"
              className="fixed top-0 right-0 z-[100] flex h-full w-full max-w-sm flex-col border-l border-[#D7E2EA]/15 bg-[#0C0C0C] px-8 pb-10 pt-20 shadow-[-12px_0_40px_rgba(0,0,0,0.45)]"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            >
              <button
                type="button"
                onClick={closeMenu}
                className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-lg border border-[#D7E2EA]/25 text-[#D7E2EA] hover:bg-white/5"
                aria-label="Cerrar menú"
              >
                <X className="h-6 w-6" aria-hidden />
              </button>
              <div className="mt-10 flex flex-col items-stretch gap-1 text-right">
                {SCROLL_LINKS.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={[
                        'text-[#D7E2EA] font-medium uppercase tracking-wider text-lg py-3 transition-opacity duration-200 hover:opacity-80',
                        isActive ? 'line-through decoration-[#D7E2EA] decoration-2 opacity-70' : '',
                      ].join(' ')}
                      onClick={closeMenu}
                      aria-current={isActive ? 'location' : undefined}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
