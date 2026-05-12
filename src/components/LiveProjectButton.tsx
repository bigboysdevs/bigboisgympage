import type { ButtonHTMLAttributes } from "react";

type LiveProjectButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function LiveProjectButton({ className = "", ...props }: LiveProjectButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-full border-2 border-[#D7E2EA] font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10 px-8 py-3 text-sm sm:px-10 sm:py-3.5 sm:text-base ${className}`}
      {...props}
    >
      Live Project
    </button>
  );
}
