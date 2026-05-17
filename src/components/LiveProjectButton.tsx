import { ctaSecondaryClass, ctaSecondarySizeClass } from '@/lib/ctaStyles';

interface LiveProjectButtonProps {
  href?: string;
  label?: string;
  onClick?: () => void;
  className?: string;
}

export default function LiveProjectButton({
  href,
  label = 'Live Project',
  onClick,
  className = '',
}: LiveProjectButtonProps) {
  const baseClass = [ctaSecondaryClass, ctaSecondarySizeClass, className].filter(Boolean).join(' ');

  if (href) {
    const sameWindow = href.startsWith('#') || href.startsWith('mailto:');
    return (
      <a
        href={href}
        className={baseClass}
        {...(sameWindow ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
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
