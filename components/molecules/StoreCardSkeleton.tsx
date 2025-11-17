import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SkeletonLoader } from '@/components/atoms/SkeletonLoader';

export const StoreCardSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        {/* Avatar skeleton */}
        <SkeletonLoader width={50} height={50} borderRadius={25} style={styles.avatar} />

        <View style={styles.info}>
          {/* Store name skeleton */}
          <SkeletonLoader width="70%" height={16} style={styles.name} />

          {/* Username skeleton */}
          <SkeletonLoader width="50%" height={12} style={styles.username} />

          {/* Product count skeleton */}
          <SkeletonLoader width="40%" height={12} style={styles.products} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    marginBottom: 4,
  },
  username: {
    marginBottom: 4,
  },
  products: {
    marginTop: 2,
  },
});
