'use client'

import { Profile } from '@/types/database'
import { getStorefrontUrl } from '@/utils/domainHelpers'
import { BadgeCheck, Store } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface StoreCardProps {
  profile: Profile
}

const StoreCard = ({ profile }: StoreCardProps) => {
  const storefrontUrl = getStorefrontUrl(profile.store_username)
  const isRemoteImage =
    profile.profile_image?.startsWith('http://') ||
    profile.profile_image?.startsWith('https://')

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-md sm:rounded-2xl">
        {/* Image */}
        <Link
          href={storefrontUrl}
          className="relative block aspect-square overflow-hidden bg-white sm:aspect-[5/4]"
        >
          {profile.profile_image && isRemoteImage ? (
            <Image
              src={profile.profile_image}
              alt={profile.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Store className="h-16 w-16 text-secondary/40" />
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="space-y-2.5 p-2.5 sm:space-y-3 sm:p-4">
          <Link href={storefrontUrl}>
            <div className="flex items-center gap-1">
              <h3 className="truncate text-sm leading-tight font-semibold text-neutral-900 transition-colors group-hover:text-[#D4A373] sm:text-base">
                {profile.name}
              </h3>
              {profile.is_verified && (
                <BadgeCheck className="h-4 w-4 shrink-0 fill-blue-500 text-white sm:h-5 sm:w-5" />
              )}
            </div>
          </Link>

          {profile.store_username && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 sm:text-sm">
              <Store className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">@{profile.store_username}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StoreCard
