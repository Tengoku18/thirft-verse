import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Crown,
  Sparkles,
  Star,
  Store,
  Trophy,
} from 'lucide-react';

interface BenefitsStepProps {
  role: 'creator' | 'seller';
  onBack: () => void;
  onContinue: () => void;
}

const CREATOR_BENEFITS = [
  { icon: <BadgeCheck className="h-5 w-5" />, title: 'Permanent Founder Badge', desc: 'Exclusive badge on your profile — forever.' },
  { icon: <Star className="h-5 w-5" />, title: 'Rs. 50 per Sale Referral', desc: 'Earn Rs. 50 for every sale made by sellers you refer, for 6 months.' },
  { icon: <Crown className="h-5 w-5" />, title: 'Unique Referral Code', desc: 'Share your code with up to 6 sellers — choose your circle wisely.' },
  { icon: <Trophy className="h-5 w-5" />, title: 'Monthly Cash Rewards', desc: 'Top 3 creators each month win cash or product prizes.' },
  { icon: <Sparkles className="h-5 w-5" />, title: 'Featured Visibility', desc: 'Get showcased on the leaderboard and featured creator section.' },
];

const SELLER_BENEFITS = [
  { icon: <BadgeCheck className="h-5 w-5" />, title: 'Permanent Founder Badge', desc: 'Exclusive Founder badge on your store — forever.' },
  { icon: <Star className="h-5 w-5" />, title: 'Extra 2% Commission Discount', desc: 'Reduced platform commission for your first 12 months.' },
  { icon: <Store className="h-5 w-5" />, title: 'Priority Marketplace Exposure', desc: 'Your verified store is shown first on the marketplace.' },
  { icon: <Crown className="h-5 w-5" />, title: 'Early Access to Campaigns', desc: 'Receive news about marketing campaigns 3 days before anyone else.' },
];

export default function BenefitsStep({ role, onBack, onContinue }: BenefitsStepProps) {
  const benefits = role === 'creator' ? CREATOR_BENEFITS : SELLER_BENEFITS;

  return (
    <div className="relative z-10 flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-lg">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-sm text-white/30 transition-colors hover:text-white/60"
        >
          <ArrowLeft className="h-4 w-4" />
          Change role
        </button>

        {/* Role badge */}
        <div
          className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1"
          style={{ border: '1px solid rgba(212,163,115,0.3)', background: 'rgba(212,163,115,0.1)' }}
        >
          {role === 'creator' ? (
            <Sparkles className="h-3.5 w-3.5 text-fc-gold" />
          ) : (
            <Store className="h-3.5 w-3.5 text-fc-gold" />
          )}
          <span className="text-xs font-semibold tracking-wider text-fc-gold uppercase">
            Founding {role === 'creator' ? 'Creator' : 'Seller'}
          </span>
        </div>

        <h2
          className="font-heading mb-2 text-3xl font-bold sm:text-4xl"
          style={{ background: 'var(--fc-gold-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
        >
          Your exclusive benefits
        </h2>
        <p className="mb-8 text-sm text-white/40">
          As a founding member, these perks are permanently yours.
        </p>

        <ul className="mb-10 space-y-3">
          {benefits.map((benefit, i) => (
            <li
              key={i}
              className="flex items-start gap-4 rounded-xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-fc-gold"
                style={{ background: 'rgba(212,163,115,0.12)', border: '1px solid rgba(212,163,115,0.2)' }}
              >
                {benefit.icon}
              </div>
              <div>
                <p className="font-semibold text-white/90">{benefit.title}</p>
                <p className="mt-0.5 text-sm text-white/40">{benefit.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={onContinue}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-base font-semibold text-fc-bg transition-all duration-300"
          style={{ background: 'var(--fc-button-gradient)', boxShadow: 'var(--fc-gold-glow)' }}
        >
          <span className="relative z-10">Claim My Founding Spot</span>
          <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          <div className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
        </button>
      </div>
    </div>
  );
}
