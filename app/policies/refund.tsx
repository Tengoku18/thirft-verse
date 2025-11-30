import { CustomHeader } from "@/components/navigation/CustomHeader";
import { BodyBoldText, BodyRegularText, CaptionText } from "@/components/Typography";
import React from "react";
import { ScrollView, View } from "react-native";

export default function RefundScreen() {
  return (
    <View className="flex-1 bg-white">
      <CustomHeader title="Refund Policy" showBackButton />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-6 py-4">
          <CaptionText className="mb-6" style={{ color: "#6B7280" }}>
            Last updated: January 2025
          </CaptionText>

          <Section title="1. Overview">
            ThriftVerse is a peer-to-peer marketplace for pre-loved items. As
            such, our refund policy is designed to protect both buyers and
            sellers while ensuring fair transactions.
          </Section>

          <Section title="2. Eligibility for Refunds">
            You may be eligible for a refund if:{"\n\n"}
            • Item not received within the estimated delivery time{"\n"}
            • Item significantly differs from the description{"\n"}
            • Item is damaged during shipping{"\n"}
            • Item is counterfeit or misrepresented{"\n"}
            • Wrong item was shipped
          </Section>

          <Section title="3. Non-Refundable Situations">
            Refunds are not available for:{"\n\n"}
            • Change of mind after purchase{"\n"}
            • Minor variations in color due to screen differences{"\n"}
            • Normal wear and tear as described in the listing{"\n"}
            • Items marked as "final sale"{"\n"}
            • Dissatisfaction with fit (for clothing items)
          </Section>

          <Section title="4. Refund Request Process">
            To request a refund:{"\n\n"}
            1. Contact the seller within 3 days of receiving the item{"\n"}
            2. Provide clear photos showing the issue{"\n"}
            3. Explain the problem in detail{"\n"}
            4. Allow the seller 48 hours to respond{"\n"}
            5. If unresolved, contact ThriftVerse support
          </Section>

          <Section title="5. Seller Responsibilities">
            Sellers are expected to:{"\n\n"}
            • Accurately describe all items{"\n"}
            • Disclose any defects or damage{"\n"}
            • Ship items securely and on time{"\n"}
            • Respond to buyer inquiries promptly{"\n"}
            • Accept returns for valid reasons
          </Section>

          <Section title="6. Return Shipping">
            If a return is approved:{"\n\n"}
            • Seller error: Seller pays return shipping{"\n"}
            • Buyer error: Buyer pays return shipping{"\n"}
            • Damaged in transit: ThriftVerse may cover shipping
          </Section>

          <Section title="7. Refund Timeline">
            Once a return is approved:{"\n\n"}
            • Return item within 7 days{"\n"}
            • Refund processed within 3-5 business days after seller receives
            the item{"\n"}
            • Funds returned to original payment method
          </Section>

          <Section title="8. Dispute Resolution">
            If you and the seller cannot reach an agreement, ThriftVerse will
            mediate the dispute. Our decision will be final and binding on both
            parties.
          </Section>

          <Section title="9. Fraud Prevention">
            ThriftVerse reserves the right to deny refund requests that appear
            fraudulent or that violate our terms of service. Repeated abuse of
            the refund policy may result in account suspension.
          </Section>

          <Section title="10. Contact Us">
            For refund-related questions, please contact us at
            support@thriftverse.shop with your order details.
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
      <BodyBoldText className="mb-2" style={{ color: "#3B2F2F", fontSize: 16 }}>
        {title}
      </BodyBoldText>
      <BodyRegularText className="leading-6" style={{ color: "#4B5563", fontSize: 14 }}>
        {children}
      </BodyRegularText>
    </View>
  );
}
