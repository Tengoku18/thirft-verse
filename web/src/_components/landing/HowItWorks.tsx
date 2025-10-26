'use client';

import { UserPlus, Upload, Share2, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    description:
      'Sign up in seconds and claim your unique storefront URL. No credit card required to start.',
  },
  {
    number: '02',
    icon: Upload,
    title: 'Add Your Items',
    description:
      'Upload photos of your thrift finds, add descriptions, set prices, and organize your collection.',
  },
  {
    number: '03',
    icon: Share2,
    title: 'Share Your Store',
    description:
      'Share your unique store link with your community on Instagram, TikTok, or anywhere you connect.',
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Start Selling',
    description:
      'Accept payments through eSewa, manage orders, and watch your thrift business grow.',
  },
];

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      {/* Section Header */}
      <div className="mb-16 text-center">
        <h2 className="font-heading mb-4 text-4xl font-bold text-primary sm:text-5xl">
          How It Works
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-primary/70">
          Get your thrift store online in minutes. It's as easy as 1-2-3-4.
        </p>
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Connection line */}
        <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-gradient-to-b from-secondary via-accent-2 to-accent-1 lg:block"></div>

        <div className="space-y-12 lg:space-y-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`relative flex flex-col gap-8 lg:flex-row lg:items-center ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Step number circle (for desktop) */}
                <div className="absolute left-0 top-0 hidden lg:block">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-surface bg-secondary shadow-lg animate-pulse-slow">
                    <span className="font-heading text-xl font-bold text-surface">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`flex-1 rounded-2xl border border-border bg-surface p-8 shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-1 lg:ml-24 ${
                    isEven ? 'lg:ml-24' : 'lg:mr-24 lg:ml-0'
                  }`}
                >
                  <div className="flex items-start gap-6">
                    {/* Mobile step number */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary lg:hidden">
                      <span className="font-heading text-lg font-bold text-surface">
                        {step.number}
                      </span>
                    </div>

                    <div className="flex-1">
                      {/* Icon */}
                      <div className="mb-4 inline-flex rounded-xl bg-secondary/10 p-3">
                        <Icon className="h-6 w-6 text-secondary" />
                      </div>

                      {/* Title */}
                      <h3 className="font-heading mb-3 text-2xl font-bold text-primary">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-primary/70 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Placeholder for alignment on alternating rows */}
                <div className="hidden flex-1 lg:block"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
