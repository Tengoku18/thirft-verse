import {
  CalendarIcon,
  CheckmarkSealFillIcon,
  GearIcon,
  HelpIcon,
  LinkIcon,
  LockIcon,
  MailIcon,
  PencilIcon,
  UserIcon,
} from "@/components/icons";
import { AuthScreenLayout } from "@/components/layouts/AuthScreenLayout";
import { Typography } from "@/components/ui/Typography/Typography";
import React from "react";
import { Linking, Pressable, ScrollView, View } from "react-native";

// Icon mapping for policy sections
const SECTION_ICON_MAP: Record<string, React.ReactNode> = {
  "info.circle": <HelpIcon width={24} height={24} color="#3B2F2F" />,
  gear: <GearIcon width={24} height={24} color="#3B2F2F" />,
  "square.on.square": <LinkIcon width={24} height={24} color="#3B2F2F" />,
  "lock.shield": <LockIcon width={24} height={24} color="#3B2F2F" />,
  "checkmark.shield": (
    <CheckmarkSealFillIcon width={24} height={24} color="#3B2F2F" />
  ),
  calendar: <CalendarIcon width={24} height={24} color="#3B2F2F" />,
  "person.circle": <UserIcon width={24} height={24} color="#3B2F2F" />,
  "pencil.circle": <PencilIcon width={24} height={24} color="#3B2F2F" />,
  envelope: <MailIcon width={24} height={24} color="#3B2F2F" />,
};

