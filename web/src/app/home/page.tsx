import LandingPage from '@/_components/landing/LandingPage';
import { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Thriftverse — Your Finds. Your Store. Your Story.',
  description:
    'Create your own thrift store and give every item a second life.',
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
