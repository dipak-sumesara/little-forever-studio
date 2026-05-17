import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../utils';
import type { ButtonProps, ButtonVariant } from '../../types';

export default function Button({ children, className, variant = 'primary', ...props }: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-ink text-cream shadow-soft hover:-translate-y-0.5 hover:bg-cocoa focus-visible:outline-ink',
    soft:
      'bg-white/75 text-ink premium-shadow ring-1 ring-white/70 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-blush',
    ghost:
      'bg-transparent text-cocoa ring-1 ring-cocoa/15 hover:bg-white/70 focus-visible:outline-cocoa'
  };

  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
