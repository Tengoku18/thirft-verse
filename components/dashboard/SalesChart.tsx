import {
  BodyMediumText,
  BodySemiboldText,
  HeadingBoldText,
} from "@/components/Typography";
import React from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface SalesChartProps {
  data: number[];
  labels: string[];
  title: string;
  totalAmount: number;
}

const screenWidth = Dimensions.get("window").width;

export const SalesChart: React.FC<SalesChartProps> = ({
  data,
  labels,
  title,
  totalAmount,
}) => {
  // Ensure we have at least some data
  const chartData = data.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0];
  const chartLabels = labels.length > 0 ? labels : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <View
      className="bg-white rounded-2xl p-4 mx-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <BodyMediumText style={{ color: "#6B7280", fontSize: 13 }}>
            {title}
          </BodyMediumText>
          <HeadingBoldText style={{ fontSize: 24, marginTop: 4 }}>
            Rs. {totalAmount.toLocaleString()}
          </HeadingBoldText>
        </View>
        <View
          className="px-3 py-1.5 rounded-full"
          style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
        >
          <BodySemiboldText style={{ color: "#3B82F6", fontSize: 12 }}>
            This Week
          </BodySemiboldText>
        </View>
      </View>

      <LineChart
        data={{
          labels: chartLabels,
          datasets: [
            {
              data: chartData,
              color: (opacity = 1) => `rgba(59, 47, 47, ${opacity})`,
              strokeWidth: 2,
            },
          ],
        }}
        width={screenWidth - 64}
        height={180}
        yAxisLabel="Rs."
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: "#FFFFFF",
          backgroundGradientFrom: "#FFFFFF",
          backgroundGradientTo: "#FFFFFF",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(59, 47, 47, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#3B2F2F",
          },
          propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: "#F3F4F6",
            strokeWidth: 1,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
          marginLeft: -16,
        }}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={true}
      />
    </View>
  );
};
