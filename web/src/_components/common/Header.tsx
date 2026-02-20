'use client';

import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Button from './Button';

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  //TODO: Enable pricing page after proper planning
  // { label: 'Pricing', href: '/pricing' },
  { label: 'Success Stories', href: '/success-stories' },
  { label: 'Blog', href: '/blogs' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface border-border border-b shadow-md lg:bg-surface/95 lg:backdrop-blur-md'
          : 'bg-surface border-b border-border/40 lg:bg-transparent lg:border-transparent lg:shadow-none'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-start gap-2 transition-transform hover:scale-105"
          >
            <Image
              src="/images/horizontal-logo.png"
              alt="ThriftVerse Logo"
              height={50}
              width={180}
              className="object-contain p-1"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-primary/70 hover:text-primary group relative font-sans text-sm font-medium transition-colors"
              >
                {link.label}
                <span className="bg-secondary absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden items-center gap-4 lg:flex">
            <Link href="/start-selling">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="hover:bg-secondary/10 rounded-lg p-2 transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="text-primary h-6 w-6" />
            ) : (
              <Menu className="text-primary h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 top-16 transition-all duration-300 md:top-20 lg:hidden ${
          isMobileMenuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      >
        {/* Backdrop */}
        <div
          className="bg-primary/20 absolute inset-0 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`bg-surface border-border relative border-b shadow-xl transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="space-y-4 px-4 py-6">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-primary/70 hover:text-primary hover:bg-background block rounded-lg px-4 py-3 font-sans text-base font-medium transition-all"
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile CTA Buttons */}
            <div className="border-border space-y-3 border-t pt-4">
              <Link
                href="/start-selling"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block"
              >
                <Button size="md" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
