import LandingPage from '@/_components/landing/LandingPage';
import { SITE_KEYWORDS } from '@/lib/seo/site';
import { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Thriftverse — Your Finds. Your Store. Your Story.',
  description:
    'Create your own thrift store and give every item a second life. Thriftverse is the home of independent online thrift sellers, preloved fashion, and sustainable shopping.',
  keywords: [
    ...SITE_KEYWORDS,
    // Seller-side intent for the landing page
    'start a thrift store',
    'sell preloved clothes',
    'sell secondhand nepal',
    'thrift marketplace nepal',
    'open online store nepal',
  ],
  alternates: {
    canonical: 'https://www.thriftverse.shop/home',
  },
  openGraph: {
    title: 'Thriftverse — Your Finds. Your Store. Your Story.',
    description:
      'Create your own thrift store and give every item a second life.',
    url: 'https://www.thriftverse.shop/home',
    siteName: 'Thriftverse',
    images: [
      {
        url: 'https://www.thriftverse.shop/images/cover-image.png',
        width: 1200,
        height: 630,
        alt: 'Thriftverse',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thriftverse — Your Finds. Your Store. Your Story.',
    description:
      'Create your own thrift store and give every item a second life.',
    images: ['https://www.thriftverse.shop/images/cover-image.png'],
  },
};

export default function HomePage() {
  return <LandingPage />;
}