export default function PrivacyScreen() {
  return (
    <AuthScreenLayout
      showHeader
      headerTitle="Privacy Policy"
      headerAlignment="center"
      backgroundColor="#F5F5F5"
      showBackButton
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-6 py-6">
          {/* Header */}
          <View className="mb-6">
            <Typography variation="body" className="leading-6 text-slate-600">
              At Thriftverse, your privacy is our priority. This policy outlines
              how we collect, use, and protect your personal information within
              our sustainable fashion marketplace.
            </Typography>
          </View>

          <Typography variation="caption" className="mb-8 text-slate-400">
            LAST UPDATED: JANUARY 2025
          </Typography>

          {/* Introduction */}
          <SectionWithIcon title="1. Introduction" icon="info.circle">
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              Welcome to Thriftverse. We respect your privacy and are committed
              to protecting your personal data. This privacy policy explains how
              we collect, use, and safeguard your information when you use our
              platform to create and manage your thrift store.
            </Typography>
          </SectionWithIcon>

          {/* Information We Collect */}
          <SectionWithIcon title="2. Information Collection" icon="info.circle">
            <View className="mb-4">
              <Typography
                variation="body-sm"
                className="font-semibold text-slate-800 mb-2"
              >
                Information You Provide
              </Typography>
              <Typography
                variation="body-sm"
                className="leading-6 text-slate-600"
              >
                • Account information (name, email, password){"\n"}• Store
                information (subdomain, bio, profile picture){"\n"}• Product
                listings (photos, descriptions, prices){"\n"}• Payment
                information (eSewa account details){"\n"}• Communication data
                (messages, support requests)
              </Typography>
            </View>

            <View>
              <Typography
                variation="body-sm"
                className="font-semibold text-slate-800 mb-2"
              >
                Information We Collect Automatically
              </Typography>
              <Typography
                variation="body-sm"
                className="leading-6 text-slate-600"
              >
                • Usage data (pages visited, features used){"\n"}• Device
                information (browser type, IP address){"\n"}• Analytics data
                (store performance, sales metrics){"\n"}• Cookies and similar
                tracking technologies
              </Typography>
            </View>
          </SectionWithIcon>

          {/* How We Use Your Information */}
          <SectionWithIcon title="3. How We Use Your Information" icon="gear">
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              • Provide and maintain your storefront{"\n"}• Process transactions
              and payments through eSewa{"\n"}• Send you important updates and
              notifications{"\n"}• Improve our platform and develop new features
              {"\n"}• Prevent fraud and ensure platform security{"\n"}• Provide
              customer support{"\n"}• Analyze usage patterns and trends
            </Typography>
          </SectionWithIcon>

          {/* Information Sharing */}
          <SectionWithIcon
            title="4. Information Sharing"
            icon="square.on.square"
          >
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              We do not sell your personal information. We may share your data
              with:
            </Typography>

            <View className="mt-4">
              <Typography
                variation="body-sm"
                className="font-semibold text-slate-800 mb-2"
              >
                Payment Processors
              </Typography>
              <Typography
                variation="body-sm"
                className="leading-6 text-slate-600 mb-3"
              >
                eSewa and other payment gateways to process transactions
              </Typography>

              <Typography
                variation="body-sm"
                className="font-semibold text-slate-800 mb-2"
              >
                Service Providers
              </Typography>
              <Typography
                variation="body-sm"
                className="leading-6 text-slate-600 mb-3"
              >
                Cloud hosting, analytics, and email services
              </Typography>

              <Typography
                variation="body-sm"
                className="font-semibold text-slate-800 mb-2"
              >
                Legal Requirements
              </Typography>
              <Typography
                variation="body-sm"
                className="leading-6 text-slate-600 mb-3"
              >
                When required by law or to protect our rights
              </Typography>

              <Typography
                variation="body-sm"
                className="font-semibold text-slate-800 mb-2"
              >
                Public Information
              </Typography>
              <Typography
                variation="body-sm"
                className="leading-6 text-slate-600"
              >
                Your store profile and product listings are publicly visible
              </Typography>
            </View>
          </SectionWithIcon>

          {/* Data Security */}
          <SectionWithIcon title="5. Data Security" icon="lock.shield">
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              We implement industry-standard security measures to protect your
              data, including:
            </Typography>

            <Typography
              variation="body-sm"
              className="leading-6 mt-3 text-slate-600"
            >
              • Encryption of data in transit and at rest{"\n"}• Regular
              security audits and updates{"\n"}• Access controls and
              authentication{"\n"}• Secure payment processing through certified
              gateways
            </Typography>
          </SectionWithIcon>

          {/* Your Rights */}
          <SectionWithIcon title="6. Your Rights" icon="checkmark.shield">
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              You have the right to:
            </Typography>

            <Typography
              variation="body-sm"
              className="leading-6 mt-3 text-slate-600"
            >
              • Access your personal data{"\n"}• Correct inaccurate information
              {"\n"}• Request deletion of your data{"\n"}• Export your data
              {"\n"}• Opt-out of marketing communications{"\n"}• Object to data
              processing
            </Typography>
          </SectionWithIcon>

          {/* Data Retention */}
          <SectionWithIcon title="7. Data Retention" icon="calendar">
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              We retain your information as long as your account is active or as
              needed to provide services. After account deletion, we may retain
              certain information for legal compliance, dispute resolution, and
              fraud prevention.
            </Typography>
          </SectionWithIcon>

          {/* Children's Privacy */}
          <SectionWithIcon title="8. Children's Privacy" icon="person.circle">
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              Thriftverse is not intended for users under 18 years of age. We do
              not knowingly collect information from children. If we discover we
              have collected data from a child, we will delete it immediately.
            </Typography>
          </SectionWithIcon>

          {/* Changes to This Policy */}
          <SectionWithIcon
            title="9. Changes to This Policy"
            icon="pencil.circle"
          >
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              We may update this privacy policy from time to time. We will
              notify you of significant changes via email or through the
              platform. Your continued use of Thriftverse after changes
              constitutes acceptance.
            </Typography>
          </SectionWithIcon>

          {/* Contact Us */}
          <SectionWithIcon title="10. Contact Us" icon="envelope">
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600 mb-3"
            >
              If you have questions about this privacy policy or your data,
              please contact us at:
            </Typography>

            <Pressable
              onPress={() =>
                Linking.openURL("mailto:thriiftverse.shop@gmail.com")
              }
              className="flex-row items-center gap-2 bg-slate-50 p-4 rounded-lg"
            >
              <MailIcon width={16} height={16} color="#3B2F2F" />
              <Typography variation="body-sm" className="text-slate-800">
                thriiftverse.shop@gmail.com
              </Typography>
            </Pressable>
          </SectionWithIcon>
        </View>
      </ScrollView>
    </AuthScreenLayout>
  );
}

function SectionWithIcon({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-8">
      <View className="flex-row items-center gap-3 mb-4">
        {SECTION_ICON_MAP[icon] || (
          <HelpIcon width={24} height={24} color="#3B2F2F" />
        )}
        <Typography variation="h4" className="font-sans-bold text-slate-800">
          {title}
        </Typography>
      </View>
      <View style={{ marginLeft: 36 }}>{children}</View>
    </View>
  );
}
