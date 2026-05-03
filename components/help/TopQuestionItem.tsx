import RightArrowIcon from "@/components/icons/RightArrowIcon";
import { Typography } from "@/components/ui/Typography";
import React from "react";
import { LayoutAnimation, Pressable, View } from "react-native";

interface TopQuestionItemProps {
  question: string;
  answer?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function TopQuestionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: TopQuestionItemProps) {
  return (
    <Pressable
      onPress={onToggle}
      className="bg-white rounded-2xl border border-brand-beige overflow-hidden active:opacity-80"
      style={{
        shadowColor: "#3B3030",
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
      }}
    >
      {/* Question row */}
      <View className="flex-row items-center px-4 py-4 gap-3">
        <Typography
          variation="body-sm"
          className="text-brand-espresso font-sans-semibold flex-1"
        >
          {question}
        </Typography>
        <View
          style={{
            transform: [{ rotate: isOpen ? "90deg" : "0deg" }],
          }}
        >
          <RightArrowIcon width={18} height={18} color={isOpen ? "#D4A373" : "#9CA3AF"} />
        </View>
      </View>

      {/* Answer */}
      {isOpen && answer && (
        <View className="px-4 pb-4">
          <View className="h-px w-full mb-3" style={{ backgroundColor: "#F3F4F6" }} />
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
