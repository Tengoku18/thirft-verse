import { renderSFSymbolIcon } from "@/lib/icon-mapper";
import { Typography } from "@/components/ui/Typography";
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
          {renderSFSymbolIcon(icon, { size: 24, color: iconColor })}
        </View>
        {badge !== undefined && badge > 0 && (
          <View
            className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full items-center justify-center px-1"
            style={{ backgroundColor: "#EF4444" }}
          >
            <Typography variation="body-sm" style={{ color: "#FFFFFF", fontSize: 10 }}>
              {badge > 99 ? "99+" : badge}
            </Typography>
          </View>
        )}
      </View>
      <Typography variation="body-sm"
        style={{ color: "#374151", fontSize: 12, textAlign: "center" }}
        numberOfLines={1}
      >
        {label}
      </Typography>
    </TouchableOpacity>
  );
};
