export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex w-full max-w-4xl flex-col items-center gap-12 px-6 py-16">
        <div className="text-center">
          <h1 className="mb-4 font-heading text-5xl font-bold text-primary md:text-6xl">
            ThriftVerse
          </h1>
          <p className="text-xl text-primary/80">
            Discover unique vintage and thrift finds
          </p>
        </div>

        <div className="grid w-full gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface p-6 shadow-sm transition-all hover:shadow-md">
            <h2 className="mb-2 font-heading text-2xl font-semibold text-primary">
              Vintage
            </h2>
            <p className="text-muted">
              Curated collection of timeless vintage pieces
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6 shadow-sm transition-all hover:shadow-md">
            <h2 className="mb-2 font-heading text-2xl font-semibold text-primary">
              Sustainable
            </h2>
            <p className="text-muted">
              Eco-friendly shopping for a better tomorrow
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6 shadow-sm transition-all hover:shadow-md">
            <h2 className="mb-2 font-heading text-2xl font-semibold text-primary">
              Unique
            </h2>
            <p className="text-muted">
              One-of-a-kind items you won't find anywhere else
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="rounded-lg bg-primary px-8 py-3 font-medium text-surface transition-colors hover:bg-primary/90">
            Explore Collection
          </button>
          <button className="rounded-lg border border-border bg-surface px-8 py-3 font-medium text-primary transition-colors hover:bg-secondary/10">
            Learn More
          </button>
        </div>
      </main>
    </div>
  );
}
