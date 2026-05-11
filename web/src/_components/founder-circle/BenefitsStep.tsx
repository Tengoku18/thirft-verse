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
  { icon: <BadgeCheck className="h-5 w-5" />, title: 'Permanent Founder Badge', desc: 'Official Founder status and digital badge — marks you as a pioneer of the platform.' },
  { icon: <Sparkles className="h-5 w-5" />, title: 'No Verification Charge', desc: 'Gain full platform access and Verified Creator status without any setup or verification fees.' },
  { icon: <Crown className="h-5 w-5" />, title: 'Unique Referral Code', desc: 'Your own personalized referral link to build your creator empire and track your influence in real-time.' },
  { icon: <Star className="h-5 w-5" />, title: '20% Profit Share', desc: 'Earn 20% of the platform\'s profit for every successful sale made through your referral.' },
  { icon: <Trophy className="h-5 w-5" />, title: 'Monthly Cash Rewards', desc: 'Win Rs. 1,000–Rs. 2,000 monthly cash bonuses for top-performing curators on the leaderboard.' },
  { icon: <Store className="h-5 w-5" />, title: 'Priority Product Exposure', desc: 'Your recommended products get priority placement across the Thriftverse marketplace.' },
];

const SELLER_BENEFITS = [
  { icon: <BadgeCheck className="h-5 w-5" />, title: 'Permanent Founder Badge', desc: 'Prestigious digital seal prominently displayed on your storefront — forever.' },
  { icon: <Sparkles className="h-5 w-5" />, title: 'Zero Verification Fees', desc: 'Skip the professional setup costs and get verified as a premier seller at no charge during Phase 1.' },
  { icon: <Store className="h-5 w-5" />, title: 'Priority Marketplace Exposure', desc: 'Algorithm priority and featured placement across the platform to get your curated finds in front of more buyers.' },
  { icon: <Crown className="h-5 w-5" />, title: 'Order Protection', desc: 'Thriftverse handles the shipping costs for unreceived COD orders to protect your business from scams.' },
  { icon: <Star className="h-5 w-5" />, title: '2% Commission Discount', desc: 'Exclusive 2% reduction on platform commissions for your first 12 months.' },
];

export default function BenefitsStep({ role, onBack, onContinue }: BenefitsStepProps) {
  const benefits = role === 'creator' ? CREATOR_BENEFITS : SELLER_BENEFITS;

  return (
    <div className="relative z-10 flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-lg">
        <button
          onClick={onBack}
          className="mb-8 flex cursor-pointer items-center gap-2 text-sm text-white/30 transition-colors hover:text-white/60"
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
          className="group relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-base font-semibold text-fc-bg transition-all duration-300"
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
