import Header from '@/_components/common/Header';
import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
import CTA from './CTA';
import Footer from './Footer';
import Section from './Section';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Section background="default" id="features">
        <Features />
      </Section>

      {/* How It Works Section */}
      <Section background="surface" id="how-it-works">
        <HowItWorks />
      </Section>

      {/* CTA Section */}
      <Section background="default" id="get-started">
        <CTA />
      </Section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
