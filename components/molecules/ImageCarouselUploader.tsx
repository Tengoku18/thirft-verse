import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface ProductImage {
  uri: string;
  id: string;
}

interface ImageCarouselUploaderProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  maxImages?: number;
  error?: string;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_WIDTH = SCREEN_WIDTH - 48; // Full width minus padding

export const ImageCarouselUploader: React.FC<ImageCarouselUploaderProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  error,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const pickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to add product images.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: maxImages - images.length,
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          id: Math.random().toString(36).substr(2, 9),
        }));
        onImagesChange([...images, ...newImages]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images. Please try again.');
    }
  };

  const removeImage = (id: string) => {
    const newImages = images.filter((img) => img.id !== id);
    onImagesChange(newImages);
    if (activeIndex >= newImages.length && newImages.length > 0) {
      setActiveIndex(newImages.length - 1);
    }
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / IMAGE_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View className="mb-6">
      {/* Label */}
      <View className="flex-row items-center justify-between mb-3">
        <ThemedText
          className="text-[13px] font-[NunitoSans_600SemiBold] tracking-wide uppercase"
          style={{ color: '#3B2F2F' }}
        >
          Product Photos
        </ThemedText>
        <ThemedText
          className="text-[12px] font-[NunitoSans_600SemiBold]"
          style={{ color: images.length >= maxImages ? '#EF4444' : '#6B7280' }}
        >
          {images.length}/{maxImages}
        </ThemedText>
      </View>

      {/* Main Image Display / Upload Area */}
      <View
        style={{
          height: IMAGE_WIDTH,
          borderRadius: 24,
          overflow: 'hidden',
          marginBottom: 16,
        }}
      >
        {images.length === 0 ? (
          // Empty State - Large Upload Button
          <TouchableOpacity
            onPress={pickImages}
            style={{
              flex: 1,
              backgroundColor: '#FAFAFA',
              borderWidth: 3,
              borderStyle: 'dashed',
              borderColor: error ? '#EF4444' : '#E5E1DB',
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            activeOpacity={0.7}
          >
            <View className="items-center">
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#FFFFFF',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <IconSymbol name="photo.on.rectangle" size={40} color="#3B2F2F" />
              </View>
              <ThemedText
                className="text-[18px] font-[PlayfairDisplay_700Bold] mb-2"
                style={{ color: '#3B2F2F' }}
              >
                Add Product Photos
              </ThemedText>
              <ThemedText
                className="text-[14px] font-[NunitoSans_400Regular] text-center px-8"
                style={{ color: '#6B7280' }}
              >
                Upload up to {maxImages} high-quality images
              </ThemedText>
              <ThemedText
                className="text-[12px] font-[NunitoSans_400Regular] mt-2"
                style={{ color: '#9CA3AF' }}
              >
                First image will be the cover photo
              </ThemedText>
            </View>
          </TouchableOpacity>
        ) : (
          // Carousel Display
          <View style={{ flex: 1 }}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {images.map((image) => (
                <View
                  key={image.id}
                  style={{
                    width: IMAGE_WIDTH,
                    height: IMAGE_WIDTH,
                    position: 'relative',
                  }}
                >
                  <Image
                    source={{ uri: image.uri }}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 24,
                    }}
                    resizeMode="cover"
                  />
                  {/* Remove Button */}
                  <TouchableOpacity
                    onPress={() => removeImage(image.id)}
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                    }}
                    activeOpacity={0.8}
                  >
                    <IconSymbol name="trash" size={16} color="#EF4444" />
                  </TouchableOpacity>
                  {/* Cover Badge */}
                  {image.id === images[0].id && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 12,
                        backgroundColor: 'rgba(59, 47, 47, 0.9)',
                      }}
                    >
                      <ThemedText
                        className="text-[11px] font-[NunitoSans_700Bold] uppercase tracking-wider"
                        style={{ color: '#FFFFFF' }}
                      >
                        Cover Photo
                      </ThemedText>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            {/* Carousel Indicators */}
            <View
              style={{
                position: 'absolute',
                bottom: 16,
                left: 0,
                right: 0,
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              {images.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: index === activeIndex ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: index === activeIndex ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                  }}
                />
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Thumbnails & Add More Button */}
      {images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {images.map((image, index) => (
            <TouchableOpacity
              key={image.id}
              onPress={() => setActiveIndex(index)}
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                overflow: 'hidden',
                borderWidth: 3,
                borderColor: activeIndex === index ? '#3B2F2F' : '#E5E7EB',
              }}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: image.uri }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}

          {/* Add More Button */}
          {images.length < maxImages && (
            <TouchableOpacity
              onPress={pickImages}
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                backgroundColor: '#FAFAFA',
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: '#E5E1DB',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={0.7}
            >
              <IconSymbol name="plus" size={20} color="#3B2F2F" />
              <ThemedText
                className="text-[9px] font-[NunitoSans_600SemiBold] mt-1"
                style={{ color: '#6B7280' }}
              >
                Add More
              </ThemedText>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {/* Error Message */}
      {error && (
        <View className="mt-2">
          <ThemedText
            className="text-[12px] font-[NunitoSans_600SemiBold]"
            style={{ color: '#EF4444' }}
          >
            {error}
          </ThemedText>
        </View>
      )}

      {/* Helper Text */}
      {!error && images.length > 0 && (
        <View className="mt-2">
          <ThemedText
            className="text-[12px] font-[NunitoSans_400Regular]"
            style={{ color: '#6B7280' }}
          >
            Swipe to reorder images. First image is the cover photo.
          </ThemedText>
        </View>
      )}
    </View>
  );
};
