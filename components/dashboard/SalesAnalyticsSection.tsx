import { BodyMediumText, BodySemiboldText } from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { SalesChart } from "./SalesChart";

interface SalesAnalyticsSectionProps {
  data: number[];
  labels: string[];
  totalAmount: number;
}

export const SalesAnalyticsSection: React.FC<SalesAnalyticsSectionProps> = ({
  data,
  labels,
  totalAmount,
}) => {
  const router = useRouter();

  return (
    <View className="mb-4">
      <View className="px-4 mb-3 flex-row items-center justify-between">
        <BodySemiboldText style={{ fontSize: 15 }}>
          Sales Analytics
        </BodySemiboldText>
        <TouchableOpacity
          onPress={() => router.push("/analytics")}
          className="flex-row items-center"
        >
          <BodyMediumText style={{ color: "#6B7280", fontSize: 13 }}>
            View All
          </BodyMediumText>
          <IconSymbol
            name="chevron.right"
            size={14}
            color="#6B7280"
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      </View>
      <SalesChart
        data={data}
        labels={labels}
        title="Weekly Revenue"
        totalAmount={totalAmount}
      />
    </View>
  );
};
