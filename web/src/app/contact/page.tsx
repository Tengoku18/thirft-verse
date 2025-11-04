'use client';

import Button from '@/_components/common/Button';
import PageLayout from '@/_components/common/PageLayout';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <PageLayout
      title="Contact Us"
      description="Get in touch with our team. We're here to help you succeed."
    >
      <div className="py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div>
            <h2 className="font-heading mb-6 text-2xl font-bold text-primary">
              Send us a messages
            </h2>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-primary"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-primary transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-primary"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-primary transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-primary"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-primary transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-primary"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-primary transition-all focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  placeholder="Tell us more about your question or concern..."
                />
              </div>

              <Button variant="secondary" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="font-heading mb-6 text-2xl font-bold text-primary">
              Other ways to reach us
            </h2>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4 rounded-xl border border-border bg-surface p-6 transition-all hover:shadow-lg">
                <div className="rounded-full bg-secondary/10 p-3">
                  <Mail className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-heading mb-1 text-lg font-bold text-primary">
                    Email Support
                  </h3>
                  <p className="mb-2 text-sm text-primary/70">
                    We'll respond within 24 hours
                  </p>
                  <a
                    href="mailto:support@thriftverse.com"
                    className="text-secondary hover:underline"
                  >
                    support@thriftverse.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 rounded-xl border border-border bg-surface p-6 transition-all hover:shadow-lg">
                <div className="rounded-full bg-accent-2/10 p-3">
                  <Phone className="h-6 w-6 text-accent-2" />
                </div>
                <div>
                  <h3 className="font-heading mb-1 text-lg font-bold text-primary">
                    Phone Support
                  </h3>
                  <p className="mb-2 text-sm text-primary/70">
                    Mon-Fri, 9am-6pm NPT
                  </p>
                  <a
                    href="tel:+9779801234567"
                    className="text-secondary hover:underline"
                  >
                    +977 980-1234567
                  </a>
                </div>
              </div>

              {/* Live Chat */}
              <div className="flex items-start gap-4 rounded-xl border border-border bg-surface p-6 transition-all hover:shadow-lg">
                <div className="rounded-full bg-accent-1/10 p-3">
                  <MessageCircle className="h-6 w-6 text-accent-1" />
                </div>
                <div>
                  <h3 className="font-heading mb-1 text-lg font-bold text-primary">
                    Live Chat
                  </h3>
                  <p className="mb-2 text-sm text-primary/70">
                    Chat with our team in real-time
                  </p>
                  <button className="text-secondary hover:underline">
                    Start a conversation
                  </button>
                </div>
              </div>

              {/* Office */}
              <div className="flex items-start gap-4 rounded-xl border border-border bg-surface p-6 transition-all hover:shadow-lg">
                <div className="rounded-full bg-secondary/10 p-3">
                  <MapPin className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-heading mb-1 text-lg font-bold text-primary">
                    Office Location
                  </h3>
                  <p className="text-sm text-primary/70">
                    Kathmandu, Nepal
                    <br />
                    Thamel, Ward 26
                    <br />
                    Kathmandu 44600
                  </p>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="mt-8 rounded-xl bg-gradient-to-br from-secondary/10 to-accent-2/10 p-6">
              <h3 className="font-heading mb-2 text-lg font-bold text-primary">
                Average Response Time
              </h3>
              <p className="text-sm text-primary/70">
                We typically respond to all inquiries within 24 hours. For
                urgent matters, please call us directly during business hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
