import { Package } from 'lucide-react'
import Header from '@/_components/common/Header'
import Footer from '@/_components/landing/Footer'
import TrackOrderForm from './TrackOrderForm'

export const metadata = {
  title: 'Track Your Order | Thriftverse',
  description: 'Enter your order code to track the status of your Thriftverse order.',
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative overflow-hidden bg-linear-to-br from-background via-surface to-secondary/10 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-1/30 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 border border-secondary/20">
              <Package className="h-5 w-5 text-secondary" />
              <span className="text-sm font-semibold text-primary">Order Tracking</span>
            </div>

            <h1 className="font-heading mb-4 text-4xl font-bold text-primary sm:text-5xl">
              Track Your Order
            </h1>
            <p className="mx-auto max-w-lg text-lg text-primary/70">
              Enter your order code or ID below to check the current status of your order.
            </p>
          </div>

          {/* Card */}
          <div className="mx-auto max-w-md">
            <div className="rounded-2xl border border-border/50 bg-surface p-8 shadow-lg">
              <TrackOrderForm />
            </div>

            <p className="mt-4 text-center text-sm text-primary/50">
              Your order code can be found in your confirmation email (e.g.&nbsp;#TV-260102-101528-VCBZ)
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
