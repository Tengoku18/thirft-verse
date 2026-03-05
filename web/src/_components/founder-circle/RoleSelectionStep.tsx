import { ArrowRight, Crown, Sparkles, Store } from 'lucide-react';

interface RoleSelectionStepProps {
  onSelect: (role: 'creator' | 'seller') => void;
}

const ROLE_CARDS = [
  {
    role: 'creator' as const,
    icon: <Sparkles className="h-5 w-5 text-fc-gold" />,
    title: 'Founding Creator',
    desc: "You're a creator or influencer who refers thrift sellers and earns referral rewards every sale.",
    cta: "I'm a Creator",
  },
  {
    role: 'seller' as const,
    icon: <Store className="h-5 w-5 text-fc-gold" />,
    title: 'Founding Seller',
    desc: 'You own or run a thrift store and want to open early with long-term operational benefits.',
    cta: "I'm a Seller",
  },
];

export default function RoleSelectionStep({ onSelect }: RoleSelectionStepProps) {
  return (
    <div className="relative z-10 flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-5 py-16">
      {/* Hero */}
      <div className="mb-14 text-center">
        <div
          className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{ border: '1px solid rgba(212,163,115,0.25)', background: 'rgba(212,163,115,0.08)' }}
        >
          <Crown className="h-3.5 w-3.5 text-fc-gold" />
          <span className="text-xs font-semibold tracking-[0.15em] text-fc-gold uppercase">
            Limited Spots Available
          </span>
        </div>

        <h1
          className="font-heading mb-5 text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
          style={{ background: 'var(--fc-gold-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
        >
          Founder Circle
        </h1>

        <p className="mx-auto max-w-md text-base leading-relaxed text-white/40 sm:text-lg">
          Be among the first to shape Thriftverse. Founding members receive
          exclusive benefits, permanent recognition, and lifetime perks.
        </p>
      </div>

      {/* Role cards */}
      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        {ROLE_CARDS.map((card) => (
          <button
            key={card.role}
            onClick={() => onSelect(card.role)}
            className="group relative flex cursor-pointer flex-col items-start overflow-hidden rounded-2xl p-7 text-left transition-all duration-300 focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.border = '1px solid rgba(212,163,115,0.45)';
              el.style.background = 'rgba(212,163,115,0.06)';
              el.style.boxShadow = '0 0 50px rgba(212,163,115,0.1), inset 0 0 30px rgba(212,163,115,0.04)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.border = '1px solid rgba(255,255,255,0.08)';
              el.style.background = 'rgba(255,255,255,0.03)';
              el.style.boxShadow = 'none';
            }}
          >
            {/* Corner glow on hover */}
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: 'radial-gradient(circle, rgba(212,163,115,0.35), transparent)' }}
            />
            <div
              className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: 'rgba(212,163,115,0.12)', border: '1px solid rgba(212,163,115,0.22)' }}
            >
              {card.icon}
            </div>
            <h2 className="font-heading mb-2 text-xl font-bold text-white">{card.title}</h2>
            <p className="mb-7 text-sm leading-relaxed text-white/40">{card.desc}</p>
            <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-fc-gold">
              <span>{card.cta}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-white/20">
        By applying you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
