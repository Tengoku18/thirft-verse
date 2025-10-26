'use client';

import PageLayout from '@/_components/common/PageLayout';
import Button from '@/_components/common/Button';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for getting started with your thrift journey',
    features: [
      'Up to 10 products',
      'Basic storefront customization',
      'eSewa payment integration',
      'Mobile-responsive store',
      'Basic analytics',
      'Email support',
    ],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 'Rs. 999',
    period: '/month',
    description: 'For serious sellers ready to scale their business',
    features: [
      'Unlimited products',
      'Advanced storefront customization',
      'Priority eSewa payment processing',
      'Custom domain support',
      'Advanced analytics & insights',
      'Inventory management tools',
      'Priority support',
      'Marketing tools & templates',
      'Customer management',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For established brands with unique needs',
    features: [
      'Everything in Pro',
      'Multiple storefronts',
      'Dedicated account manager',
      'Custom integrations',
      'White-label options',
      'API access',
      '24/7 phone support',
      'Custom training & onboarding',
    ],
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <PageLayout
      title="Pricing Plans"
      description="Choose the perfect plan for your thrift business. Start free and scale as you grow."
    >
      <div className="py-12">
        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border-2 bg-surface p-8 transition-all duration-300 hover:shadow-xl ${
                plan.highlighted
                  ? 'border-secondary scale-105 shadow-lg'
                  : 'border-border hover:-translate-y-2'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-4 py-1 text-sm font-semibold text-surface">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-heading mb-2 text-2xl font-bold text-primary">
                  {plan.name}
                </h3>
                <p className="text-sm text-primary/70">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-bold text-primary">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-primary/60">{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                    <span className="text-sm text-primary/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlighted ? 'secondary' : 'outline'}
                className="w-full"
              >
                {plan.price === 'Free' ? 'Get Started' : 'Choose Plan'}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="font-heading mb-8 text-center text-3xl font-bold text-primary">
            Pricing FAQs
          </h2>
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="font-heading mb-2 text-lg font-bold text-primary">
                Can I change plans later?
              </h3>
              <p className="text-primary/70">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                take effect immediately, and we'll prorate any charges.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="font-heading mb-2 text-lg font-bold text-primary">
                What payment methods do you accept?
              </h3>
              <p className="text-primary/70">
                We accept eSewa, credit/debit cards, and bank transfers for
                subscription payments.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="font-heading mb-2 text-lg font-bold text-primary">
                Is there a commission on sales?
              </h3>
              <p className="text-primary/70">
                No! We don't take any commission on your sales. You keep 100%
                of your earnings (minus payment gateway fees from eSewa).
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
