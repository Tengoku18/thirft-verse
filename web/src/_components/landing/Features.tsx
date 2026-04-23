'use client';

import {
  ArrowUpRight,
  CreditCard,
  Globe,
  PercentSquare,
  Printer,
  Smartphone,
  Truck,
} from 'lucide-react';

/**
 * Bento-style feature grid.
 * Tile sizing tuned so the grid feels editorial, not uniform — the "your subdomain"
 * and "shipping" tiles are the hero stories and get larger canvases.
 */
export default function Features() {
  return (
    <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      {/* Section header */}
      <div className="mx-auto mb-14 max-w-2xl text-center lg:mb-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/70 px-3 py-1 font-sans text-[11px] font-bold tracking-[0.22em] text-primary/65 uppercase backdrop-blur-sm">
          Why Thriftverse
        </span>
        <h2 className="font-heading mt-5 text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          A boutique storefront, <span className="italic font-medium">without the boutique overhead.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-primary/70 sm:text-lg">
          Everything a modern thrift seller needs — your own address on the internet,
          checkout, and shipping — handled. You curate. We carry the rest.
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-6 sm:gap-5 lg:grid-cols-12">
        {/* Tile 1 — Your Subdomain (large) */}
        <FeatureTile
          className="sm:col-span-6 lg:col-span-7 lg:row-span-2"
          icon={Globe}
          tint="from-secondary/15 to-accent-2/10"
          ring="ring-secondary/20"
        >
          <FeatureCopy
            tag="Your address"
            title="Your name, on the internet."
            body="Pick a username in our mobile app and you instantly own yourname.thriftverse.shop — paste it in your Instagram or TikTok bio and start selling that same afternoon."
          />
          {/* Browser-frame preview */}
          <div className="relative mt-6 overflow-hidden rounded-2xl border border-border/60 bg-background shadow-[0_20px_40px_-24px_rgba(59,47,47,0.3)]">
            <div className="flex items-center gap-1.5 border-b border-border/60 bg-surface/70 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-accent-2/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-secondary/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent-1/60" />
              <span className="ml-3 flex-1 truncate rounded-md bg-background/80 px-2.5 py-1 font-mono text-[11px] text-primary/70">
                <span className="text-primary/40">https://</span>
                <span className="text-primary/85 font-semibold">aastha</span>
                <span className="text-primary/40">.thriftverse.shop</span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3">
              {['F2E5D3', 'D4A373', 'CB997E'].map((bg, i) => (
                <div
                  key={bg}
                  className="aspect-square animate-fade-up rounded-xl"
                  style={{
                    backgroundImage: `linear-gradient(135deg, #${bg} 0%, #EFE5D8 100%)`,
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </FeatureTile>

        {/* Tile 2 — Mobile seller app */}
        <FeatureTile
          className="sm:col-span-3 lg:col-span-5"
          icon={Smartphone}
          tint="from-accent-1/15 to-accent-1/5"
          ring="ring-accent-1/20"
        >
          <FeatureCopy
            tag="Seller app"
            title="Run it from your pocket."
            body="Sign up, list, price, and restock from our iOS & Android app. Web is for shoppers — sellers get a tool built for one-handed use."
          />
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary/70">
            <span className="rounded-full border border-border/60 bg-surface px-2.5 py-1">iOS</span>
            <span className="rounded-full border border-border/60 bg-surface px-2.5 py-1">Android</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-secondary" strokeWidth={2.4} />
          </div>
        </FeatureTile>

        {/* Tile 3 — NCM Shipping */}
        <FeatureTile
          className="sm:col-span-3 lg:col-span-5"
          icon={Truck}
          tint="from-accent-2/15 to-secondary/10"
          ring="ring-accent-2/25"
        >
          <FeatureCopy
            tag="Door to door"
            title="NCM moves every order."
            body="When an order drops, we generate the label. You drop at the nearest Nepal Can Move branch — we track and notify the buyer until it lands."
          />
          <div className="mt-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary/60">
            <span className="flex items-center gap-1">
              <span className="bg-accent-1 h-1.5 w-1.5 rounded-full" />
              Picked
            </span>
            <span className="h-px flex-1 bg-border" />
            <span className="flex items-center gap-1">
              <span className="bg-secondary h-1.5 w-1.5 rounded-full animate-soft-pulse" />
              In transit
            </span>
            <span className="h-px flex-1 bg-border" />
            <span className="flex items-center gap-1">
              <span className="bg-accent-2/50 h-1.5 w-1.5 rounded-full" />
              Delivered
            </span>
          </div>
        </FeatureTile>

        {/* Tile 4 — eSewa */}
        <FeatureTile
          className="sm:col-span-3 lg:col-span-4"
          icon={CreditCard}
          tint="from-secondary/12 to-background"
          ring="ring-secondary/20"
        >
          <FeatureCopy
            tag="Checkout"
            title="eSewa. That's it."
            body="Your customers pay with the wallet they already use. Funds settle to your account automatically."
          />
        </FeatureTile>

        {/* Tile 5 — Commission */}
        <FeatureTile
          className="sm:col-span-3 lg:col-span-4"
          icon={PercentSquare}
          tint="from-primary/10 to-accent-1/10"
          ring="ring-primary/15"
        >
          <FeatureCopy
            tag="Pricing"
            title="Zero to start."
            body="No listing fees, no monthly subscription. A small commission only when you earn — we win when you win."
          />
        </FeatureTile>

        {/* Tile 6 — Shipping label */}
        <FeatureTile
          className="sm:col-span-6 lg:col-span-4"
          icon={Printer}
          tint="from-accent-1/12 to-surface"
          ring="ring-accent-1/20"
        >
          <FeatureCopy
            tag="One-tap label"
            title="We print, you tape."
            body="Every order ships with a ready-to-print label that carries everything NCM needs — recipient, order ref, branch. Optional, but most sellers use it."
          />
          <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary/60">
            <span className="rounded-full border border-border/60 bg-surface px-2.5 py-1">Order info</span>
            <span className="rounded-full border border-border/60 bg-surface px-2.5 py-1">Sender + receiver</span>
            <span className="rounded-full border border-border/60 bg-surface px-2.5 py-1">NCM-ready</span>
          </div>
        </FeatureTile>
      </div>
    </div>
  );
}

/* ── Subcomponents ── */

function FeatureTile({
  children,
  className = '',
  icon: Icon,
  tint,
  ring,
}: {
  children: React.ReactNode;
  className?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tint: string;
  ring: string;
}) {
  return (
    <div
      className={`group animate-fade-up relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-surface p-6 shadow-[0_10px_30px_-22px_rgba(59,47,47,0.25)] ring-1 ring-inset ${ring} transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_50px_-22px_rgba(59,47,47,0.35)] sm:p-7 ${className}`}
    >
      {/* Tinted corner glow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-br ${tint} opacity-80 blur-3xl transition-opacity duration-700 group-hover:opacity-100`}
      />
      <div className="relative z-10 mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-surface text-primary shadow-sm transition-transform duration-500 group-hover:-rotate-6">
        <Icon className="h-5 w-5 text-secondary" strokeWidth={2.2} />
      </div>
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
}

function FeatureCopy({ tag, title, body }: { tag: string; title: string; body: string }) {
  return (
    <>
      <p className="font-sans text-[10px] font-bold tracking-[0.22em] text-primary/55 uppercase">
        {tag}
      </p>
      <h3 className="font-heading mt-2 text-2xl font-bold leading-tight tracking-tight text-primary">
        {title}
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-primary/70">{body}</p>
    </>
  );
}
