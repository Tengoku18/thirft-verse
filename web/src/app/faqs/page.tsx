'use client';

import PageLayout from '@/_components/common/PageLayout';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const faqCategories = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'How do I create my thrift store on ThriftVerse?',
        answer:
          'Simply sign up for a free account, choose your unique subdomain (e.g., yourname.thriftverse.shop), and start adding products. The entire setup takes less than 10 minutes!',
      },
      {
        question: 'What is a subdomain and how does it work?',
        answer:
          'Your subdomain is your unique store URL on ThriftVerse. For example, if you choose "vintage", your store will be accessible at vintage.thriftverse.shop. This becomes your personal brand identity.',
      },
      {
        question: 'Is there a limit to how many products I can add?',
        answer:
          'On the free plan, you can add up to 10 products. Pro plan offers unlimited products. You can upgrade anytime as your business grows.',
      },
    ],
  },
  {
    category: 'Payments & Sales',
    questions: [
      {
        question: 'How do I receive payments from customers?',
        answer:
          'All payments are processed through eSewa, a secure payment gateway. When a customer makes a purchase, the payment goes directly to your eSewa account after platform fees are deducted.',
      },
      {
        question: 'What are the transaction fees?',
        answer:
          "ThriftVerse doesn't charge any commission on sales! You only pay standard eSewa payment gateway fees (typically 2-3% per transaction).",
      },
      {
        question: 'How long does it take to receive payments?',
        answer:
          'Payments are transferred to your eSewa account instantly after a successful transaction. You can then transfer funds to your bank account through eSewa.',
      },
    ],
  },
  {
    category: 'Store Management',
    questions: [
      {
        question: 'Can I customize how my store looks?',
        answer:
          'Yes! You can customize your store profile, add a bio, upload a profile picture, and organize your products. Pro users get additional customization options.',
      },
      {
        question: 'How do I manage my inventory?',
        answer:
          'You can easily add, edit, or remove products from your dashboard. Mark items as sold, update prices, and manage stock levels all in one place.',
      },
      {
        question: 'Can I share my store on social media?',
        answer:
          'Absolutely! Your unique subdomain link is perfect for sharing on Instagram, Facebook, TikTok, or anywhere else. Many sellers put it in their social media bios.',
      },
    ],
  },
  {
    category: 'Shipping & Orders',
    questions: [
      {
        question: 'How does shipping work?',
        answer:
          'You handle shipping directly with your customers. After a purchase, you receive the customer details and can arrange shipping through your preferred courier service.',
      },
      {
        question: 'Can customers track their orders?',
        answer:
          'Yes, you can provide tracking information to customers through the order management system. Customers receive updates via email.',
      },
      {
        question: 'What if a customer wants to return an item?',
        answer:
          'You set your own return policy for your store. We recommend clearly stating your policy on your store page to avoid confusion.',
      },
    ],
  },
  {
    category: 'Account & Security',
    questions: [
      {
        question: 'Is my data secure on ThriftVerse?',
        answer:
          'Yes! We use enterprise-grade security measures to protect your data. All transactions are encrypted and we never share your information with third parties.',
      },
      {
        question: 'Can I change my subdomain later?',
        answer:
          'Subdomain changes are limited to maintain brand consistency. Contact our support team if you need to change yours, and we can discuss options.',
      },
      {
        question: 'How do I delete my account?',
        answer:
          'You can delete your account anytime from your settings. Note that this action is permanent and will remove all your data from our platform.',
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-border bg-surface rounded-lg border transition-all hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left"
      >
        <h3 className="font-heading text-primary pr-4 text-lg font-semibold">
          {question}
        </h3>
        <ChevronDown
          className={`text-secondary h-5 w-5 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <p className="text-primary/70 px-6 pb-6 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQsPage() {
  return (
    <PageLayout
      title="Frequently Asked Questions"
      description="Find answers to common questions about ThriftVerse"
    >
      <div className="py-12">
        <div className="mx-auto max-w-4xl space-y-12">
          {faqCategories.map((category, index) => (
            <div key={index}>
              <h2 className="font-heading text-primary mb-6 text-2xl font-bold">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => (
                  <FAQItem
                    key={faqIndex}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="border-border bg-surface mt-16 rounded-2xl border p-8 text-center">
          <h2 className="font-heading text-primary mb-4 text-2xl font-bold">
            Still have questions?
          </h2>
          <p className="text-primary/70 mb-6">
            Our support team is here to help you succeed
          </p>
          <Link
            href="/contact"
            className="bg-secondary text-primary inline-block cursor-pointer rounded-lg px-6 py-3 font-semibold transition-all hover:scale-105 hover:shadow-lg"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
