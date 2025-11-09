import React from 'react';
import { View, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Product } from '@/lib/types/database';
import { getProductImageUrl } from '@/lib/storage-helpers';

interface ProductGridProps {
  products: Product[];
  onProductPress?: (product: Product) => void;
  numColumns?: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SPACING = 1; // Minimal space between items (Instagram style)

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductPress,
  numColumns = 3,
}) => {
  // Calculate item size to fit exactly 3 columns with minimal spacing (Instagram style)
  const itemSize = (SCREEN_WIDTH - SPACING * (numColumns - 1)) / numColumns;

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      onPress={() => onProductPress?.(item)}
      style={{
        width: itemSize,
        height: itemSize,
        position: 'relative',
      }}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: getProductImageUrl(item.cover_image) }}
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover"
      />

      {/* Sold overlay - Semi-transparent with checkmark */}
      {item.status === 'out_of_stock' && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(59, 47, 47, 0.75)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#FFFFFF',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <ThemedText className="text-2xl">✓</ThemedText>
          </View>
          <ThemedText
            className="text-xs font-[NunitoSans_700Bold] uppercase tracking-wider"
            style={{ color: '#FFFFFF' }}
          >
            Sold
          </ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      scrollEnabled={false}
      contentContainerStyle={{
        paddingHorizontal: 0,
      }}
      columnWrapperStyle={{
        gap: SPACING,
        marginBottom: SPACING,
      }}
    />
  );
};
