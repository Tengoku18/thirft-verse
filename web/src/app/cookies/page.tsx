import PageLayout from '@/_components/common/PageLayout';

export default function CookiePolicyPage() {
  return (
    <PageLayout
      title="Cookie Policy"
      description="How we use cookies and similar technologies"
    >
      <div className="prose prose-primary mx-auto max-w-4xl py-12">
        <p className="text-primary/70 italic">
          Last Updated: January 2025
        </p>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            1. What Are Cookies?
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            Cookies are small text files that are placed on your device when you
            visit our website. They help us provide you with a better
            experience by remembering your preferences and understanding how you
            use ThriftVerse.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            2. Types of Cookies We Use
          </h2>

          <div className="mb-6">
            <h3 className="font-heading text-xl font-semibold text-primary mb-3">
              2.1 Essential Cookies
            </h3>
            <p className="text-primary/80 leading-relaxed mb-3">
              These cookies are necessary for the website to function properly.
              They enable core functionality such as:
            </p>
            <ul className="list-disc pl-6 text-primary/80 space-y-2 mb-4">
              <li>User authentication and account access</li>
              <li>Security and fraud prevention</li>
              <li>Session management</li>
              <li>Load balancing</li>
            </ul>
            <p className="text-primary/70 text-sm">
              You cannot opt out of essential cookies as they are required for
              the platform to work.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-heading text-xl font-semibold text-primary mb-3">
              2.2 Analytics Cookies
            </h3>
            <p className="text-primary/80 leading-relaxed mb-3">
              These cookies help us understand how visitors interact with our
              website by collecting information such as:
            </p>
            <ul className="list-disc pl-6 text-primary/80 space-y-2 mb-4">
              <li>Pages visited and time spent on pages</li>
              <li>Navigation paths through the site</li>
              <li>Device and browser information</li>
              <li>Error messages encountered</li>
            </ul>
            <p className="text-primary/70 text-sm">
              We use services like Google Analytics for this purpose.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-heading text-xl font-semibold text-primary mb-3">
              2.3 Functionality Cookies
            </h3>
            <p className="text-primary/80 leading-relaxed mb-3">
              These cookies allow us to remember your preferences and provide
              enhanced features:
            </p>
            <ul className="list-disc pl-6 text-primary/80 space-y-2 mb-4">
              <li>Language preferences</li>
              <li>Display settings</li>
              <li>Store customization options</li>
              <li>Recently viewed products</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-heading text-xl font-semibold text-primary mb-3">
              2.4 Marketing Cookies
            </h3>
            <p className="text-primary/80 leading-relaxed mb-3">
              These cookies track your activity across websites to help us
              deliver more relevant advertising:
            </p>
            <ul className="list-disc pl-6 text-primary/80 space-y-2 mb-4">
              <li>Social media integration (Facebook, Instagram)</li>
              <li>Advertising network cookies</li>
              <li>Retargeting and remarketing</li>
            </ul>
            <p className="text-primary/70 text-sm">
              You can opt out of these cookies through your browser settings or
              our cookie consent tool.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            3. Third-Party Cookies
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            We use services from third-party providers that may set their own
            cookies:
          </p>
          <ul className="list-disc pl-6 text-primary/80 space-y-2 mb-4">
            <li>
              <strong>eSewa:</strong> Payment processing and transaction
              security
            </li>
            <li>
              <strong>Google Analytics:</strong> Website analytics and
              performance tracking
            </li>
            <li>
              <strong>Social Media Platforms:</strong> Integration with
              Instagram, Facebook, Twitter
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            4. Cookie Duration
          </h2>
          <div className="mb-6">
            <h3 className="font-heading text-xl font-semibold text-primary mb-3">
              Session Cookies
            </h3>
            <p className="text-primary/80 leading-relaxed mb-4">
              These are temporary cookies that expire when you close your
              browser. They help maintain your session while navigating the
              site.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-heading text-xl font-semibold text-primary mb-3">
              Persistent Cookies
            </h3>
            <p className="text-primary/80 leading-relaxed mb-4">
              These remain on your device for a set period or until you delete
              them. They remember your preferences and settings for future
              visits.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            5. Managing Cookies
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            You can control and manage cookies in several ways:
          </p>

          <div className="mb-6">
            <h3 className="font-heading text-xl font-semibold text-primary mb-3">
              Browser Settings
            </h3>
            <p className="text-primary/80 leading-relaxed mb-4">
              Most browsers allow you to refuse cookies or delete existing ones.
              Instructions vary by browser:
            </p>
            <ul className="list-disc pl-6 text-primary/80 space-y-2 mb-4">
              <li>Chrome: Settings &gt; Privacy and security &gt; Cookies</li>
              <li>Firefox: Options &gt; Privacy &amp; Security &gt; Cookies</li>
              <li>Safari: Preferences &gt; Privacy &gt; Cookies</li>
              <li>Edge: Settings &gt; Privacy &gt; Cookies</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-heading text-xl font-semibold text-primary mb-3">
              Cookie Consent Tool
            </h3>
            <p className="text-primary/80 leading-relaxed mb-4">
              When you first visit ThriftVerse, you can choose which categories
              of cookies to accept through our cookie consent banner. You can
              change your preferences at any time through our cookie settings.
            </p>
          </div>

          <div className="rounded-lg bg-accent-1/10 border border-accent-1/20 p-6 mb-4">
            <p className="text-primary/80">
              <strong>Note:</strong> Disabling certain cookies may limit your
              ability to use some features of ThriftVerse. Essential cookies
              cannot be disabled as they are required for the platform to
              function.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            6. Do Not Track
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            Some browsers have a "Do Not Track" feature. Currently, there is no
            industry standard for how to respond to these signals, so we do not
            respond to Do Not Track requests at this time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            7. Updates to This Policy
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            We may update this Cookie Policy from time to time to reflect
            changes in technology or legal requirements. We will post the
            updated policy on this page with a new "Last Updated" date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            8. Contact Us
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            If you have questions about our use of cookies, please contact us:
          </p>
          <div className="rounded-lg bg-surface border border-border p-6">
            <p className="text-primary/80">
              <strong>Email:</strong> privacy@thriftverse.com
              <br />
              <strong>Address:</strong> Thamel, Ward 26, Kathmandu 44600, Nepal
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
