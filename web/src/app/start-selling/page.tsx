import { Smartphone, Download, Store, Package, TrendingUp, Shield, Apple, MonitorSmartphone } from 'lucide-react'
import Link from 'next/link'
import Header from '@/_components/common/Header'
import Footer from '@/_components/landing/Footer'
import AppDownloadQR from '@/_components/AppDownloadQR'

export const metadata = {
  title: 'Start Your Store | ThriftVerse',
  description: 'Download the ThriftVerse mobile app to create your thrift store, add products, and manage orders on the go.',
}

export default function StartSellingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-surface to-secondary/10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-1/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 border border-secondary/20">
              <Smartphone className="h-5 w-5 text-secondary" />
              <span className="text-sm font-semibold text-primary">
                Mobile-First Selling Experience
              </span>
            </div>

            <h1 className="font-heading mb-6 text-4xl font-bold text-primary sm:text-5xl lg:text-6xl">
              Start Your Thrift Store
              <br />
              <span className="bg-gradient-to-r from-secondary via-accent-2 to-secondary bg-clip-text text-transparent">
                In Minutes
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-primary/70 sm:text-xl">
              Download our mobile app to create your personalized storefront, upload products, and start selling to conscious shoppers worldwide.
            </p>

            {/* App Download Badges */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-8">
              <a
                href="https://apps.apple.com/np/app/thriftverse/id6758267809"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl bg-primary px-6 py-4 text-surface shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <Apple className="h-8 w-8" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-bold">App Store</div>
                </div>
              </a>

              <a
                href="https://play.google.com/store/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl bg-primary px-6 py-4 text-surface shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <MonitorSmartphone className="h-8 w-8" />
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-lg font-bold">Google Play</div>
                </div>
              </a>
            </div>

            <p className="text-sm text-primary/60">
              Or scan the QR code below with your phone camera
            </p>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="border-y border-border/50 bg-surface/30 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
            <AppDownloadQR />

            <div className="text-center sm:text-left">
              <h3 className="font-heading mb-2 text-2xl font-bold text-primary">
                Quick Access
              </h3>
              <p className="text-primary/70">
                Point your phone camera at the QR code to
                <br />
                download the ThriftVerse app instantly
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading mb-4 text-3xl font-bold text-primary sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-primary/70">
              Get your thrift store up and running in four simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="relative group">
              <div className="rounded-2xl border border-border/50 bg-surface p-8 text-center transition-all hover:shadow-xl hover:border-secondary/50">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                  <Download className="h-8 w-8 text-secondary" />
                </div>
                <div className="mb-2 text-sm font-semibold text-secondary">Step 1</div>
                <h3 className="font-heading mb-3 text-xl font-bold text-primary">
                  Download App
                </h3>
                <p className="text-sm text-primary/70">
                  Get the ThriftVerse app from App Store or Google Play Store
                </p>
              </div>
              <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 lg:block">
                <div className="h-0.5 w-8 bg-gradient-to-r from-secondary to-transparent"></div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="rounded-2xl border border-border/50 bg-surface p-8 text-center transition-all hover:shadow-xl hover:border-secondary/50">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                  <Store className="h-8 w-8 text-secondary" />
                </div>
                <div className="mb-2 text-sm font-semibold text-secondary">Step 2</div>
                <h3 className="font-heading mb-3 text-xl font-bold text-primary">
                  Create Store
                </h3>
                <p className="text-sm text-primary/70">
                  Sign up and set up your unique storefront with your custom URL
                </p>
              </div>
              <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 lg:block">
                <div className="h-0.5 w-8 bg-gradient-to-r from-secondary to-transparent"></div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="rounded-2xl border border-border/50 bg-surface p-8 text-center transition-all hover:shadow-xl hover:border-secondary/50">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                  <Package className="h-8 w-8 text-secondary" />
                </div>
                <div className="mb-2 text-sm font-semibold text-secondary">Step 3</div>
                <h3 className="font-heading mb-3 text-xl font-bold text-primary">
                  Add Products
                </h3>
                <p className="text-sm text-primary/70">
                  Upload photos, add descriptions, and set prices for your items
                </p>
              </div>
              <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 lg:block">
                <div className="h-0.5 w-8 bg-gradient-to-r from-secondary to-transparent"></div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative group">
              <div className="rounded-2xl border border-border/50 bg-surface p-8 text-center transition-all hover:shadow-xl hover:border-secondary/50">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                  <TrendingUp className="h-8 w-8 text-secondary" />
                </div>
                <div className="mb-2 text-sm font-semibold text-secondary">Step 4</div>
                <h3 className="font-heading mb-3 text-xl font-bold text-primary">
                  Start Selling
                </h3>
                <p className="text-sm text-primary/70">
                  Share your store link and manage orders right from your phone
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-border/50 bg-gradient-to-b from-surface/30 to-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading mb-4 text-3xl font-bold text-primary sm:text-4xl">
              Why Sell on Mobile?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-primary/70">
              Everything you need to run your thrift store, right in your pocket
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/50 bg-surface p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                <Smartphone className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-heading mb-3 text-xl font-bold text-primary">
                Sell Anytime, Anywhere
              </h3>
              <p className="text-primary/70">
                Upload products, update inventory, and respond to customers on the go
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-surface p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                <Package className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-heading mb-3 text-xl font-bold text-primary">
                Easy Product Management
              </h3>
              <p className="text-primary/70">
                Take photos, add details, and list items in seconds with our intuitive interface
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-surface p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-heading mb-3 text-xl font-bold text-primary">
                Real-Time Order Updates
              </h3>
              <p className="text-primary/70">
                Get instant notifications when someone buys from your store
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-surface p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                <Shield className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-heading mb-3 text-xl font-bold text-primary">
                Secure Payments
              </h3>
              <p className="text-primary/70">
                Integrated eSewa payment system for safe and secure transactions
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-surface p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                <Store className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-heading mb-3 text-xl font-bold text-primary">
                Your Own Storefront
              </h3>
              <p className="text-primary/70">
                Get a personalized URL to share with customers and build your brand
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-surface p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                <Download className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-heading mb-3 text-xl font-bold text-primary">
                Offline Mode
              </h3>
              <p className="text-primary/70">
                Draft listings offline and publish when you're back online
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-border/50 bg-gradient-to-br from-secondary/5 via-accent-2/5 to-background py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading mb-6 text-3xl font-bold text-primary sm:text-4xl">
            Ready to Start Your Thrift Journey?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-primary/70">
            Join thousands of sellers who have already discovered the easiest way to sell thrift items online
          </p>

          {/* App Download Badges */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-8">
            <a
              href="https://apps.apple.com/np/app/thriftverse/id6758267809"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-2xl bg-primary px-6 py-4 text-surface shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <Apple className="h-8 w-8" />
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-bold">App Store</div>
              </div>
            </a>

            <a
              href="https://play.google.com/store/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-2xl bg-primary px-6 py-4 text-surface shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <MonitorSmartphone className="h-8 w-8" />
              <div className="text-left">
                <div className="text-xs">GET IT ON</div>
                <div className="text-lg font-bold">Google Play</div>
              </div>
            </a>
          </div>

          <p className="text-sm text-primary/60">
            Need help? Check out our{' '}
            <Link href="/seller-guide" className="text-secondary hover:underline">
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
  )
}
