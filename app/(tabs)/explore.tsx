import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ThemedText } from '@/components/themed-text';
import { FormButton } from '@/components/atoms/FormButton';
import { ImageCarouselUploader } from '@/components/molecules/ImageCarouselUploader';
import { useAuth } from '@/contexts/AuthContext';
import { productSchema, ProductFormData } from '@/lib/validations/product';

interface ProductImage {
  uri: string;
  id: string;
}

const CATEGORIES = [
  'Clothing',
  'Shoes',
  'Accessories',
  'Bags',
  'Jewelry',
  'Home & Decor',
  'Electronics',
  'Books',
  'Other',
];

export default function ListProductScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: undefined,
      category: 'Clothing',
      availability_count: 1,
      images: [],
    },
  });

  const selectedCategory = watch('category');
  const images = watch('images');

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);

    try {
      // TODO: Upload images to Supabase Storage
      // TODO: Create product record in database

      console.log('Creating product:', {
        ...data,
        userId: user?.id,
      });

      Alert.alert(
        'Success!',
        'Your product has been listed successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              reset();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error creating product:', error);
      Alert.alert('Error', 'Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      {/* Header Nav Bar */}
      <View className="px-6 pt-16 pb-6 border-b border-[#F3F4F6]">
        <View className="items-center">
          <ThemedText
            className="text-[24px] font-[PlayfairDisplay_700Bold]"
            style={{ color: '#3B2F2F' }}
          >
            New Listing
          </ThemedText>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6 pt-6 pb-8">

          {/* Image Uploader */}
          <Controller
            control={control}
            name="images"
            render={({ field: { value, onChange } }) => (
              <ImageCarouselUploader
                images={value}
                onImagesChange={onChange}
                maxImages={5}
                error={errors.images?.message}
              />
            )}
          />

          {/* Title */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <ThemedText
                className="text-[13px] font-[NunitoSans_600SemiBold] tracking-wide uppercase"
                style={{ color: '#3B2F2F' }}
              >
                Title *
              </ThemedText>
              <Controller
                control={control}
                name="title"
                render={({ field: { value } }) => (
                  <ThemedText
                    className="text-[12px] font-[NunitoSans_400Regular]"
                    style={{ color: value.length > 80 ? '#EF4444' : '#9CA3AF' }}
                  >
                    {value.length}/100
                  </ThemedText>
                )}
              />
            </View>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="e.g., Vintage Denim Jacket"
                  placeholderTextColor="#9CA3AF"
                  className="h-[58px] px-4 rounded-2xl text-[15px] font-[NunitoSans_400Regular]"
                  style={{
                    color: '#3B2F2F',
                    backgroundColor: '#FAFAFA',
                    borderWidth: 2,
                    borderColor: errors.title ? '#EF4444' : 'transparent',
                  }}
                  maxLength={100}
                />
              )}
            />
            {errors.title && (
              <ThemedText
                className="text-[12px] font-[NunitoSans_600SemiBold] mt-2"
                style={{ color: '#EF4444' }}
              >
                {errors.title.message}
              </ThemedText>
            )}
          </View>

          {/* Description */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <ThemedText
                className="text-[13px] font-[NunitoSans_600SemiBold] tracking-wide uppercase"
                style={{ color: '#3B2F2F' }}
              >
                Description *
              </ThemedText>
              <Controller
                control={control}
                name="description"
                render={({ field: { value } }) => (
                  <ThemedText
                    className="text-[12px] font-[NunitoSans_400Regular]"
                    style={{ color: value.length > 800 ? '#EF4444' : '#9CA3AF' }}
                  >
                    {value.length}/1000
                  </ThemedText>
                )}
              />
            </View>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Describe the condition, style, measurements, and unique features..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  className="min-h-[140px] px-4 py-4 rounded-2xl text-[15px] font-[NunitoSans_400Regular]"
                  style={{
                    color: '#3B2F2F',
                    backgroundColor: '#FAFAFA',
                    borderWidth: 2,
                    borderColor: errors.description ? '#EF4444' : 'transparent',
                  }}
                  maxLength={1000}
                />
              )}
            />
            {errors.description && (
              <ThemedText
                className="text-[12px] font-[NunitoSans_600SemiBold] mt-2"
                style={{ color: '#EF4444' }}
              >
                {errors.description.message}
              </ThemedText>
            )}
          </View>

          {/* Price & Availability Row */}
          <View className="flex-row gap-3 mb-6">
            {/* Price */}
            <View className="flex-1">
              <ThemedText
                className="text-[13px] font-[NunitoSans_600SemiBold] mb-3 tracking-wide uppercase"
                style={{ color: '#3B2F2F' }}
              >
                Price (NPR) *
              </ThemedText>
              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value?.toString() || ''}
                    onChangeText={(text) => {
                      const numValue = text.replace(/[^0-9.]/g, '');
                      onChange(numValue ? parseFloat(numValue) : undefined);
                    }}
                    onBlur={onBlur}
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="decimal-pad"
                    className="h-[58px] px-4 rounded-2xl text-[15px] font-[NunitoSans_600SemiBold]"
                    style={{
                      color: '#3B2F2F',
                      backgroundColor: '#FAFAFA',
                      borderWidth: 2,
                      borderColor: errors.price ? '#EF4444' : 'transparent',
                    }}
                  />
                )}
              />
              {errors.price && (
                <ThemedText
                  className="text-[11px] font-[NunitoSans_600SemiBold] mt-2"
                  style={{ color: '#EF4444' }}
                >
                  {errors.price.message}
                </ThemedText>
              )}
            </View>

            {/* Availability Count */}
            <View className="flex-1">
              <ThemedText
                className="text-[13px] font-[NunitoSans_600SemiBold] mb-3 tracking-wide uppercase"
                style={{ color: '#3B2F2F' }}
              >
                Quantity *
              </ThemedText>
              <Controller
                control={control}
                name="availability_count"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value?.toString() || ''}
                    onChangeText={(text) => {
                      const numValue = text.replace(/[^0-9]/g, '');
                      onChange(numValue ? parseInt(numValue, 10) : undefined);
                    }}
                    onBlur={onBlur}
                    placeholder="1"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    className="h-[58px] px-4 rounded-2xl text-[15px] font-[NunitoSans_600SemiBold]"
                    style={{
                      color: '#3B2F2F',
                      backgroundColor: '#FAFAFA',
                      borderWidth: 2,
                      borderColor: errors.availability_count ? '#EF4444' : 'transparent',
                    }}
                  />
                )}
              />
              {errors.availability_count && (
                <ThemedText
                  className="text-[11px] font-[NunitoSans_600SemiBold] mt-2"
                  style={{ color: '#EF4444' }}
                >
                  {errors.availability_count.message}
                </ThemedText>
              )}
            </View>
          </View>

          {/* Category */}
          <View className="mb-8">
            <ThemedText
              className="text-[13px] font-[NunitoSans_600SemiBold] mb-3 tracking-wide uppercase"
              style={{ color: '#3B2F2F' }}
            >
              Category *
            </ThemedText>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => onChange(cat)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 14,
                        backgroundColor: value === cat ? '#3B2F2F' : '#FAFAFA',
                        borderWidth: 2,
                        borderColor: value === cat ? '#3B2F2F' : '#E5E1DB',
                      }}
                      activeOpacity={0.7}
                    >
                      <ThemedText
                        className="text-[13px] font-[NunitoSans_700Bold]"
                        style={{ color: value === cat ? '#FFFFFF' : '#3B2F2F' }}
                      >
                        {cat}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
            {errors.category && (
              <ThemedText
                className="text-[12px] font-[NunitoSans_600SemiBold] mt-2"
                style={{ color: '#EF4444' }}
              >
                {errors.category.message}
              </ThemedText>
            )}
          </View>

          {/* Submit Button */}
          <View className="mb-4">
            <FormButton
              title="List Product"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              variant="primary"
            />
          </View>

          {/* Helper Text */}
          <View className="items-center mb-8">
            <ThemedText
              className="text-[12px] font-[NunitoSans_400Regular] text-center leading-relaxed"
              style={{ color: '#9CA3AF' }}
            >
              By listing, you agree to our Terms of Service{'\n'}
              and Community Guidelines
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
