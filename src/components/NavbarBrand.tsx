import HeroFigureOnly from './HeroFigureOnly';

/** Logo 3D del hero, reubicado en la navbar (mismo tamaño que el PNG anterior). */
export default function NavbarBrand() {
  return (
    <span className="navbar-brand-figure" aria-hidden>
      <HeroFigureOnly variant="nav" />
    </span>
  );
}
