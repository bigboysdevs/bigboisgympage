/** Lockup oficial: C + cerebro + DEVS + IA (extraído del logo CODEVS IA). */
export default function CodevsLogoLockup({ className = '' }: { className?: string }) {
  return (
    <span className={['codevs-logo-lockup', className].filter(Boolean).join(' ')} aria-hidden>
      <span className="codevs-logo-lockup__text">C</span>
      <img
        src="/codevs-ia-logo.gif"
        alt=""
        className="codevs-logo-lockup__brain"
        width={36}
        height={36}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <span className="codevs-logo-lockup__text">DEVS</span>
      <span className="codevs-logo-lockup__text codevs-logo-lockup__text--ia">IA</span>
    </span>
  );
}
