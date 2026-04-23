import Header from '@/_components/common/Header';
import CTA from './CTA';
import Features from './Features';
import Footer from './Footer';
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import Section from './Section';
import SustainabilityStory from './SustainabilityStory';
import TrustStrip from './TrustStrip';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <Hero />

      <TrustStrip />

      <Section background="default" id="features">
        <Features />
      </Section>

      <Section background="surface" id="how-it-works">
        <HowItWorks />
      </Section>

      <Section background="default" id="sustainability">
        <SustainabilityStory />
      </Section>

      <Section background="default" id="get-started">
        <CTA />
      </Section>

      <Footer />
    </div>
  );
}
