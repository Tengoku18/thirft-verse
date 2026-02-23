import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Download,
  ExternalLink,
  ArrowLeftRight,
} from 'lucide-react';
import Image from 'next/image';
import Header from '@/_components/common/Header';
import Footer from '@/_components/landing/Footer';
import { blogs, getBlogBySlug } from '@/data/blogs';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) return {};
  return {
    title: `${blog.title} | Thriftverse Blog`,
    description: blog.excerpt,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) notFound();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-surface to-secondary/10 border-b border-border/50 pt-16 md:pt-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-72 h-72 bg-secondary/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-accent-1/20 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-primary/50">
            <Link href="/blogs" className="hover:text-secondary transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-primary/80 truncate">{blog.title}</span>
          </div>

          {/* Category */}
          <span className="mb-4 inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
            {blog.category}
          </span>

          {/* Cover emoji + title */}
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 hidden sm:flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary/10 text-4xl">
              {blog.coverEmoji}
            </div>
            <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl lg:text-5xl leading-tight">
              {blog.title}
            </h1>
          </div>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-primary/60">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {blog.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {blog.publishedAt}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {blog.readTime}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        {/* Intro */}
        <p className="text-lg text-primary/80 leading-relaxed mb-12 border-l-4 border-secondary/50 pl-6">
          {blog.intro}
        </p>

        {/* Steps */}
        <div className="space-y-8">
          {blog.steps.map((step, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border/50 bg-surface p-6 sm:p-8 transition-all hover:shadow-md"
            >
              {/* Step header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-secondary">{index + 1}</span>
                </div>
                <h2 className="font-heading text-xl font-bold text-primary pt-1.5">
                  {step.title}
                </h2>
              </div>

              {/* Description — handle newlines */}
              <div className="pl-14 space-y-2">
                {step.description.split('\n\n').map((para, i) => {
                  if (para.startsWith('•')) {
                    // bullet list block
                    return (
                      <ul key={i} className="space-y-1.5 mt-2">
                        {para.split('\n').map((line, j) => (
                          <li key={j} className="flex items-start gap-2 text-primary/80">
                            <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                            <span>{line.replace(/^•\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={i} className="text-primary/75 leading-relaxed">
                      {para}
                    </p>
                  );
                })}

                {/* Highlight callout */}
                {step.highlight && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl bg-secondary/10 border border-secondary/20 px-4 py-3">
                    <AlertCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-primary/80">{step.highlight}</p>
                  </div>
                )}

                {/* Tip callout */}
                {step.tip && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl bg-accent-1/10 border border-accent-1/20 px-4 py-3">
                    <Lightbulb className="h-5 w-5 text-accent-1 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-primary/70">
                      <span className="font-semibold text-accent-1">Tip: </span>
                      {step.tip}
                    </p>
                  </div>
                )}

                {/* Alternative approach */}
                {step.alternative && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl bg-surface border border-border/60 px-4 py-3">
                    <ArrowLeftRight className="h-5 w-5 text-primary/40 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-primary/70">
                      <span className="font-semibold text-primary/80">Or: </span>
                      {step.alternative}
                    </p>
                  </div>
                )}

                {/* Shipping label preview + download */}
                {step.labelUrl && (
                  <div className="mt-4 rounded-xl border border-border/50 bg-background overflow-hidden">
                    <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-primary">Shipping Label Preview</span>
                      <div className="flex items-center gap-2">
                        <a
                          href={step.labelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface px-3 py-1.5 text-xs font-medium text-primary/70 hover:text-primary hover:border-secondary/50 transition-all"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View
                        </a>
                        <a
                          href={step.labelUrl}
                          download
                          className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/10 border border-secondary/20 px-3 py-1.5 text-xs font-medium text-secondary hover:bg-secondary/20 transition-all"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </a>
                      </div>
                    </div>
                    <div className="p-3">
                      <Image
                        src={step.labelUrl}
                        alt="Thriftverse Shipping Label"
                        width={800}
                        height={400}
                        className="w-full rounded-lg object-contain max-h-64"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Conclusion */}
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-secondary/10 to-accent-2/10 border border-secondary/20 p-8">
          <h3 className="font-heading text-xl font-bold text-primary mb-3">
            🎉 You&apos;re all set!
          </h3>
          <p className="text-primary/75 leading-relaxed">{blog.conclusion}</p>
        </div>

        {/* Back to blogs */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:gap-3 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all posts
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
