import React from 'react';
import { View } from 'react-native';
import { ProductCreationForm } from '@/components/organisms/ProductCreationForm';

export default function ExploreScreen() {
  return (
    <View className="flex-1 bg-[#FAF7F2]">
      <ProductCreationForm />
    </View>
  );
}
