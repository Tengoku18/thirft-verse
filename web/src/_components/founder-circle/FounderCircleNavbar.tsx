import { Crown } from 'lucide-react';

export default function FounderCircleNavbar() {
  return (
    <header className="relative z-50 flex h-16 items-center justify-center px-5 sm:px-8">
      <div className="flex items-center gap-3">
        <span
          className="font-heading text-2xl font-bold tracking-wide"
          style={{ background: 'var(--fc-gold-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
        >
          Thriftverse
        </span>
        <div className="hidden h-4 w-px bg-white/15 sm:block" />
        <span className="hidden items-center gap-1.5 rounded-full border border-fc-gold/30 bg-fc-gold/10 px-3 py-1 text-xs font-semibold tracking-wider text-fc-gold sm:inline-flex">
          <Crown className="h-3 w-3" />
          FOUNDER CIRCLE
        </span>
      </div>
    </header>
  );
}
