import { Profile } from '@/types/database';
import {
  formatMemberSince,
  formatStoreUrl,
  getStoreInitials,
} from '@/utils/storeHelpers';
import { pluralize } from '@/utils/textHelpers';
import { BadgeCheck, Crown, MapPin, PackageCheck } from 'lucide-react';
import Image from 'next/image';
import StoreShareActions from './StoreShareActions';

interface StoreHeroProps {
  profile: Profile;
  productCount: number;
}

const StoreHero = ({ profile, productCount }: StoreHeroProps) => {
  const storeUrl = formatStoreUrl(profile.store_username);
  const memberSince = formatMemberSince(profile.created_at);

  return (
    <section className="relative bg-surface">
      {/* Subtle warm wash – no loud orbs */}
      <div
        aria-hidden
        className="from-secondary/8 to-background pointer-events-none absolute inset-0 bg-linear-to-b via-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-secondary/50 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-4 pt-8 pb-10 sm:px-6 sm:pt-14 sm:pb-16 lg:px-8">
        {/* Eyebrow: storefront label + @handle */}
        <div className="mb-6 flex items-center justify-between gap-3 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <span
              aria-hidden
              className="bg-primary/40 h-px w-6 sm:w-12"
            />
            <span className="text-primary/60 font-sans text-[10px] font-semibold tracking-[0.22em] uppercase sm:text-[11px]">
              Storefront
            </span>
          </div>
          <span className="text-primary/60 max-w-[55%] truncate font-sans text-xs tracking-wide sm:text-sm">
            @{profile.store_username}
          </span>
        </div>

        <div className="grid gap-6 sm:gap-10 md:grid-cols-[auto_1fr] md:items-end">
          {/* Avatar column */}
          <div className="relative mx-auto md:mx-0">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border border-border/70 bg-background shadow-[0_10px_40px_-12px_rgba(59,47,47,0.25)] sm:h-44 sm:w-44">
              {profile.profile_image ? (
                <Image
                  src={profile.profile_image}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 112px, 176px"
                  priority
                />
              ) : (
                <div className="from-accent-2 to-secondary flex h-full w-full items-center justify-center bg-linear-to-br">
                  <span className="font-heading text-surface text-4xl font-bold sm:text-5xl">
                    {getStoreInitials(profile.name)}
                  </span>
                </div>
              )}
            </div>

            {/* Founder ribbon – quiet, not shimmering */}
            {profile.is_founder && (
              <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-amber-400/60 bg-amber-50 px-2.5 py-0.5 shadow-sm sm:gap-1.5 sm:px-3 sm:py-1">
                <Crown
                  className="h-3 w-3 text-amber-600 sm:h-3.5 sm:w-3.5"
                  strokeWidth={2.5}
                />
                <span className="font-sans text-[9px] font-bold tracking-[0.12em] text-amber-800 uppercase sm:text-[10px]">
                  Founder
                </span>
              </div>
            )}
          </div>

          {/* Content column */}
          <div className="flex flex-col gap-4 text-center sm:gap-5 md:text-left">
            <div>
              <h1 className="font-heading text-primary inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[28px] leading-[1.1] font-bold tracking-tight sm:text-5xl md:justify-start md:text-[56px]">
                <span className="break-words">{profile.name}</span>
                {profile.is_verified && (
                  <BadgeCheck
                    className="h-5 w-5 shrink-0 fill-blue-500 text-white sm:h-8 sm:w-8"
                    aria-label="Verified store"
                  />
                )}
              </h1>
            </div>

            {profile.bio && (
              <p className="text-primary/75 mx-auto max-w-2xl font-sans text-sm leading-relaxed sm:text-base md:mx-0">
                {profile.bio}
              </p>
            )}

            {/* Typographic meta row */}
            <dl className="text-primary/65 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-sans text-[10px] font-semibold tracking-[0.12em] uppercase sm:gap-x-5 sm:text-[11px] sm:tracking-[0.14em] md:justify-start">
              <div className="flex items-center gap-1.5">
                <PackageCheck className="h-3.5 w-3.5" strokeWidth={2} />
                <dt className="sr-only">Items listed</dt>
                <dd>
                  <span className="text-primary">{productCount}</span>{' '}
                  {pluralize(productCount, 'item')}
                </dd>
              </div>

              {profile.address && (
                <>
                  <span aria-hidden className="text-primary/30">
                    •
                  </span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                    <dt className="sr-only">Location</dt>
                    <dd className="max-w-[10rem] truncate">
                      {profile.address}
                    </dd>
                  </div>
                </>
              )}

              {memberSince && (
                <>
                  <span aria-hidden className="text-primary/30">
                    •
                  </span>
                  <div className="flex items-center gap-1.5">
                    <dt className="sr-only">Member since</dt>
                    <dd>Since {memberSince}</dd>
                  </div>
                </>
              )}
            </dl>

            {/* Share / copy actions */}
            <div className="flex w-full flex-wrap items-center justify-center gap-2 pt-1 sm:gap-3 md:justify-start">
              <StoreShareActions
                storeName={profile.name}
                storeUrl={storeUrl}
                bio={profile.bio}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreHero;
