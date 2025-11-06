import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-primary text-surface hover:bg-primary/90 disabled:opacity-50',
    secondary:
      'bg-secondary text-primary hover:bg-secondary/90 disabled:opacity-50',
    outline:
      'border border-primary text-primary hover:bg-primary hover:text-surface disabled:opacity-50',
    danger:
      'bg-red-600 text-white hover:bg-red-700 disabled:bg-surface/50 disabled:text-primary/30 disabled:border disabled:border-border',
    ghost:
      'border border-primary/20 bg-surface/30 text-primary hover:bg-surface/50 disabled:opacity-50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
