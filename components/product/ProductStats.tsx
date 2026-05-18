import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

interface Props {
  availabilityCount: number;
  category: string;
}

export function ProductStats({ availabilityCount, category }: Props) {
  return (
    <View className="flex-row gap-3">
      <Card variant="outlined" className="flex-1">
        <Typography
          variation="caption"
          className="text-ui-secondary uppercase tracking-widest font-sans-bold mb-1"
        >
          Stock Level
        </Typography>
        <Typography variation="h4" className="text-amber-700">
          {availabilityCount} items left
        </Typography>
      </Card>
      <Card variant="outlined" className="flex-1">
        <Typography
          variation="caption"
          className="text-ui-secondary uppercase tracking-widest font-sans-bold mb-1"
        >
          Category
        </Typography>
        <Typography
          variation="h4"
          className="text-brand-espresso"
          numberOfLines={1}
        >
          {category}
        </Typography>
      </Card>
    </View>
  );
}
