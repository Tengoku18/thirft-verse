'use client';

import PageLayout from '@/_components/common/PageLayout';
import Link from 'next/link';
import { Quote, TrendingUp, Users, Package } from 'lucide-react';

const stories = [
  {
    name: 'Priya Sharma',
    handle: '@vintagebypriya',
    image: '👗',
    story:
      "I started with just 5 vintage sarees from my grandmother's collection. Within 3 months on ThriftVerse, I've sold over 150 items and turned my passion into a full-time business. The platform made it so easy to reach customers who truly appreciate sustainable fashion.",
    stats: {
      products: '200+',
      sales: 'Rs. 2.5L',
      customers: '180+',
    },
  },
  {
    name: 'Rajesh Kumar',
    handle: '@retrofindsrj',
    image: '📻',
    story:
      'As a collector of vintage electronics and music equipment, ThriftVerse gave me the perfect platform to share my finds. The eSewa integration made transactions seamless, and my unique subdomain became my brand identity on social media.',
    stats: {
      products: '120+',
      sales: 'Rs. 1.8L',
      customers: '95+',
    },
  },
  {
    name: 'Maya Thapa',
    handle: '@secondchancestyle',
    image: '👟',
    story:
      'I was skeptical about online thrift selling, but ThriftVerse changed everything. The platform is so user-friendly, and the analytics helped me understand what my customers love. I went from selling from my bedroom to running a successful sustainable fashion business!',
    stats: {
      products: '350+',
      sales: 'Rs. 4.2L',
      customers: '280+',
    },
  },
  {
    name: 'Arun Nepal',
    handle: '@bookwormthrifts',
    image: '📚',
    story:
      'Starting my rare book collection store on ThriftVerse was the best decision. The platform handles payments, I handle curation. My store has become the go-to place for book lovers looking for vintage and rare editions in Nepal.',
    stats: {
      products: '450+',
      sales: 'Rs. 3.1L',
      customers: '220+',
    },
  },
];

export default function SuccessStoriesPage() {
  return (
    <PageLayout
      title="Success Stories"
      description="Real stories from real sellers who are building thriving businesses on ThriftVerse"
    >
      <div className="py-12">
        {/* Stats Overview */}
        <div className="mb-16 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface p-6 text-center transition-all hover:shadow-lg">
            <div className="mb-2 flex justify-center">
              <div className="rounded-full bg-secondary/10 p-3">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <div className="font-heading text-3xl font-bold text-primary">
              Rs. 50L+
            </div>
            <div className="text-sm text-primary/60">Total Sales Volume</div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 text-center transition-all hover:shadow-lg">
            <div className="mb-2 flex justify-center">
              <div className="rounded-full bg-accent-2/10 p-3">
                <Users className="h-6 w-6 text-accent-2" />
              </div>
            </div>
            <div className="font-heading text-3xl font-bold text-primary">
              500+
            </div>
            <div className="text-sm text-primary/60">Active Sellers</div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 text-center transition-all hover:shadow-lg">
            <div className="mb-2 flex justify-center">
              <div className="rounded-full bg-accent-1/10 p-3">
                <Package className="h-6 w-6 text-accent-1" />
              </div>
            </div>
            <div className="font-heading text-3xl font-bold text-primary">
              10K+
            </div>
            <div className="text-sm text-primary/60">Items Sold</div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="space-y-12">
          {stories.map((story, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                {/* Avatar & Info */}
                <div className="flex items-center gap-4 lg:flex-col lg:items-center lg:text-center">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-accent-2 text-4xl">
                    {story.image}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-primary">
                      {story.name}
                    </h3>
                    <p className="text-sm text-secondary">{story.handle}</p>
                  </div>
                </div>

                {/* Story Content */}
                <div className="flex-1">
                  <Quote className="mb-4 h-8 w-8 text-secondary/30" />
                  <p className="mb-6 text-lg leading-relaxed text-primary/80">
                    {story.story}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-background p-4 text-center">
                      <div className="font-heading text-xl font-bold text-secondary">
                        {story.stats.products}
                      </div>
                      <div className="text-xs text-primary/60">Products</div>
                    </div>
                    <div className="rounded-lg bg-background p-4 text-center">
                      <div className="font-heading text-xl font-bold text-secondary">
                        {story.stats.sales}
                      </div>
                      <div className="text-xs text-primary/60">Total Sales</div>
                    </div>
                    <div className="rounded-lg bg-background p-4 text-center">
                      <div className="font-heading text-xl font-bold text-secondary">
                        {story.stats.customers}
                      </div>
                      <div className="text-xs text-primary/60">Customers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary to-accent-1 p-12 text-center">
          <h2 className="font-heading mb-4 text-3xl font-bold text-surface">
            Ready to Write Your Success Story?
          </h2>
          <p className="mb-8 text-surface/80">
            Join hundreds of sellers building sustainable businesses on
            ThriftVerse
          </p>
          <Link
            href="/start-selling"
            className="inline-block rounded-lg bg-secondary px-8 py-4 font-semibold text-primary transition-all hover:scale-105 hover:shadow-lg"
          >
            Start Your Store Today
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
