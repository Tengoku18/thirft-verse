import {
  BodyMediumText,
  BodySemiboldText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onPress?: () => void;
}

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  iconBgColor,
  trend,
  onPress,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className="bg-white rounded-2xl p-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center"
          style={{ backgroundColor: iconBgColor }}
        >
          <IconSymbol name={icon as any} size={20} color={iconColor} />
        </View>
        {trend && (
          <View
            className="flex-row items-center px-2 py-1 rounded-full"
            style={{
              backgroundColor: trend.isPositive
                ? "rgba(34, 197, 94, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
            }}
          >
            <IconSymbol
              name={trend.isPositive ? "arrow.up.right" : "arrow.down.right"}
              size={10}
              color={trend.isPositive ? "#22C55E" : "#EF4444"}
            />
            <BodyMediumText
              style={{
                color: trend.isPositive ? "#22C55E" : "#EF4444",
                fontSize: 11,
                marginLeft: 2,
              }}
            >
              {trend.value}%
            </BodyMediumText>
          </View>
        )}
      </View>

      <HeadingBoldText style={{ fontSize: 24, marginBottom: 2 }}>
        {value}
      </HeadingBoldText>
      <View className="flex-row items-end space-x-2">
        <BodyMediumText style={{ color: "#6B7280", fontSize: 13 }}>
          {title}
        </BodyMediumText>
        {subtitle && (
          <BodySemiboldText
            style={{ color: "#9CA3AF", fontSize: 11, marginTop: 4 }}
          >
            {subtitle}
          </BodySemiboldText>
        )}
      </View>
    </Container>
  );
};
