import {
  ContactSupportCard,
  FAQCategoriesGrid,
  HelpFooter,
  SocialLinksSection,
  TopQuestionsList,
} from "@/components/help";
import { ScreenLayout } from "@/components/layouts";
import { FAQ_CATEGORIES, TOP_QUESTIONS } from "@/constants/help-content";
import { WorkInProgressModal } from "@/components/molecules/WorkInProgressModal";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Linking, View } from "react-native";

const SUPPORT_EMAIL = process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? "";
const SUPPORT_PHONE = process.env.EXPO_PUBLIC_SUPPORT_PHONE ?? "";

const SOCIAL_LINKS = [
  {
    icon: "logo-instagram",
    url: "https://www.instagram.com/thriftverse.shop/",
    label: "Instagram",
  },
  {
    icon: "logo-linkedin",
    url: "https://www.linkedin.com/company/thriftverse-shop/",
    label: "LinkedIn",
  },
  {
    icon: "logo-facebook",
    url: "https://www.facebook.com/profile.php?id=61576514767983",
    label: "Facebook",
  },
];

function resolveAnswer(categoryId: string, questionId: string): string {
  const cat = FAQ_CATEGORIES.find((c) => c.id === categoryId);
  return cat?.items.find((i) => i.id === questionId)?.answer ?? "";
}

export default function HelpSupportScreen() {
  const router = useRouter();
  const [showWIP, setShowWIP] = useState(false);

  const handleCategoryPress = (categoryId: string) => {
    router.push({
      pathname: "/settings/faq-category",
      params: { id: categoryId },
    });
  };

  const handleQuestionPress = (categoryId: string, questionId: string) => {
    router.push({
      pathname: "/settings/faq-detail",
      params: { categoryId, questionId },
    });
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${SUPPORT_PHONE}`);
  };

  return (
    <ScreenLayout
      title="Help & Support"
      backgroundColor="#FAF7F2"
      contentBackgroundColor="#FAF7F2"
      headerBackgroundColor="#FAF7F2"
      paddingHorizontal={0}
    >
      {/* FAQ Categories */}
      <View className="pt-4">
        <FAQCategoriesGrid
          categories={FAQ_CATEGORIES.map((cat) => ({
            ...cat,
            onPress: () => handleCategoryPress(cat.id),
          }))}
        />
      </View>

      {/* Top Questions */}
      <TopQuestionsList
        questions={TOP_QUESTIONS.map((q) => ({
          id: q.id,
          question: q.question,
          answer: resolveAnswer(q.categoryId, q.questionId),
          onPress: () => handleQuestionPress(q.categoryId, q.questionId),
        }))}
      />

      {/* Contact Support */}
      <ContactSupportCard
        title="Still need help?"
        description="Our support team is available 24/7 to help you with any vintage treasures or troubles."
        primaryOption={{
          label: "Chat with Us",
          icon: "forum",
          onPress: () => setShowWIP(true),
        }}
        secondaryOptions={[
          {
            label: "Email",
            icon: "mail",
            onPress: handleEmail,
          },
          {
            label: "Call Us",
            icon: "call",
            onPress: handleCall,
          },
        ]}
      />

      {/* Social Links */}
      <SocialLinksSection links={SOCIAL_LINKS} />

      <HelpFooter />

      <WorkInProgressModal
        visible={showWIP}
        onClose={() => setShowWIP(false)}
        featureName="Live chat support"
      />
    </ScreenLayout>
  );
}
