import { CustomHeader } from "@/components/navigation/CustomHeader";
import { ThemedText } from "@/components/themed-text";
import React from "react";
import { ScrollView, View } from "react-native";

export default function PrivacyScreen() {
  return (
    <View className="flex-1 bg-white">
      <CustomHeader title="Privacy Policy" showBackButton />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-6 py-4">
          <ThemedText
            className="text-[13px] font-[NunitoSans_400Regular] mb-6"
            style={{ color: "#6B7280" }}
          >
            Last updated: January 2025
          </ThemedText>

          <Section title="1. Information We Collect">
            We collect information you provide directly to us, including:{"\n\n"}
            • Account information (name, email, password){"\n"}
            • Profile information (username, bio, profile picture){"\n"}
            • Transaction data (purchases, sales, payment information){"\n"}
            • Communications (messages between users){"\n"}
            • Device information and usage data
          </Section>

          <Section title="2. How We Use Your Information">
            We use the information we collect to:{"\n\n"}
            • Provide and maintain our services{"\n"}
            • Process transactions and send related information{"\n"}
            • Send promotional communications (with your consent){"\n"}
            • Respond to your comments and questions{"\n"}
            • Analyze usage patterns to improve our platform{"\n"}
            • Detect and prevent fraudulent activity
          </Section>

          <Section title="3. Information Sharing">
            We may share your information with:{"\n\n"}
            • Other users (as necessary for transactions){"\n"}
            • Service providers who assist in our operations{"\n"}
            • Law enforcement when required by law{"\n"}
            • Business partners with your consent{"\n\n"}
            We do not sell your personal information to third parties.
          </Section>

          <Section title="4. Data Security">
            We implement appropriate security measures to protect your personal
            information. However, no method of transmission over the Internet is
            100% secure. We cannot guarantee absolute security of your data.
          </Section>

          <Section title="5. Your Rights">
            You have the right to:{"\n\n"}
            • Access your personal data{"\n"}
            • Correct inaccurate data{"\n"}
            • Delete your account and data{"\n"}
            • Opt-out of marketing communications{"\n"}
            • Export your data
          </Section>

          <Section title="6. Cookies and Tracking">
            We use cookies and similar technologies to:{"\n\n"}
            • Keep you logged in{"\n"}
            • Remember your preferences{"\n"}
            • Analyze platform usage{"\n"}
            • Personalize your experience
          </Section>

          <Section title="7. Children's Privacy">
            ThriftVerse is not intended for users under 13 years of age. We do
            not knowingly collect personal information from children under 13.
          </Section>

          <Section title="8. International Data Transfers">
            Your information may be transferred to and processed in countries
            other than your own. We ensure appropriate safeguards are in place
            for such transfers.
          </Section>

          <Section title="9. Changes to This Policy">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new policy on this page and
            updating the "Last updated" date.
          </Section>

          <Section title="10. Contact Us">
            If you have questions about this Privacy Policy, please contact us
            at privacy@thriftverse.shop
          </Section>
        </View>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-6">
      <ThemedText
        className="text-[16px] font-[NunitoSans_700Bold] mb-2"
        style={{ color: "#3B2F2F" }}
      >
        {title}
      </ThemedText>
      <ThemedText
        className="text-[14px] font-[NunitoSans_400Regular] leading-6"
        style={{ color: "#4B5563" }}
      >
        {children}
      </ThemedText>
    </View>
  );
}
