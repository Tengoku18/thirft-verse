import Link from 'next/link';
import React from 'react';

interface LinkButtonProps {
  href: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export default function LinkButton({
  href,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  target,
  rel,
}: LinkButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';

  const variants = {
    primary:
      'bg-primary text-surface hover:bg-primary/90 shadow-sm',
    secondary:
      'bg-secondary text-primary hover:bg-secondary/90 shadow-sm',
    outline:
      'border border-primary text-primary hover:bg-primary hover:text-surface shadow-sm',
    danger:
      'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    ghost:
      'border border-primary/20 bg-surface/30 text-primary hover:bg-surface/50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <Link
      href={href}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      target={target}
      rel={rel}
    >
      {children}
    </Link>
  );
}
