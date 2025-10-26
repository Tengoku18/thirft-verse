'use client';

import { Store, Link2, ShoppingBag, TrendingUp, Lock, Palette } from 'lucide-react';

const features = [
  {
    icon: Store,
    title: 'Your Unique Storefront',
    description:
      'Get your own personalized subdomain URL. Brand your store exactly how you want it.',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    icon: Palette,
    title: 'Curate With Style',
    description:
      'Showcase your vintage treasures beautifully. Upload photos, set prices, and tell your story.',
    color: 'text-accent-2',
    bgColor: 'bg-accent-2/10',
  },
  {
    icon: ShoppingBag,
    title: 'Seamless Checkout',
    description:
      'Integrated eSewa payment gateway for secure, hassle-free transactions your customers will love.',
    color: 'text-accent-1',
    bgColor: 'bg-accent-1/10',
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Business',
    description:
      'Track your sales, manage inventory, and grow your thrift empire with powerful analytics.',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    icon: Link2,
    title: 'Share Anywhere',
    description:
      'Share your storefront link on social media, in your bio, or anywhere you connect with customers.',
    color: 'text-accent-2',
    bgColor: 'bg-accent-2/10',
  },
  {
    icon: Lock,
    title: 'Secure & Reliable',
    description:
      'Built with enterprise-grade security. Your data and your customers are always protected.',
    color: 'text-accent-1',
    bgColor: 'bg-accent-1/10',
  },
];

export default function Features() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      {/* Section Header */}
      <div className="mb-16 text-center">
        <h2 className="font-heading mb-4 text-4xl font-bold text-primary sm:text-5xl">
          Everything You Need to Thrive
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-primary/70">
          A complete platform designed for modern thrift entrepreneurs who care
          about sustainability and style.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Animated background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent-1/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

              <div className="relative">
                {/* Icon */}
                <div
                  className={`mb-5 inline-flex rounded-xl ${feature.bgColor} p-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
                >
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>

                {/* Content */}
                <h3 className="font-heading mb-3 text-xl font-bold text-primary">
                  {feature.title}
                </h3>
                <p className="text-primary/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Decorative corner element */}
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-secondary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
