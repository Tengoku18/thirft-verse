import PageLayout from '@/_components/common/PageLayout';

export default function PrivacyPolicyPage() {
  return (
    <PageLayout
      title="Privacy Policy"
      description="How we collect, use, and protect your personal information"
    >
      <div className="prose prose-primary mx-auto max-w-4xl py-12">
        <p className="text-primary/70 italic">
          Last Updated: January 2025
        </p>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            1. Introduction
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            Welcome to Thriftverse. We respect your privacy and are committed to
            protecting your personal data. This privacy policy explains how we
            collect, use, and safeguard your information when you use our
            platform to create and manage your thrift store.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            2. Information We Collect
          </h2>
          <h3 className="font-heading text-xl font-semibold text-primary mb-3">
            2.1 Information You Provide
          </h3>
          <ul className="list-disc pl-6 text-primary/80 space-y-2 mb-4">
            <li>Account information (name, email, password)</li>
            <li>Store information (subdomain, bio, profile picture)</li>
            <li>Product listings (photos, descriptions, prices)</li>
            <li>Payment information (eSewa account details)</li>
            <li>Communication data (messages, support requests)</li>
          </ul>

          <h3 className="font-heading text-xl font-semibold text-primary mb-3">
            2.2 Information We Collect Automatically
          </h3>
          <ul className="list-disc pl-6 text-primary/80 space-y-2 mb-4">
            <li>Usage data (pages visited, features used)</li>
            <li>Device information (browser type, IP address)</li>
            <li>Analytics data (store performance, sales metrics)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            3. How We Use Your Information
          </h2>
          <p className="text-primary/80 leading-relaxed mb-3">
            We use your information to:
          </p>
          <ul className="list-disc pl-6 text-primary/80 space-y-2 mb-4">
            <li>Provide and maintain your storefront</li>
            <li>Process transactions and payments through eSewa</li>
            <li>Send you important updates and notifications</li>
            <li>Improve our platform and develop new features</li>
            <li>Prevent fraud and ensure platform security</li>
            <li>Provide customer support</li>
            <li>Analyze usage patterns and trends</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            4. Information Sharing
          </h2>
          <p className="text-primary/80 leading-relaxed mb-3">
            We do not sell your personal information. We may share your data with:
          </p>
          <ul className="list-disc pl-6 text-primary/80 space-y-2 mb-4">
            <li>
              <strong>Payment Processors:</strong> eSewa and other payment
              gateways to process transactions
            </li>
            <li>
              <strong>Service Providers:</strong> Cloud hosting, analytics, and
              email services
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law or to
              protect our rights
            </li>
            <li>
              <strong>Public Information:</strong> Your store profile and
              product listings are publicly visible
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            5. Data Security
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            We implement industry-standard security measures to protect your
            data, including:
          </p>
          <ul className="list-disc pl-6 text-primary/80 space-y-2 mb-4">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication</li>
            <li>Secure payment processing through certified gateways</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            6. Your Rights
          </h2>
          <p className="text-primary/80 leading-relaxed mb-3">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 text-primary/80 space-y-2 mb-4">
            <li>Access your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Object to data processing</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            7. Data Retention
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            We retain your information as long as your account is active or as
            needed to provide services. After account deletion, we may retain
            certain information for legal compliance, dispute resolution, and
            fraud prevention.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            8. Children&apos;s Privacy
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            Thriftverse is not intended for users under 18 years of age. We do
            not knowingly collect information from children. If we discover we
            have collected data from a child, we will delete it immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            9. Changes to This Policy
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            We may update this privacy policy from time to time. We will notify
            you of significant changes via email or through the platform. Your
            continued use of Thriftverse after changes constitutes acceptance.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">
            10. Contact Us
          </h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            If you have questions about this privacy policy or your data, please
            contact us at:
          </p>
          <div className="rounded-lg bg-surface border border-border p-6">
            <p className="text-primary/80">
              <strong>Email:</strong> thriftverse.shop@gmail.com
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
