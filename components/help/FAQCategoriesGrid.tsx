import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";
import { FAQCategoryCard } from "./FAQCategoryCard";

interface FAQCategory {
  id: string;
  icon: string;
  title: string;
  onPress?: () => void;
}

interface FAQCategoriesGridProps {
  categories: FAQCategory[];
}

export function FAQCategoriesGrid({ categories }: FAQCategoriesGridProps) {
  return (
    <View className="px-4 py-2">
      <Typography
        variation="h4"
        className="text-brand-espresso font-folito-bold mb-4 px-1"
      >
        FAQ Categories
      </Typography>

      <View className="gap-3">
        {/* First row: 2 columns */}
        <View className="flex-row gap-3">
          {categories.slice(0, 2).map((category) => (
            <View key={category.id} className="flex-1">
              <FAQCategoryCard
                icon={category.icon}
                title={category.title}
                onPress={category.onPress}
              />
            </View>
          ))}
        </View>

        {/* Second row: 2 columns */}
        {categories.length > 2 && (
          <View className="flex-row gap-3">
            {categories.slice(2, 4).map((category) => (
              <View key={category.id} className="flex-1">
                <FAQCategoryCard
                  icon={category.icon}
                  title={category.title}
                  onPress={category.onPress}
                />
              </View>
            ))}
          </View>
        )}

        {/* Full width row if 5th item exists */}
        {categories.length > 4 && (
          <FAQCategoryCard
            icon={categories[4].icon}
            title={categories[4].title}
            onPress={categories[4].onPress}
            fullWidth
          />
        )}
      </View>
    </View>
  );
}
