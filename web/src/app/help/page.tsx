'use client';

import PageLayout from '@/_components/common/PageLayout';
import Link from 'next/link';
import {
  Store,
  Package,
  CreditCard,
  Settings,
  Users,
  BarChart,
  ShoppingBag,
  HelpCircle,
} from 'lucide-react';

const helpTopics = [
  {
    icon: Store,
    title: 'Setting Up Your Store',
    description: 'Learn how to create and customize your thrift store',
    articles: [
      'Creating your account',
      'Choosing your subdomain',
      'Customizing your store profile',
      'Adding your first products',
    ],
  },
  {
    icon: Package,
    title: 'Managing Products',
    description: 'Everything about adding and organizing your inventory',
    articles: [
      'Adding product photos',
      'Writing product descriptions',
      'Setting prices and discounts',
      'Managing stock levels',
    ],
  },
  {
    icon: CreditCard,
    title: 'Payments & Pricing',
    description: 'Understanding transactions and payment processing',
    articles: [
      'Setting up eSewa integration',
      'Understanding transaction fees',
      'Processing refunds',
      'Managing payment disputes',
    ],
  },
  {
    icon: ShoppingBag,
    title: 'Orders & Shipping',
    description: 'Handle customer orders and shipping',
    articles: [
      'Managing incoming orders',
      'Communicating with customers',
      'Shipping best practices',
      'Handling returns',
    ],
  },
  {
    icon: BarChart,
    title: 'Analytics & Growth',
    description: 'Track performance and grow your business',
    articles: [
      'Understanding your dashboard',
      'Reading sales analytics',
      'Marketing your store',
      'Growing your customer base',
    ],
  },
  {
    icon: Settings,
    title: 'Account Settings',
    description: 'Manage your account and preferences',
    articles: [
      'Updating profile information',
      'Changing your password',
      'Notification settings',
      'Privacy controls',
    ],
  },
];

const popularQuestions = [
  'How do I get paid for my sales?',
  'Can I change my store subdomain?',
  'What are the seller fees?',
  'How do I handle international shipping?',
  'Can I run multiple stores?',
  'How do I contact customer support?',
];

export default function HelpCenterPage() {
  return (
    <PageLayout
      title="Help Center"
      description="Find guides, tutorials, and answers to help you succeed on ThriftVerse"
    >
      <div className="py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full rounded-lg border border-border bg-surface px-6 py-4 pr-12 text-primary transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 hover:text-secondary">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Help Topics Grid */}
        <div className="mb-16">
          <h2 className="font-heading mb-8 text-2xl font-bold text-primary">
            Browse by Topic
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {helpTopics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <div
                  key={index}
                  className="group rounded-xl border border-border bg-surface p-6 transition-all hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-secondary/10 p-3 transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-heading mb-2 text-xl font-bold text-primary">
                    {topic.title}
                  </h3>
                  <p className="mb-4 text-sm text-primary/70">
                    {topic.description}
                  </p>
                  <ul className="space-y-2">
                    {topic.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <a
                          href="#"
                          className="text-sm text-primary/60 transition-colors hover:text-secondary"
                        >
                          • {article}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Questions */}
        <div className="mb-16">
          <h2 className="font-heading mb-8 text-2xl font-bold text-primary">
            Popular Questions
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {popularQuestions.map((question, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition-all hover:border-secondary hover:shadow-md"
              >
                <HelpCircle className="h-5 w-5 shrink-0 text-secondary" />
                <span className="text-primary/80">{question}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/seller-guide"
            className="rounded-xl border border-border bg-gradient-to-br from-secondary/5 to-accent-2/5 p-6 text-center transition-all hover:shadow-lg"
          >
            <div className="mb-3 flex justify-center">
              <Users className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="font-heading mb-2 text-lg font-bold text-primary">
              Seller Guide
            </h3>
            <p className="text-sm text-primary/70">
              Complete guide to becoming a successful seller
            </p>
          </Link>

          <Link
            href="/faqs"
            className="rounded-xl border border-border bg-gradient-to-br from-accent-1/5 to-accent-2/5 p-6 text-center transition-all hover:shadow-lg"
          >
            <div className="mb-3 flex justify-center">
              <HelpCircle className="h-8 w-8 text-accent-1" />
            </div>
            <h3 className="font-heading mb-2 text-lg font-bold text-primary">
              FAQs
            </h3>
            <p className="text-sm text-primary/70">
              Frequently asked questions and answers
            </p>
          </Link>

          <Link
            href="/contact"
            className="rounded-xl border border-border bg-gradient-to-br from-accent-2/5 to-secondary/5 p-6 text-center transition-all hover:shadow-lg"
          >
            <div className="mb-3 flex justify-center">
              <svg
                className="h-8 w-8 text-accent-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-heading mb-2 text-lg font-bold text-primary">
              Contact Support
            </h3>
            <p className="text-sm text-primary/70">
              Get help from our support team
            </p>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
