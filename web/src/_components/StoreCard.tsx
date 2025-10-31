import { Profile } from '@/types/database'
import { getStorefrontUrl } from '@/utils/domainHelpers'
import { Store, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface StoreCardProps {
  profile: Profile
}

const StoreCard = ({ profile }: StoreCardProps) => {
  const storefrontUrl = getStorefrontUrl(profile.store_username)

  return (
    <Link
      href={storefrontUrl}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      {/* Profile Image / Banner */}
      <div className="relative h-40 overflow-hidden bg-linear-to-br from-secondary/20 to-accent-2/20">
        {profile.profile_image ? (
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
      <div className="p-5">
        <h3 className="font-heading mb-2 text-xl font-bold text-primary">
          {profile.name}
        </h3>

        {profile.store_username && (
          <div className="mb-3 flex items-center gap-1.5 text-sm text-primary/60">
            <Store className="h-4 w-4" />
            <span>@{profile.store_username}</span>
          </div>
        )}

        {profile.bio && (
          <p className="mb-4 line-clamp-2 text-sm text-primary/70">
            {profile.bio}
          </p>
        )}

        {/* Visit Store Button */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-secondary">
            Visit Store
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 transition-colors group-hover:bg-secondary/20">
            <MapPin className="h-4 w-4 text-secondary" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default StoreCard
