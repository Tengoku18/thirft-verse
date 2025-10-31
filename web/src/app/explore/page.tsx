import { getProfiles } from '@/actions'
import { Store, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function ExplorePage() {
  // Fetch all profiles with role 'USER' (exclude ADMIN users)
  const { data: profiles } = await getProfiles({ role: 'USER' })

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="relative overflow-hidden border-b border-border/50 bg-linear-to-b from-secondary/10 via-accent-2/5 to-background shadow-sm">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-linear-to-br from-accent-1/20 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-linear-to-tr from-secondary/20 to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="text-center">
            <h1 className="font-heading mb-4 bg-linear-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
              Explore Thrift Stores
            </h1>
            <p className="mx-auto max-w-2xl text-base text-primary/70 sm:text-lg">
              Discover unique finds from amazing sellers across our community
            </p>
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {profiles.length === 0 ? (
          <div className="rounded-2xl bg-linear-to-br from-secondary/5 to-accent-2/5 py-16 text-center">
            <p className="text-base text-primary/60 sm:text-lg">
              No stores available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <Link
                key={profile.id}
                href={`http://${profile.store_username}.${process.env.NEXT_PUBLIC_DOMAINNAME}:3000`}
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
