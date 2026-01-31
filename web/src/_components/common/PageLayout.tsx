import Footer from '@/_components/landing/Footer';
import Header from '@/_components/common/Header';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function PageLayout({
  children,
  title,
  description,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Page Header */}
      <div className="border-b border-border bg-surface/50 pt-16 md:pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-heading mb-2 text-3xl font-bold text-primary sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-base text-primary/60">{description}</p>
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
