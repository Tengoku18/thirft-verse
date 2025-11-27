import { CustomHeader } from "@/components/navigation/CustomHeader";
import { ThemedText } from "@/components/themed-text";
import React from "react";
import { ScrollView, View } from "react-native";

export default function TermsScreen() {
  return (
    <View className="flex-1 bg-white">
      <CustomHeader title="Terms & Conditions" showBackButton />

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

          <Section title="1. Acceptance of Terms">
            By accessing and using ThriftVerse, you agree to be bound by these
            Terms and Conditions. If you do not agree to these terms, please do
            not use our platform.
          </Section>

          <Section title="2. User Accounts">
            You must create an account to use certain features of ThriftVerse.
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account.
          </Section>

          <Section title="3. Listing Products">
            When listing products on ThriftVerse, you agree to:{"\n\n"}
            • Provide accurate and truthful descriptions{"\n"}
            • Use your own photos of the actual items{"\n"}
            • Set fair and honest prices{"\n"}
            • Only list items you legally own and have the right to sell{"\n"}
            • Not list prohibited or illegal items
          </Section>

          <Section title="4. Purchases">
            All purchases made through ThriftVerse are final. Buyers should
            carefully review product descriptions and images before making a
            purchase. ThriftVerse acts as a platform connecting buyers and
            sellers.
          </Section>

          <Section title="5. Prohibited Items">
            The following items are prohibited on ThriftVerse:{"\n\n"}
            • Counterfeit or replica items{"\n"}
            • Stolen goods{"\n"}
            • Hazardous materials{"\n"}
            • Items that violate intellectual property rights{"\n"}
            • Weapons or illegal substances
          </Section>

          <Section title="6. User Conduct">
            Users agree not to:{"\n\n"}
            • Engage in fraudulent activities{"\n"}
            • Harass other users{"\n"}
            • Manipulate prices or reviews{"\n"}
            • Use the platform for illegal purposes{"\n"}
            • Attempt to bypass platform fees
          </Section>

          <Section title="7. Intellectual Property">
            All content on ThriftVerse, including logos, designs, and text, is
            owned by ThriftVerse or its licensors. Users retain ownership of
            their content but grant ThriftVerse a license to use it on the
            platform.
          </Section>

          <Section title="8. Limitation of Liability">
            ThriftVerse is not liable for any direct, indirect, incidental, or
            consequential damages arising from your use of the platform or any
            transactions between users.
          </Section>

          <Section title="9. Changes to Terms">
            We reserve the right to modify these terms at any time. Continued
            use of the platform after changes constitutes acceptance of the new
            terms.
          </Section>

          <Section title="10. Contact Us">
            If you have any questions about these Terms & Conditions, please
            contact us at support@thriftverse.shop
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
