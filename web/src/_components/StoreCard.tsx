import { Profile } from '@/types/database'
import { getStorefrontUrl } from '@/utils/domainHelpers'
import { Store } from 'lucide-react'
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
    <Link
      href={storefrontUrl}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      {/* Profile Image / Banner */}
      <div className="relative aspect-square overflow-hidden bg-linear-to-br from-secondary/20 to-accent-2/20 sm:aspect-5/4">
        {profile.profile_image && isRemoteImage ? (
          <Image
            src={profile.profile_image}
            alt={profile.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Store className="h-16 w-16 text-secondary/40" />
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
      </div>

      {/* Store Info */}
      <div className="p-2.5 pb-3 sm:p-4">
        <h3 className="font-heading mb-1 text-sm font-bold text-primary sm:mb-2 sm:text-xl">
          {profile.name}
        </h3>

        {profile.store_username && (
          <div className="flex items-center gap-1 text-xs text-primary/60 sm:gap-1.5 sm:text-sm">
            <Store className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>@{profile.store_username}</span>
          </div>
        )}

        {profile.bio && (
          <p className="mt-1 line-clamp-2 text-xs text-primary/70 sm:mt-2 sm:text-sm">
            {profile.bio}
          </p>
        )}
      </div>
    </Link>
  )
}

export default StoreCard
