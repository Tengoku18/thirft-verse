import Header from '@/_components/common/Header';
import Footer from '@/_components/landing/Footer';
import { blogs } from '@/data/blogs';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog | ThriftVerse',
  description:
    'Guides, tips, and updates for ThriftVerse sellers and buyers. Learn how to grow your thrift store and make the most of the platform.',
};

export default function BlogsPage() {
  return (
    <div className="bg-background min-h-screen">
      <Header />

      {/* Hero */}
      <div className="from-background via-surface to-secondary/10 relative overflow-hidden bg-linear-to-br pt-16 md:pt-20">
        <div className="absolute inset-0 opacity-20">
          <div className="bg-secondary/30 absolute top-20 right-10 h-72 w-72 rounded-full blur-3xl" />
          <div className="bg-accent-1/20 absolute bottom-10 left-10 h-96 w-96 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
          <div className="text-center">
            <div className="bg-secondary/10 border-secondary/20 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2">
              <BookOpen className="text-secondary h-4 w-4" />
              <span className="text-primary text-sm font-semibold">
                ThriftVerse Blog
              </span>
            </div>

            <h1 className="font-heading text-primary mb-4 text-4xl font-bold sm:text-5xl">
              Guides & Updates
            </h1>
            <p className="text-primary/70 mx-auto max-w-xl text-lg">
              Everything you need to know to run your thrift store like a pro —
              from handling orders to growing your store.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
        {blogs.length === 0 ? (
          <p className="text-primary/60 text-center">
            No posts yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Link
                key={blog.slug}
                href={`/blogs/${blog.slug}`}
                className="group border-border/50 bg-surface hover:border-secondary/40 flex flex-col rounded-2xl border p-8 transition-all hover:shadow-xl"
              >
                {/* Cover emoji */}
                <div className="bg-secondary/10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl">
                  {blog.coverEmoji}
                </div>

                {/* Category */}
                <span className="bg-secondary/10 text-secondary mb-3 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold">
                  {blog.category}
                </span>

                {/* Title */}
                <h2 className="font-heading text-primary group-hover:text-secondary mb-3 text-xl leading-snug font-bold transition-colors">
                  {blog.title}
                </h2>

                {/* Excerpt */}
                <p className="text-primary/70 flex-1 text-sm leading-relaxed">
                  {blog.excerpt}
                </p>

                {/* Footer meta */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-primary/50 flex items-center gap-1 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{blog.readTime}</span>
                  </div>
                  <span className="text-secondary flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2">
                    Read more <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
