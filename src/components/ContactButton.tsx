import { ctaPrimaryClass, ctaPrimarySizeClass } from '@/lib/ctaStyles';

interface ContactButtonProps {
  label?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export default function ContactButton({
  label = 'Contact Me',
  onClick,
  href,
  className = '',
}: ContactButtonProps) {
  const baseClass = [ctaPrimaryClass, ctaPrimarySizeClass, className].filter(Boolean).join(' ');

  if (href) {
    const external = /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        className={baseClass}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {label}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClass}>
      {label}
    </button>
  );
}
