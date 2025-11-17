import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonLoader } from '@/components/atoms/SkeletonLoader';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      {/* Image skeleton */}
      <SkeletonLoader height={140} borderRadius={8} style={styles.image} />

      {/* Title skeleton */}
      <SkeletonLoader width="80%" height={16} style={styles.title} />

      {/* Store name skeleton */}
      <SkeletonLoader width="60%" height={12} style={styles.store} />

      {/* Price skeleton */}
      <SkeletonLoader width="40%" height={18} style={styles.price} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  image: {
    marginBottom: 8,
  },
  title: {
    marginBottom: 4,
  },
  store: {
    marginBottom: 8,
  },
  price: {
    marginTop: 4,
  },
});
