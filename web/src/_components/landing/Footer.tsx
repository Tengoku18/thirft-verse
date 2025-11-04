'use client';

import Link from 'next/link';
import { Instagram, Facebook, Twitter, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-heading mb-4 text-2xl font-bold text-primary">
              ThriftVerse
            </h3>
            <p className="mb-6 text-sm text-primary/70 leading-relaxed">
              Empowering thrift entrepreneurs to build sustainable businesses,
              one vintage treasure at a time.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://instagram.com/thriftverse"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-primary transition-all duration-300 hover:bg-secondary hover:text-surface hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/thriftverse"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-primary transition-all duration-300 hover:bg-secondary hover:text-surface hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/thriftverse"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-primary transition-all duration-300 hover:bg-secondary hover:text-surface hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-heading mb-4 text-sm font-bold uppercase tracking-wider text-primary">
              Platform
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#features"
                  className="text-sm text-primary/70 transition-colors duration-200 hover:text-secondary"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-primary/70 transition-colors duration-200 hover:text-secondary"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-sm text-primary/70 transition-colors duration-200 hover:text-secondary"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/success-stories"
                  className="text-sm text-primary/70 transition-colors duration-200 hover:text-secondary"
                >
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading mb-4 text-sm font-bold uppercase tracking-wider text-primary">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/help"
                  className="text-sm text-primary/70 transition-colors duration-200 hover:text-secondary"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-primary/70 transition-colors duration-200 hover:text-secondary"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className="text-sm text-primary/70 transition-colors duration-200 hover:text-secondary"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/seller-guide"
                  className="text-sm text-primary/70 transition-colors duration-200 hover:text-secondary"
                >
                  Seller Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading mb-4 text-sm font-bold uppercase tracking-wider text-primary">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-primary/70 transition-colors duration-200 hover:text-secondary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-primary/70 transition-colors duration-200 hover:text-secondary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-primary/70 transition-colors duration-200 hover:text-secondary"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-primary/60">
              © {currentYear} ThriftVerse. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-sm text-primary/60">
              Made with{' '}
              <Heart className="h-4 w-4 text-accent-2 fill-accent-2 animate-pulse" />{' '}
              for sustainable fashion
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
