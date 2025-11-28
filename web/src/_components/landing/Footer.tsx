'use client';

import { appConfig } from '@/config/appConfig';
import { Facebook, Heart, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border bg-surface border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-heading text-primary mb-4 text-2xl font-bold">
              ThriftVerse
            </h3>
            <p className="text-primary/70 mb-6 text-sm leading-relaxed">
              Empowering thrift entrepreneurs to build sustainable businesses,
              one vintage treasure at a time.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://instagram.com/thriftverse"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary/5 text-primary hover:bg-secondary hover:text-surface flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/thriftverse"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary/5 text-primary hover:bg-secondary hover:text-surface flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/thriftverse"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary/5 text-primary hover:bg-secondary hover:text-surface flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-heading text-primary mb-4 text-sm font-bold tracking-wider uppercase">
              Platform
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#features"
                  className="text-primary/70 hover:text-secondary text-sm transition-colors duration-200"
                >
                  Features
                </Link>
              </li>
              {appConfig.showPricing && (
                <li>
                  <Link
                    href="/pricing"
                    className="text-primary/70 hover:text-secondary text-sm transition-colors duration-200"
                  >
                    Pricing
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-primary/70 hover:text-secondary text-sm transition-colors duration-200"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/success-stories"
                  className="text-primary/70 hover:text-secondary text-sm transition-colors duration-200"
                >
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading text-primary mb-4 text-sm font-bold tracking-wider uppercase">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-primary/70 hover:text-secondary text-sm transition-colors duration-200"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-primary/70 hover:text-secondary text-sm transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className="text-primary/70 hover:text-secondary text-sm transition-colors duration-200"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/seller-guide"
                  className="text-primary/70 hover:text-secondary text-sm transition-colors duration-200"
                >
                  Seller Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading text-primary mb-4 text-sm font-bold tracking-wider uppercase">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-primary/70 hover:text-secondary text-sm transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-primary/70 hover:text-secondary text-sm transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-primary/70 hover:text-secondary text-sm transition-colors duration-200"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-border mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-primary/60 text-sm">
              © {currentYear} ThriftVerse. All rights reserved.
            </p>
            <p className="text-primary/60 flex items-center gap-1 text-sm">
              Made with{' '}
              <Heart className="text-accent-2 fill-accent-2 h-4 w-4 animate-pulse" />{' '}
              for sustainable fashion
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
