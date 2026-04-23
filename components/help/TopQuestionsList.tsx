import { Typography } from "@/components/ui/Typography";
import React, { useState } from "react";
import { LayoutAnimation, Platform, UIManager, View } from "react-native";
import { TopQuestionItem } from "./TopQuestionItem";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TopQuestion {
  id: string;
  question: string;
  answer?: string;
  onPress?: () => void;
}

interface TopQuestionsListProps {
  questions: TopQuestion[];
}

export function TopQuestionsList({ questions }: TopQuestionsListProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <View className="px-4 py-8">
      <Typography
        variation="h4"
        className="text-brand-espresso font-folito-bold mb-4 px-1"
      >
        Top Questions
      </Typography>
      <View className="gap-3">
        {questions.map((item) => (
          <TopQuestionItem
            key={item.id}
            question={item.question}
            answer={item.answer}
            isOpen={openId === item.id}
            onToggle={() => handleToggle(item.id)}
          />
        ))}
      </View>
    </View>
  );
}
