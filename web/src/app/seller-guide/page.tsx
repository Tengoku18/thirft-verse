'use client';

import PageLayout from '@/_components/common/PageLayout';
import { CheckCircle, Camera, Tag, Share2, TrendingUp, Heart } from 'lucide-react';

const guideSteps = [
  {
    step: 1,
    title: 'Create Your Account & Choose Your Subdomain',
    icon: CheckCircle,
    content: [
      'Sign up with your email and create a secure password',
      'Choose a unique subdomain that represents your brand (e.g., vintagestyle.thriftverse.com)',
      'Complete your profile with a profile picture and bio',
      'Connect your eSewa account for payments',
    ],
    tip: 'Choose a subdomain that is easy to remember and share. It becomes your brand identity!',
  },
  {
    step: 2,
    title: 'Photograph Your Products',
    icon: Camera,
    content: [
      'Use natural lighting for the best results',
      'Take multiple angles of each item (front, back, details, flaws)',
      'Use a clean, simple background',
      'Show items being worn or styled when possible',
      'Highlight any unique details or vintage features',
    ],
    tip: 'Great photos sell items faster! Invest time in quality photography.',
  },
  {
    step: 3,
    title: 'List Your Items',
    icon: Tag,
    content: [
      'Upload your photos (up to 5 per item)',
      'Write detailed, honest descriptions including measurements',
      'Set competitive prices (research similar items)',
      'Specify condition clearly (new, like new, good, fair)',
      'Add relevant tags for better discoverability',
      'Include shipping information',
    ],
    tip: 'Honest, detailed descriptions build trust and reduce returns.',
  },
  {
    step: 4,
    title: 'Market Your Store',
    icon: Share2,
    content: [
      'Share your store link on Instagram, Facebook, TikTok',
      'Add your store URL to your social media bios',
      'Create engaging content showing your items',
      'Use relevant hashtags (#thrift #vintage #sustainable)',
      'Engage with your followers and potential customers',
      'Post new arrivals regularly',
    ],
    tip: 'Consistency is key! Post regularly to keep your audience engaged.',
  },
  {
    step: 5,
    title: 'Manage Orders & Grow',
    icon: TrendingUp,
    content: [
      'Respond promptly to customer inquiries',
      'Ship orders within 2-3 business days',
      'Package items carefully and sustainably',
      'Include a thank you note for a personal touch',
      'Ask for reviews and feedback',
      'Use analytics to understand what sells best',
    ],
    tip: 'Excellent customer service leads to repeat customers and referrals!',
  },
];

const bestPractices = [
  {
    title: 'Pricing Strategy',
    tips: [
      'Research similar items to price competitively',
      'Consider the condition and rarity',
      'Factor in your costs (purchase, cleaning, photography)',
      'Be willing to negotiate, but know your minimum',
      'Offer bundle discounts to move inventory',
    ],
  },
  {
    title: 'Customer Service',
    tips: [
      'Respond to messages within 24 hours',
      'Be honest about item condition and flaws',
      'Process refunds promptly if needed',
      'Thank customers for their purchase',
      'Keep customers updated on shipping',
    ],
  },
  {
    title: 'Inventory Management',
    tips: [
      'Organize your inventory by category',
      'Mark items as sold immediately',
      'Restock regularly to keep your store fresh',
      'Rotate seasonal items',
      'Clear out slow-moving inventory with sales',
    ],
  },
];

export default function SellerGuidePage() {
  return (
    <PageLayout
      title="Seller Guide"
      description="Your complete guide to building a successful thrift business on ThriftVerse"
    >
      <div className="py-12">
        {/* Introduction */}
        <div className="mb-16 rounded-2xl border border-border bg-gradient-to-br from-secondary/5 to-accent-2/5 p-8">
          <h2 className="font-heading mb-4 text-2xl font-bold text-primary">
            Welcome to Your Thrift Journey!
          </h2>
          <p className="mb-4 text-lg leading-relaxed text-primary/80">
            This guide will walk you through everything you need to know to
            start, run, and grow a successful thrift store on ThriftVerse.
            Whether you're selling a few items from your closet or building a
            full-time business, we're here to help you succeed.
          </p>
          <p className="text-primary/70">
            Let's turn your passion for sustainable fashion into profit!
          </p>
        </div>

        {/* Step-by-Step Guide */}
        <div className="mb-16">
          <h2 className="font-heading mb-8 text-3xl font-bold text-primary">
            Getting Started: Step by Step
          </h2>
          <div className="space-y-12">
            {guideSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="rounded-2xl border border-border bg-surface p-8"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-surface">
                      <span className="font-heading text-xl font-bold">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-primary">
                      {step.title}
                    </h3>
                  </div>

                  <ul className="mb-6 space-y-3">
                    {step.content.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                        <span className="text-primary/80">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="rounded-lg bg-accent-1/5 p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-xl">💡</span>
                      <div>
                        <strong className="text-primary">Pro Tip:</strong>{' '}
                        <span className="text-primary/70">{step.tip}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Practices */}
        <div className="mb-16">
          <h2 className="font-heading mb-8 text-3xl font-bold text-primary">
            Best Practices for Success
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {bestPractices.map((practice, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <h3 className="font-heading mb-4 text-xl font-bold text-primary">
                  {practice.title}
                </h3>
                <ul className="space-y-3">
                  {practice.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2">
                      <span className="mt-1 text-secondary">•</span>
                      <span className="text-sm text-primary/70">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Common Mistakes to Avoid */}
        <div className="mb-16">
          <h2 className="font-heading mb-8 text-3xl font-bold text-primary">
            Common Mistakes to Avoid
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                mistake: 'Poor Quality Photos',
                solution: 'Invest time in good photography with proper lighting',
              },
              {
                mistake: 'Vague Descriptions',
                solution:
                  'Be specific about size, condition, materials, and measurements',
              },
              {
                mistake: 'Overpricing',
                solution: 'Research market prices and price competitively',
              },
              {
                mistake: 'Slow Response Times',
                solution: 'Reply to customer messages within 24 hours',
              },
              {
                mistake: 'Not Marketing',
                solution:
                  'Actively share your store on social media platforms',
              },
              {
                mistake: 'Inconsistent Inventory',
                solution: 'Add new items regularly to keep customers coming back',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-surface p-6"
              >
                <h4 className="mb-2 font-semibold text-primary">
                  ❌ {item.mistake}
                </h4>
                <p className="text-sm text-primary/70">
                  ✅ <strong>Instead:</strong> {item.solution}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Inspiration Section */}
        <div className="rounded-2xl bg-gradient-to-br from-primary to-accent-1 p-12 text-center text-surface">
          <Heart className="mx-auto mb-6 h-12 w-12" />
          <h2 className="font-heading mb-4 text-3xl font-bold">
            You're Ready to Start!
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-surface/90">
            Remember, every successful seller started exactly where you are now.
            With dedication, great products, and excellent customer service,
            you'll build a thriving business. We're here to support you every
            step of the way!
          </p>
          <button className="rounded-lg bg-secondary px-8 py-4 font-semibold text-primary transition-all hover:scale-105 hover:shadow-lg">
            Create Your Store Now
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
