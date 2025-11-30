'use client';

interface LoadingProps {
  message?: string;
  description?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'skeleton';
}

export default function Loading({
  fullScreen = true,
  variant = 'skeleton',
}: LoadingProps) {
  if (variant === 'skeleton') {
    return <PageSkeleton fullScreen={fullScreen} />;
  }

  // Spinner variant (legacy)
  return (
    <div
      className={`flex items-center justify-center bg-background px-4 ${
        fullScreen ? 'min-h-screen' : 'py-12'
      }`}
    >
      <div className="rounded-2xl bg-surface/80 backdrop-blur-sm p-8 sm:p-10 text-center shadow-xl border border-border/30">
        <div className="relative mx-auto mb-4 w-fit">
          <div className="h-12 w-12 border-4 animate-spin rounded-full border-primary/20 border-t-secondary" />
        </div>
        <p className="font-heading text-lg sm:text-xl font-semibold text-primary">
          Loading...
        </p>
        <div className="mt-4 flex justify-center gap-1">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="h-2 w-2 rounded-full bg-secondary animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Page skeleton that mimics the app layout
function PageSkeleton({ fullScreen = true }: { fullScreen?: boolean }) {
  return (
    <div
      className={`bg-background ${fullScreen ? 'min-h-screen' : 'min-h-[50vh]'}`}
    >
      {/* Header Skeleton */}
      <header className="border-b border-border/30 bg-surface/95 backdrop-blur-md">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo skeleton */}
            <div className="h-8 w-32 sm:w-40 animate-pulse rounded-lg bg-primary/10" />

            {/* Desktop nav links skeleton */}
            <div className="hidden lg:flex items-center gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-4 w-16 animate-pulse rounded bg-primary/10"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>

            {/* CTA button skeleton */}
            <div className="hidden lg:block h-9 w-24 animate-pulse rounded-full bg-secondary/30" />

            {/* Mobile menu button skeleton */}
            <div className="lg:hidden h-10 w-10 animate-pulse rounded-lg bg-primary/10" />
          </div>
        </nav>
      </header>

      {/* Main Content Skeleton */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page title skeleton */}
        <div className="mb-8">
          <div className="h-8 sm:h-10 w-48 sm:w-64 animate-pulse rounded-lg bg-primary/10 mb-3" />
          <div className="h-4 w-full max-w-md animate-pulse rounded bg-primary/8" />
        </div>

        {/* Content grid skeleton - responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <SkeletonCard key={i} delay={i * 50} />
          ))}
        </div>

        {/* Additional content skeleton */}
        <div className="mt-12 space-y-6">
          <div className="h-6 w-40 animate-pulse rounded-lg bg-primary/10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-surface p-6 border border-border/20">
              <SkeletonText lines={4} />
            </div>
            <div className="rounded-2xl bg-surface p-6 border border-border/20">
              <SkeletonText lines={4} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Skeleton components for content loading
export function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div className="rounded-2xl bg-surface p-4 shadow-md border border-border/20">
      <div
        className="aspect-square w-full animate-pulse rounded-xl bg-primary/10"
        style={{ animationDelay: `${delay}ms` }}
      />
      <div className="mt-4 space-y-3">
        <div
          className="h-4 w-3/4 animate-pulse rounded bg-primary/10"
          style={{ animationDelay: `${delay + 50}ms` }}
        />
        <div
          className="h-4 w-1/2 animate-pulse rounded bg-primary/10"
          style={{ animationDelay: `${delay + 100}ms` }}
        />
        <div
          className="h-6 w-1/3 animate-pulse rounded bg-primary/10"
          style={{ animationDelay: `${delay + 150}ms` }}
        />
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
