'use client';

interface LoadingProps {
  message?: string;
  description?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({
  message = 'Loading...',
  description,
  fullScreen = true,
  size = 'md',
}: LoadingProps) {
  const sizeClasses = {
    sm: {
      spinner: 'h-8 w-8 border-[3px]',
      container: 'p-6',
      title: 'text-base',
      description: 'text-xs',
    },
    md: {
      spinner: 'h-12 w-12 border-4',
      container: 'p-8 sm:p-10',
      title: 'text-lg sm:text-xl',
      description: 'text-sm',
    },
    lg: {
      spinner: 'h-16 w-16 border-[5px]',
      container: 'p-10 sm:p-12',
      title: 'text-xl sm:text-2xl',
      description: 'text-base',
    },
  };

  const classes = sizeClasses[size];

  const content = (
    <div
      className={`rounded-2xl bg-surface/80 backdrop-blur-sm ${classes.container} text-center shadow-xl border border-border/30`}
    >
      {/* Animated Spinner */}
      <div className="relative mx-auto mb-4 w-fit">
        <div
          className={`${classes.spinner} animate-spin rounded-full border-primary/20 border-t-secondary`}
        />
        {/* Inner glow effect */}
        <div
          className={`absolute inset-0 ${classes.spinner} rounded-full border-transparent border-t-secondary/30 blur-sm`}
        />
      </div>

      {/* Loading Text */}
      <p
        className={`font-heading ${classes.title} font-semibold text-primary`}
      >
        {message}
      </p>

      {/* Optional Description */}
      {description && (
        <p className={`mt-2 ${classes.description} text-primary/60`}>
          {description}
        </p>
      )}

      {/* Animated dots */}
      <div className="mt-4 flex justify-center gap-1">
        <span
          className="h-2 w-2 rounded-full bg-secondary animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="h-2 w-2 rounded-full bg-secondary animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="h-2 w-2 rounded-full bg-secondary animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12 px-4">
      {content}
    </div>
  );
}

// Skeleton components for content loading
export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-surface p-4 shadow-md border border-border/20">
      <div className="aspect-square w-full animate-pulse rounded-xl bg-primary/10" />
      <div className="mt-4 space-y-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-primary/10" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-primary/10" />
        <div className="h-6 w-1/3 animate-pulse rounded bg-primary/10" />
      </div>
    </div>
  );
}

export function SkeletonText({
  lines = 3,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 animate-pulse rounded bg-primary/10 ${
            i === lines - 1 ? 'w-2/3' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

export function SkeletonImage({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-primary/10 ${className}`}
    />
  );
}
