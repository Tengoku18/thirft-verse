import PageLayout from '@/_components/common/PageLayout';

export default function TermsOfServicePage() {
  return (
    <PageLayout
      title="Terms of Service"
      description="Terms and conditions for using ThriftVerse"
    >
      <div className="prose prose-primary mx-auto max-w-4xl py-12">
        <p className="text-primary/70 italic">
          Last Updated: January 2025
        </p>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            By accessing and using ThriftVerse, you accept and agree to be bound
            by these Terms of Service. If you do not agree to these terms,
            please do not use our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            2. Description of Service
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            ThriftVerse provides a platform that enables users to create and
            manage their own thrift stores with unique subdomain URLs. We
            facilitate e-commerce transactions between sellers and buyers
            through integration with eSewa payment gateway.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            3. User Accounts
          </h2>
          <h3 className="font-heading text-xl font-semibold text-primary mb-3">
            3.1 Account Creation
          </h3>
          <ul className="list-disc pl-6 text-primary/80 space-y-2 mb-4">
            <li>You must be at least 18 years old to create an account</li>
            <li>You must provide accurate and complete information</li>
            <li>You are responsible for maintaining account security</li>
            <li>You are responsible for all activities under your account</li>
          </ul>

          <h3 className="font-heading text-xl font-semibold text-primary mb-3">
            3.2 Account Termination
          </h3>
          <p className="text-primary/80 leading-relaxed mb-4">
            We reserve the right to suspend or terminate accounts that violate
            these terms, engage in fraudulent activity, or for any other reason
            at our discretion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            4. Seller Responsibilities
          </h2>
          <p className="text-primary/80 leading-relaxed mb-3">
            As a seller on ThriftVerse, you agree to:
          </p>
          <ul className="list-disc pl-6 text-primary/80 space-y-2 mb-4">
            <li>
              Provide accurate descriptions and photos of items for sale
            </li>
            <li>
              Honor all sales and fulfill orders in a timely manner
            </li>
            <li>
              Handle shipping and delivery to customers
            </li>
            <li>
              Comply with all applicable laws and regulations
            </li>
            <li>
              Not sell prohibited, illegal, or counterfeit items
            </li>
            <li>
              Be responsible for customer service and dispute resolution
            </li>
            <li>
              Maintain accurate inventory and pricing
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            5. Prohibited Items
          </h2>
          <p className="text-primary/80 leading-relaxed mb-3">
            The following items are prohibited from being sold on ThriftVerse:
          </p>
          <ul className="list-disc pl-6 text-primary/80 space-y-2 mb-4">
            <li>Illegal drugs, weapons, or controlled substances</li>
            <li>Counterfeit or replica items</li>
            <li>Stolen goods</li>
            <li>Items that infringe on intellectual property rights</li>
            <li>Adult content or services</li>
            <li>Live animals</li>
            <li>Hazardous materials</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            6. Payments and Fees
          </h2>
          <h3 className="font-heading text-xl font-semibold text-primary mb-3">
            6.1 Subscription Fees
          </h3>
          <p className="text-primary/80 leading-relaxed mb-4">
            Subscription fees for Pro and Enterprise plans are billed monthly or
            annually. Fees are non-refundable except as required by law.
          </p>

          <h3 className="font-heading text-xl font-semibold text-primary mb-3">
            6.2 Transaction Processing
          </h3>
          <p className="text-primary/80 leading-relaxed mb-4">
            All customer payments are processed through eSewa. ThriftVerse does
            not take commission on sales, but standard eSewa payment gateway
            fees apply (typically 2-3% per transaction).
          </p>

          <h3 className="font-heading text-xl font-semibold text-primary mb-3">
            6.3 Taxes
          </h3>
          <p className="text-primary/80 leading-relaxed mb-4">
            Sellers are responsible for determining and paying all applicable
            taxes on their sales. ThriftVerse is not responsible for tax
            compliance.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            7. Intellectual Property
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            You retain ownership of content you upload to ThriftVerse. By
            uploading content, you grant us a license to display, store, and
            distribute it as necessary to provide our services. You represent
            that you have all necessary rights to the content you upload.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            8. Disputes
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            Disputes between buyers and sellers should be resolved directly
            between the parties. ThriftVerse may assist in dispute resolution
            but is not obligated to do so. We reserve the right to suspend
            accounts involved in disputes until resolution.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            9. Limitation of Liability
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            ThriftVerse provides the platform "as is" without warranties of any
            kind. We are not liable for:
          </p>
          <ul className="list-disc pl-6 text-primary/80 space-y-2 mb-4">
            <li>Disputes between buyers and sellers</li>
            <li>Quality or accuracy of product listings</li>
            <li>Shipping delays or issues</li>
            <li>Payment processing errors</li>
            <li>Loss of data or business interruption</li>
          </ul>
          <p className="text-primary/80 leading-relaxed mb-4">
            Our total liability shall not exceed the fees paid by you in the
            past 12 months.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            10. Indemnification
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            You agree to indemnify and hold ThriftVerse harmless from any claims,
            damages, or expenses arising from your use of the platform, your
            violation of these terms, or your violation of any rights of others.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            11. Changes to Terms
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            We may modify these terms at any time. We will notify users of
            significant changes via email. Continued use of ThriftVerse after
            changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            12. Governing Law
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            These terms are governed by the laws of Nepal. Any disputes shall be
            resolved in the courts of Kathmandu, Nepal.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            13. Contact Information
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            For questions about these terms, contact us at:
          </p>
          <div className="rounded-lg bg-surface border border-border p-6">
            <p className="text-primary/80">
              <strong>Email:</strong> legal@thriftverse.com
              <br />
              <strong>Address:</strong> Thamel, Ward 26, Kathmandu 44600, Nepal
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
