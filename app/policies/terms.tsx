import { AuthScreenLayout } from "@/components/layouts/AuthScreenLayout";
import { Typography } from "@/components/ui/Typography/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { Linking, Pressable, ScrollView, View } from "react-native";

export default function TermsScreen() {
  return (
    <AuthScreenLayout
      showHeader
      headerTitle="Terms & Conditions"
      headerAlignment="center"
      backgroundColor="#FAF7F2"
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
              Welcome to ThriftVerse. These Terms and Conditions govern your use
              of our mobile application and services. By accessing or using
              ThriftVerse, you accept and agree to be bound by these terms.
            </Typography>
          </View>

          <Typography variation="caption" className="mb-8 text-slate-400">
            LAST UPDATED: DECEMBER 2025
          </Typography>

          {/* 1. Acceptance of Terms */}
          <SectionWithIcon title="1. Acceptance of Terms" icon="checkmark.circle">
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              By accessing and using Thriftverse, you accept and agree to be bound
              by these Terms of Service. If you do not agree to these terms,
              please do not use our platform.
            </Typography>
          </SectionWithIcon>

          {/* 2. Description of Service */}
          <SectionWithIcon
            title="2. Description of Service"
            icon="square.grid.2x2"
          >
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              Thriftverse provides a platform that enables users to create and
              manage their own thrift stores with unique subdomain URLs. We
              facilitate e-commerce transactions between sellers and buyers
              through integration with eSewa payment gateway.
            </Typography>
          </SectionWithIcon>

          {/* 3. Product Categories */}
          <SectionWithIcon title="3. Product Categories" icon="tag">
            <Typography
              variation="body-sm"
              className="leading-6 mb-3 text-slate-600"
            >
              Thriftverse is a marketplace specializing in pre-owned, vintage,
              and secondhand goods. Our platform supports the sale of products
              within the following categories:
            </Typography>

            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              • Clothing — Apparel items including tops, bottoms, dresses,
              outerwear, and other wearable garments{"\n"}• Shoes — Footwear of
              all types including casual, formal, athletic, and specialty shoes
              {"\n"}• Accessories — Fashion accessories such as belts, scarves,
              hats, sunglasses, and similar items{"\n"}• Bags — Handbags,
              backpacks, purses, wallets, and other carrying accessories{"\n"}•
              Jewelry — Costume and fashion jewelry including necklaces,
              bracelets, earrings, and rings{"\n"}• Home & Decor — Household
              items, decorative pieces, furniture, and home accessories{"\n"}•
              Electronics — Consumer electronics, gadgets, and related
              accessories{"\n"}• Books — Printed books, textbooks, magazines,
              and other reading materials{"\n"}• Other — Miscellaneous items
              complying with our policies
            </Typography>

            <Typography
              variation="body-sm"
              className="leading-6 mt-3 text-slate-600"
            >
              All products must be authentic, accurately described, and comply
              with our Prohibited Items policy.
            </Typography>
          </SectionWithIcon>

          {/* 4. User Accounts */}
          <SectionWithIcon title="4. User Accounts" icon="person.circle">
            <View className="mb-4">
              <Typography
                variation="body-sm"
                className="font-semibold text-slate-800 mb-2"
              >
                Account Creation
              </Typography>
              <Typography
                variation="body-sm"
                className="leading-6 text-slate-600"
              >
                • You must be at least 18 years old to create an account{"\n"}•
                You must provide accurate and complete information{"\n"}• You
                are responsible for maintaining account security{"\n"}• You are
                responsible for all activities under your account
              </Typography>
            </View>

            <View>
              <Typography
                variation="body-sm"
                className="font-semibold text-slate-800 mb-2"
              >
                Account Termination
              </Typography>
              <Typography
                variation="body-sm"
                className="leading-6 text-slate-600"
              >
                We reserve the right to suspend or terminate accounts that
                violate these terms, engage in fraudulent activity, or for any
                other reason at our discretion.
              </Typography>
            </View>
          </SectionWithIcon>

          {/* 5. Seller Responsibilities */}
          <SectionWithIcon title="5. Seller Responsibilities" icon="storefront">
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              As a seller on Thriftverse, you agree to:
            </Typography>

            <Typography
              variation="body-sm"
              className="leading-6 mt-3 text-slate-600"
            >
              • Provide accurate descriptions and photos of items for sale{"\n"}
              • Honor all sales and fulfill orders in a timely manner{"\n"}•
              Handle shipping and delivery to customers{"\n"}• Comply with all
              applicable laws and regulations{"\n"}• Not sell prohibited,
              illegal, or counterfeit items{"\n"}• Be responsible for customer
              service and dispute resolution{"\n"}• Maintain accurate inventory
              and pricing
            </Typography>
          </SectionWithIcon>

          {/* 6. Prohibited Items */}
          <SectionWithIcon title="6. Prohibited Items" icon="xmark.circle">
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              The following items are prohibited from being sold on Thriftverse:
            </Typography>

            <Typography
              variation="body-sm"
              className="leading-6 mt-3 text-slate-600"
            >
              • Illegal drugs, weapons, or controlled substances{"\n"}•
              Counterfeit or replica items{"\n"}• Stolen goods{"\n"}• Items that
              infringe on intellectual property rights{"\n"}• Adult content or
              services{"\n"}• Live animals{"\n"}• Hazardous materials
            </Typography>
          </SectionWithIcon>

          {/* 7. Payments and Fees */}
          <SectionWithIcon title="7. Payments and Fees" icon="creditcard">
            <View className="mb-4">
              <Typography
                variation="body-sm"
                className="font-semibold text-slate-800 mb-2"
              >
                Subscription Fees
              </Typography>
              <Typography
                variation="body-sm"
                className="leading-6 text-slate-600"
              >
                Subscription fees for Pro and Enterprise plans are billed
                monthly or annually. Fees are non-refundable except as required
                by law.
              </Typography>
            </View>

            <View className="mb-4">
              <Typography
                variation="body-sm"
                className="font-semibold text-slate-800 mb-2"
              >
                Transaction Processing
              </Typography>
              <Typography
                variation="body-sm"
                className="leading-6 text-slate-600"
              >
                All customer payments are processed through eSewa. Thriftverse
                does not take commission on sales, but standard eSewa payment
                gateway fees apply (typically 2-3% per transaction).
              </Typography>
            </View>

            <View>
              <Typography
                variation="body-sm"
                className="font-semibold text-slate-800 mb-2"
              >
                Taxes
              </Typography>
              <Typography
                variation="body-sm"
                className="leading-6 text-slate-600"
              >
                Sellers are responsible for determining and paying all
                applicable taxes on their sales. Thriftverse is not responsible
                for tax compliance.
              </Typography>
            </View>
          </SectionWithIcon>

          {/* 8. Intellectual Property */}
          <SectionWithIcon title="8. Intellectual Property" icon="lock.circle">
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              You retain ownership of content you upload to Thriftverse. By
              uploading content, you grant us a license to display, store, and
              distribute it as necessary to provide our services. You represent
              that you have all necessary rights to the content you upload.
            </Typography>
          </SectionWithIcon>

          {/* 9. Disputes */}
          <SectionWithIcon title="9. Disputes" icon="exclamationmark.triangle">
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              Disputes between buyers and sellers should be resolved directly
              between the parties. Thriftverse may assist in dispute resolution
              but is not obligated to do so. We reserve the right to suspend
              accounts involved in disputes until resolution.
            </Typography>
          </SectionWithIcon>

          {/* 10. Limitation of Liability */}
          <SectionWithIcon title="10. Limitation of Liability" icon="scale.3d">
            <Typography
              variation="body-sm"
              className="leading-6 mb-3 text-slate-600"
            >
              Thriftverse provides the platform &quot;as is&quot; without
              warranties of any kind. We are not liable for:
            </Typography>

            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              • Disputes between buyers and sellers{"\n"}• Quality or accuracy
              of product listings{"\n"}• Shipping delays or issues{"\n"}•
              Payment processing errors{"\n"}• Loss of data or business
              interruption
            </Typography>

            <Typography
              variation="body-sm"
              className="leading-6 mt-3 text-slate-600"
            >
              Our total liability shall not exceed the fees paid by you in the
              past 12 months.
            </Typography>
          </SectionWithIcon>

          {/* 11. Indemnification */}
          <SectionWithIcon title="11. Indemnification" icon="shield">
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              You agree to indemnify and hold Thriftverse harmless from any
              claims, damages, or expenses arising from your use of the platform,
              your violation of these terms, or your violation of any rights of
              others.
            </Typography>
          </SectionWithIcon>

          {/* 12. Changes to Terms */}
          <SectionWithIcon title="12. Changes to Terms" icon="pencil.circle">
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              We may modify these terms at any time. We will notify users of
              significant changes via email. Continued use of Thriftverse after
              changes constitutes acceptance of the new terms.
            </Typography>
          </SectionWithIcon>

          {/* 13. Governing Law */}
          <SectionWithIcon title="13. Governing Law" icon="building.2">
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600"
            >
              These terms are governed by the laws of Nepal. Any disputes shall
              be resolved in the courts of Butwal, Nepal.
            </Typography>
          </SectionWithIcon>

          {/* 14. Contact Information */}
          <SectionWithIcon title="14. Contact Information" icon="envelope">
            <Typography
              variation="body-sm"
              className="leading-6 text-slate-600 mb-3"
            >
              For questions about these terms, contact us at:
            </Typography>

            <Pressable
              onPress={() =>
                Linking.openURL("mailto:thriftverse.shop@gmail.com")
              }
              className="flex-row items-center gap-2 bg-slate-50 p-4 rounded-lg"
            >
              <IconSymbol name="envelope.fill" size={16} color="#3B2F2F" />
              <Typography variation="body-sm" className="text-slate-800">
                thriftverse.shop@gmail.com
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
        <IconSymbol name={icon} size={24} color="#3B2F2F" />
        <Typography variation="h4" className="font-sans-bold text-slate-800">
          {title}
        </Typography>
      </View>
      <View style={{ marginLeft: 36 }}>{children}</View>
    </View>
  );
}
