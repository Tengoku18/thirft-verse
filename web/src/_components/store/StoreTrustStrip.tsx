import { Mail, ShieldCheck, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TrustItem {
  icon: LucideIcon;
  label: string;
  detail: string;
}

const items: TrustItem[] = [
  {
    icon: ShieldCheck,
    label: 'Secure checkout',
    detail: 'Powered by eSewa',
  },
  {
    icon: Truck,
    label: 'Nationwide delivery',
    detail: 'Handled by NCM',
  },
  {
    icon: Mail,
    label: 'Order updates',
    detail: 'Email confirmation & tracking',
  },
];

const StoreTrustStrip = () => {
  return (
    <section
      aria-label="Thriftverse buyer protections"
      className="bg-background"
    >
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-5 lg:px-8">
        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-6">
          {items.map(({ icon: Icon, label, detail }) => (
            <li
              key={label}
              className="flex items-center gap-3 text-left"
            >
              <span className="border-border/70 bg-surface text-primary/80 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border sm:h-9 sm:w-9">
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <p className="text-primary font-sans text-[13px] font-semibold leading-tight sm:text-sm">
                  {label}
                </p>
                <p className="text-primary/60 font-sans text-[11px] leading-tight sm:text-xs">
                  {detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default StoreTrustStrip;
