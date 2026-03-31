import { Typography } from "@/components/ui/Typography/Typography";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface SellerTypeCardProps {
  isSelected: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const SellerTypeCard: React.FC<SellerTypeCardProps> = ({
  isSelected,
  onPress,
  icon,
  title,
  description,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`rounded-3xl py-8 pl-6 pr-20 mb-4 ${
        isSelected
          ? "bg-white border-2 border-brand-tan"
          : "bg-white border border-slate-200"
      }`}
    >
      {/* Icon - Top left */}
      <View className="p-4 bg-gray-100 rounded-full items-center justify-center mb-6 w-16 h-16">
        {icon}
      </View>

      {/* Content - Below icon */}
      <View>
        {/* Title */}
        <Typography
          variation="h3"
          className="font-sans-extrabold text-slate-900 mb-4"
        >
          {title}
        </Typography>

        {/* Description */}
        <Typography variation="body" className="text-slate-500 leading-relaxed">
          {description}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};
