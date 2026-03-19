import AppDownloadQR from '@/_components/AppDownloadQR';
import Header from '@/_components/common/Header';
import Footer from '@/_components/landing/Footer';
import {
  Apple,
  Download,
  MonitorSmartphone,
  Package,
  Shield,
  Smartphone,
  Store,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Start Your Store | Thriftverse',
  description:
    'Download the Thriftverse mobile app to create your thrift store, add products, and manage orders on the go.',
};

export default function StartSellingPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <div className="from-background via-surface to-secondary/10 relative overflow-hidden bg-gradient-to-br">
        <div className="absolute inset-0 opacity-20">
          <div className="bg-secondary/30 absolute top-20 right-10 h-72 w-72 rounded-full blur-3xl"></div>
          <div className="bg-accent-1/30 absolute bottom-20 left-10 h-96 w-96 rounded-full blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="bg-secondary/10 border-secondary/20 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2">
              <Smartphone className="text-secondary h-5 w-5" />
              <span className="text-primary text-sm font-semibold">
                Mobile-First Selling Experience
              </span>
            </div>

            <h1 className="font-heading text-primary mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
              Start Your Thrift Store
              <br />
              <span className="from-secondary via-accent-2 to-secondary bg-gradient-to-r bg-clip-text text-transparent">
                In Minutes
              </span>
            </h1>

            <p className="text-primary/70 mx-auto mb-10 max-w-2xl text-lg sm:text-xl">
              Download our mobile app to create your personalized storefront,
              upload products, and start selling to conscious shoppers
              worldwide.
            </p>

            {/* App Download Badges */}
            <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="https://apps.apple.com/np/app/thriftverse/id6758267809"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-primary text-surface flex items-center gap-3 rounded-2xl px-6 py-4 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <Apple className="h-8 w-8" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-bold">App Store</div>
                </div>
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=com.thriftverse.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-primary text-surface flex items-center gap-3 rounded-2xl px-6 py-4 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <MonitorSmartphone className="h-8 w-8" />
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-lg font-bold">Google Play</div>
                </div>
              </a>
            </div>

            <p className="text-primary/60 text-sm">
              Or scan the QR code below with your phone camera
            </p>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="border-border/50 bg-surface/30 border-y py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
            <AppDownloadQR store="ios" />

            <div className="text-center">
              <h3 className="font-heading text-primary mb-2 text-2xl font-bold">
                Quick Access
              </h3>
              <p className="text-primary/70">
                Point your phone camera at the QR code to
                <br />
                download the Thriftverse app instantly
              </p>
            </div>

            <AppDownloadQR store="android" />
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-primary mb-4 text-3xl font-bold sm:text-4xl">
              How It Works
            </h2>
            <p className="text-primary/70 mx-auto max-w-2xl text-lg">
              Get your thrift store up and running in four simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="group relative">
              <div className="border-border/50 bg-surface hover:border-secondary/50 rounded-2xl border p-8 text-center transition-all hover:shadow-xl">
                <div className="bg-secondary/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
                  <Download className="text-secondary h-8 w-8" />
                </div>
                <div className="text-secondary mb-2 text-sm font-semibold">
                  Step 1
                </div>
                <h3 className="font-heading text-primary mb-3 text-xl font-bold">
                  Download App
                </h3>
                <p className="text-primary/70 text-sm">
                  Get the Thriftverse app from App Store or Google Play Store
                </p>
              </div>
              <div className="absolute top-1/2 -right-4 hidden -translate-y-1/2 lg:block">
                <div className="from-secondary h-0.5 w-8 bg-gradient-to-r to-transparent"></div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative">
              <div className="border-border/50 bg-surface hover:border-secondary/50 rounded-2xl border p-8 text-center transition-all hover:shadow-xl">
                <div className="bg-secondary/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
                  <Store className="text-secondary h-8 w-8" />
                </div>
                <div className="text-secondary mb-2 text-sm font-semibold">
                  Step 2
                </div>
                <h3 className="font-heading text-primary mb-3 text-xl font-bold">
                  Create Store
                </h3>
                <p className="text-primary/70 text-sm">
                  Sign up and set up your unique storefront with your custom URL
                </p>
              </div>
              <div className="absolute top-1/2 -right-4 hidden -translate-y-1/2 lg:block">
                <div className="from-secondary h-0.5 w-8 bg-gradient-to-r to-transparent"></div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative">
              <div className="border-border/50 bg-surface hover:border-secondary/50 rounded-2xl border p-8 text-center transition-all hover:shadow-xl">
                <div className="bg-secondary/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
                  <Package className="text-secondary h-8 w-8" />
                </div>
                <div className="text-secondary mb-2 text-sm font-semibold">
                  Step 3
                </div>
                <h3 className="font-heading text-primary mb-3 text-xl font-bold">
                  Add Products
                </h3>
                <p className="text-primary/70 text-sm">
                  Upload photos, add descriptions, and set prices for your items
                </p>
              </div>
              <div className="absolute top-1/2 -right-4 hidden -translate-y-1/2 lg:block">
                <div className="from-secondary h-0.5 w-8 bg-gradient-to-r to-transparent"></div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="group relative">
              <div className="border-border/50 bg-surface hover:border-secondary/50 rounded-2xl border p-8 text-center transition-all hover:shadow-xl">
                <div className="bg-secondary/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
                  <TrendingUp className="text-secondary h-8 w-8" />
                </div>
                <div className="text-secondary mb-2 text-sm font-semibold">
                  Step 4
                </div>
                <h3 className="font-heading text-primary mb-3 text-xl font-bold">
                  Start Selling
                </h3>
                <p className="text-primary/70 text-sm">
                  Share your store link and manage orders right from your phone
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-border/50 from-surface/30 to-background border-t bg-gradient-to-b py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-primary mb-4 text-3xl font-bold sm:text-4xl">
              Why Sell on Mobile?
            </h2>
            <p className="text-primary/70 mx-auto max-w-2xl text-lg">
              Everything you need to run your thrift store, right in your pocket
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="border-border/50 bg-surface rounded-2xl border p-8">
              <div className="bg-secondary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Smartphone className="text-secondary h-6 w-6" />
              </div>
              <h3 className="font-heading text-primary mb-3 text-xl font-bold">
                Sell Anytime, Anywhere
              </h3>
              <p className="text-primary/70">
                Upload products, update inventory, and respond to customers on
                the go
              </p>
            </div>

            <div className="border-border/50 bg-surface rounded-2xl border p-8">
              <div className="bg-secondary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Package className="text-secondary h-6 w-6" />
              </div>
              <h3 className="font-heading text-primary mb-3 text-xl font-bold">
                Easy Product Management
              </h3>
              <p className="text-primary/70">
                Take photos, add details, and list items in seconds with our
                intuitive interface
              </p>
            </div>

            <div className="border-border/50 bg-surface rounded-2xl border p-8">
              <div className="bg-secondary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <TrendingUp className="text-secondary h-6 w-6" />
              </div>
              <h3 className="font-heading text-primary mb-3 text-xl font-bold">
                Real-Time Order Updates
              </h3>
              <p className="text-primary/70">
                Get instant notifications when someone buys from your store
              </p>
            </div>

            <div className="border-border/50 bg-surface rounded-2xl border p-8">
              <div className="bg-secondary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Shield className="text-secondary h-6 w-6" />
              </div>
              <h3 className="font-heading text-primary mb-3 text-xl font-bold">
                Secure Payments
              </h3>
              <p className="text-primary/70">
                Integrated eSewa payment system for safe and secure transactions
              </p>
            </div>

            <div className="border-border/50 bg-surface rounded-2xl border p-8">
              <div className="bg-secondary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Store className="text-secondary h-6 w-6" />
              </div>
              <h3 className="font-heading text-primary mb-3 text-xl font-bold">
                Your Own Storefront
              </h3>
              <p className="text-primary/70">
                Get a personalized URL to share with customers and build your
                brand
              </p>
            </div>

            <div className="border-border/50 bg-surface rounded-2xl border p-8">
              <div className="bg-secondary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Download className="text-secondary h-6 w-6" />
              </div>
              <h3 className="font-heading text-primary mb-3 text-xl font-bold">
                Offline Mode
              </h3>
              <p className="text-primary/70">
                Draft listings offline and publish when you&apos;re back online
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-border/50 from-secondary/5 via-accent-2/5 to-background border-t bg-gradient-to-br py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-primary mb-6 text-3xl font-bold sm:text-4xl">
            Ready to Start Your Thrift Journey?
          </h2>
          <p className="text-primary/70 mx-auto mb-10 max-w-2xl text-lg">
            Join thousands of sellers who have already discovered the easiest
            way to sell thrift items online
          </p>

          {/* App Download Badges */}
          <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://apps.apple.com/np/app/thriftverse/id6758267809"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-primary text-surface flex items-center gap-3 rounded-2xl px-6 py-4 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <Apple className="h-8 w-8" />
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-bold">App Store</div>
              </div>
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.thriftverse.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-primary text-surface flex items-center gap-3 rounded-2xl px-6 py-4 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <MonitorSmartphone className="h-8 w-8" />
              <div className="text-left">
                <div className="text-xs">GET IT ON</div>
                <div className="text-lg font-bold">Google Play</div>
              </div>
            </a>
          </div>

          <p className="text-primary/60 text-sm">
            Need help? Check out our{' '}
            <Link
              href="/seller-guide"
              className="text-secondary hover:underline"
            >
              Seller Guide
            </Link>{' '}
            or{' '}
            <Link href="/faqs" className="text-secondary hover:underline">
              FAQs
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
