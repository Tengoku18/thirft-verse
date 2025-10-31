import { getProfiles } from '@/actions'
import StoreCard from '@/_components/StoreCard'

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
              <StoreCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
