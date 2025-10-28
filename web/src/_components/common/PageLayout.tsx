import Footer from '@/_components/landing/Footer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showBackButton?: boolean;
}

export default function PageLayout({
  children,
  title,
  description,
  showBackButton = true,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-primary/70 transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="border-b border-border bg-linear-to-br from-surface to-secondary/5">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="font-heading mb-4 text-4xl font-bold text-primary sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-3xl text-lg text-primary/70">{description}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
