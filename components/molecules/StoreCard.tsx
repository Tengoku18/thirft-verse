import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Profile } from '@/lib/types/database';
import { IconSymbol } from '@/components/ui/icon-symbol';

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
            <Text style={styles.bio} numberOfLines={1}>
              {store.bio}
            </Text>
          )}
        </View>

        {/* Arrow Icon */}
        <View style={styles.arrowContainer}>
          <IconSymbol name="chevron.right" size={18} color="#9CA3AF" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 10,
  },
  container: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
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
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 20,
    fontFamily: 'NunitoSans_700Bold',
    color: '#9CA3AF',
  },
  infoContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontFamily: 'NunitoSans_700Bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  username: {
    fontSize: 13,
    fontFamily: 'NunitoSans_500Medium',
    color: '#6B7280',
  },
  bio: {
    fontSize: 13,
    fontFamily: 'NunitoSans_400Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  arrowContainer: {
    padding: 4,
  },
});
