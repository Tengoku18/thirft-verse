import { BodyMediumText } from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface QuickActionButtonProps {
  icon: string;
  label: string;
  iconColor: string;
  iconBgColor: string;
  onPress: () => void;
  badge?: number;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  label,
  iconColor,
  iconBgColor,
  onPress,
  badge,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="items-center"
      style={{ width: 72 }}
    >
      <View className="relative mb-2">
        <View
          className="w-14 h-14 rounded-2xl items-center justify-center"
          style={{ backgroundColor: iconBgColor }}
        >
          <IconSymbol name={icon as any} size={24} color={iconColor} />
        </View>
        {badge !== undefined && badge > 0 && (
          <View
            className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full items-center justify-center px-1"
            style={{ backgroundColor: "#EF4444" }}
          >
            <BodyMediumText style={{ color: "#FFFFFF", fontSize: 10 }}>
              {badge > 99 ? "99+" : badge}
            </BodyMediumText>
          </View>
        )}
      </View>
      <BodyMediumText
        style={{ color: "#374151", fontSize: 12, textAlign: "center" }}
        numberOfLines={1}
      >
        {label}
      </BodyMediumText>
    </TouchableOpacity>
  );
};
