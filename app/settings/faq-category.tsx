import {
  ChevronRightIcon,
  CreditCardIcon,
  HelpIcon,
  MailIcon,
  RocketIcon,
  ShopIcon,
  StorefrontFillIcon,
} from "@/components/icons";
import { ScreenLayout } from "@/components/layouts";
import { Typography } from "@/components/ui/Typography";
import { FAQ_CATEGORIES } from "@/constants/help-content";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  UIManager,
  View,
} from "react-native";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Mapping for custom icon names to SVG components
const ICON_MAPPING: Record<string, React.ReactNode> = {
  rocket_launch: <RocketIcon width={24} height={24} color="#6B705C" />,
  storefront: <StorefrontFillIcon width={24} height={24} color="#6B705C" />,
  payments: <CreditCardIcon width={24} height={24} color="#6B705C" />,
  shopping_cart: <ShopIcon width={24} height={24} color="#6B705C" />,
  email: <MailIcon width={24} height={24} color="#6B705C" />,
  support: <HelpIcon width={24} height={24} color="#6B705C" />,
};

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      className="bg-white rounded-2xl border border-brand-beige overflow-hidden"
      style={{
        shadowColor: "#3B3030",
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
      }}
    >
      {/* Question row */}
      <View className="flex-row items-center justify-between px-4 py-4 gap-3">
        <Typography
          variation="body-sm"
          className="font-sans-semibold text-brand-espresso flex-1"
        >
          {question}
        </Typography>
        <View
          style={{
            transform: [{ rotate: isOpen ? "90deg" : "0deg" }],
          }}
        >
          <ChevronRightIcon width={18} height={18} color="#9CA3AF" />
        </View>
      </View>

      {/* Answer */}
      {isOpen && (
        <View className="px-4 pb-4 pt-1">
          <View
            className="h-px w-full mb-3"
            style={{ backgroundColor: "#F3F4F6" }}
          />
          <Typography
            variation="body-sm"
            className="text-ui-secondary"
            style={{ lineHeight: 22 }}
          >
            {answer}
          </Typography>
        </View>
      )}
    </Pressable>
  );
}

export default function FAQCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [openId, setOpenId] = useState<string | null>(null);

  const category = FAQ_CATEGORIES.find((c) => c.id === id);

  if (!category) return null;

  const handleToggle = (itemId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId((prev) => (prev === itemId ? null : itemId));
  };

  return (
    <ScreenLayout
      title={category.title}
      contentBackgroundColor="#F5F5F5"
      paddingHorizontal={0}
    >
      {/* Category header */}
      <View className="px-4 pt-6 pb-6">
        <View className="flex-row items-center gap-3 mb-3">
          <View
            className="w-12 h-12 rounded-2xl items-center justify-center"
            style={{ backgroundColor: "rgba(107, 112, 92, 0.12)" }}
          >
            {ICON_MAPPING[category.icon] || ICON_MAPPING["support"]}
          </View>
          <Typography
            variation="h4"
            className="text-brand-espresso font-folito-bold flex-1"
          >
            {category.title}
          </Typography>
        </View>
        <Typography variation="body-sm" className="text-ui-secondary">
          {category.description}
        </Typography>
      </View>

      {/* Accordion Q&As */}
      <View className="px-4 gap-3 pb-8">
        {category.items.map((item) => (
          <AccordionItem
            key={item.id}
            question={item.question}
            answer={item.answer}
            isOpen={openId === item.id}
            onToggle={() => handleToggle(item.id)}
          />
        ))}
      </View>
    </ScreenLayout>
  );
}
