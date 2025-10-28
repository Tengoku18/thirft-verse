'use client';

import Button from '@/_components/common/Button';
import { Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background via-surface to-secondary/10">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-1/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8 lg:pt-40 lg:pb-32">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 shadow-md border border-border animate-bounce-slow">
            <Sparkles className="h-4 w-4 text-secondary animate-spin-slow" />
            <span className="text-sm font-semibold text-primary">
              Sustainable Shopping, Redefined
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-heading mb-6 text-5xl font-bold text-primary sm:text-6xl lg:text-7xl tracking-tight animate-fade-in">
            Your Thrift Store,
            <br />
            <span className="bg-gradient-to-r from-secondary via-accent-2 to-secondary bg-clip-text text-transparent animate-gradient">
              Your Rules
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-primary/70 sm:text-xl leading-relaxed animate-fade-in-delay">
            Create your own curated thrift store, connect with conscious
            shoppers, and turn your vintage treasures into a thriving online
            business. All with your unique storefront URL.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-delay-2">
            <Button size="lg" className="group">
              Start Your Store
              <svg
                className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
            <Button variant="outline" size="lg">
              Explore Stores
            </Button>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-8 border-t border-border pt-10">
            <div className="hover:scale-110 transition-transform duration-300">
              <div className="font-heading text-4xl font-bold text-secondary">
                500+
              </div>
              <div className="mt-1 text-sm text-primary/60">Active Stores</div>
            </div>
            <div className="hover:scale-110 transition-transform duration-300">
              <div className="font-heading text-4xl font-bold text-secondary">
                10K+
              </div>
              <div className="mt-1 text-sm text-primary/60">
                Items Sold
              </div>
            </div>
            <div className="hover:scale-110 transition-transform duration-300">
              <div className="font-heading text-4xl font-bold text-secondary">
                98%
              </div>
              <div className="mt-1 text-sm text-primary/60">
                Happy Sellers
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations in inline style */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
