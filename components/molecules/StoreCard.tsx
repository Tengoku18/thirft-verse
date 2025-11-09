import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Profile } from '@/lib/types/database';

interface StoreCardProps {
  store: Profile;
  onPress?: () => void;
}

export default function StoreCard({ store, onPress }: StoreCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/store/${store.id}`);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.container}>
        {/* Store Image */}
        <View style={styles.imageContainer}>
          {store.profile_image ? (
            <Image source={{ uri: store.profile_image }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>{store.name.charAt(0).toUpperCase()}</Text>
            </View>
          )}
        </View>

        {/* Store Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {store.name}
          </Text>
          <Text style={styles.username} numberOfLines={1}>
            @{store.store_username}
          </Text>
          {store.bio && (
            <Text style={styles.bio} numberOfLines={2}>
              {store.bio}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  container: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6B7280',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  username: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  bio: {
    fontSize: 12,
    color: '#888888',
    lineHeight: 16,
  },
});
