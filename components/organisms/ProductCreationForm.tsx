import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { FormPicker } from "@/components/atoms/FormPicker";
import { FormTextarea } from "@/components/atoms/FormTextarea";
import { FormMultipleImageUpload } from "@/components/molecules/FormMultipleImageUpload";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/contexts/AuthContext";
import { createProduct } from "@/lib/database-helpers";
import {
  PRODUCT_CATEGORIES,
  ProductFormData,
  productSchema,
} from "@/lib/validations/product";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, FieldError, useForm } from "react-hook-form";
import { Alert, ScrollView, View } from "react-native";
import { FormImageUpload } from "../atoms/FormImageUpload";

export const ProductCreationForm: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      availability_count: 1,
      cover_image: "",
      other_images: [] as string[],
    },
  });

  // Category options for picker
  const categoryOptions = PRODUCT_CATEGORIES.map((cat) => ({
    label: cat,
    value: cat,
  }));

  const onSubmit = async (data: ProductFormData) => {
    // Validate that user is logged in
    if (!user) {
      Alert.alert(
        "Authentication Required",
        "Please sign in to create a product."
      );
      return;
    }

    // Validate that cover image is uploaded (handled by schema, but double-check)
    if (!data.cover_image) {
      Alert.alert("Cover Image Required", "Please upload a cover image.");
      return;
    }

    setLoading(true);

    try {
      // Prepare product data - combine cover_image and other_images into images array

      const productData = {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        availability_count: data.availability_count,
        store_id: user.id,
        cover_image: data.cover_image,
        other_images: data.other_images,
      };

      // Call database helper
      const result = await createProduct(productData);

      if (result.success) {
        Alert.alert("Success!", "Your product has been listed successfully.", [
          {
            text: "OK",
            onPress: () => {
              // Reset form to default values
              reset();
              // Navigate to profile or home tab
              router.push("/(tabs)");
            },
          },
        ]);
      } else {
        // Handle specific error cases
        if (result.tableNotFound) {
          Alert.alert(
            "Setup Required",
            "The products table is not set up. Please contact support or check the database migration."
          );
        } else if (result.rlsError) {
          Alert.alert(
            "Permission Error",
            "There was a permission issue. Please try signing out and back in."
          );
        } else {
          const errorMessage =
            result.error &&
            typeof result.error === "object" &&
            "message" in result.error
              ? (result.error as { message: string }).message
              : "Failed to create product. Please try again.";
          Alert.alert("Error", errorMessage);
        }
      }
    } catch (error) {
      console.error("💥 Unexpected error creating product:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#FAF7F2]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View className="px-6 pt-6">
        {/* Header Section */}
        <View className="mb-8">
          <ThemedText
            className="text-[36px] font-[PlayfairDisplay_700Bold] leading-tight mb-2"
            style={{ color: "#3B2F2F" }}
          >
            List Your{"\n"}Product
          </ThemedText>
          <ThemedText
            className="text-[15px] font-[NunitoSans_400Regular] leading-relaxed"
            style={{ color: "#6B7280" }}
          >
            Share your pre-loved treasures with the ThriftVerse community
          </ThemedText>
        </View>

        {/* Image Upload Section */}
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <ThemedText
            className="text-[20px] font-[PlayfairDisplay_700Bold] mb-6"
            style={{ color: "#3B2F2F" }}
          >
            Product Images
          </ThemedText>

          {/* Cover Image */}
          <Controller
            control={control}
            name="cover_image"
            render={({ field: { onChange, value } }) => (
              <FormImageUpload
                label="Cover Image"
                value={value}
                onChange={onChange}
                error={errors.cover_image?.message}
                hint="Main product image (PNG, JPG, GIF up to 5MB)"
                required
                bucket="products"
                folder="products"
              />
            )}
          />

          {/* Additional Images */}
          <Controller
            control={control}
            name="other_images"
            render={({ field: { onChange, value } }) => (
              <FormMultipleImageUpload
                label="Additional Images"
                value={value || []}
                onChange={onChange}
                error={errors.other_images?.message}
                hint="Upload 1-4 additional product images (required)"
                maxImages={4}
                bucket="products"
                folder="products"
              />
            )}
          />
        </View>

        {/* Product Details Card */}
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <ThemedText
            className="text-[20px] font-[PlayfairDisplay_700Bold] mb-6"
            style={{ color: "#3B2F2F" }}
          >
            Product Details
          </ThemedText>

          {/* Title */}
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Product Title"
                placeholder="e.g., Vintage Denim Jacket"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.title?.message}
                autoCapitalize="words"
              />
            )}
          />

          {/* Description */}
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextarea
                label="Description"
                placeholder="Describe the condition, size, brand, and any unique features..."
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.description?.message}
                maxLength={1000}
              />
            )}
          />

          {/* Category */}
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <FormPicker
                label="Category"
                placeholder="Select a category"
                value={value}
                onChange={onChange}
                options={categoryOptions}
                error={errors.category?.message}
              />
            )}
          />

          {/* Price & Availability Row */}
          <View className="flex-row gap-4">
            {/* Price */}
            <View className="flex-1">
              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Price (NPR)"
                    placeholder="0"
                    value={value?.toString()}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      const numValue = parseFloat(text) || 0;
                      onChange(numValue);
                    }}
                    error={errors.price?.message}
                    keyboardType="decimal-pad"
                  />
                )}
              />
            </View>

            {/* Availability Count */}
            <View className="flex-1">
              <Controller
                control={control}
                name="availability_count"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Quantity"
                    placeholder="1"
                    value={value?.toString()}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      const numValue = parseInt(text) || 1;
                      onChange(numValue);
                    }}
                    error={errors.availability_count?.message}
                    keyboardType="number-pad"
                  />
                )}
              />
            </View>
          </View>
        </View>

        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
          <View className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6">
            <ThemedText
              className="text-[14px] font-[NunitoSans_600SemiBold] mb-2"
              style={{ color: "#EF4444" }}
            >
              Please fix the following errors:
            </ThemedText>
            {Object.entries(errors).map(([field, error]) => (
              <ThemedText
                key={field}
                className="text-[13px] font-[NunitoSans_400Regular]"
                style={{ color: "#DC2626" }}
              >
                • {(error as FieldError)?.message}
              </ThemedText>
            ))}
          </View>
        )}

        {/* Submit Button */}
        <FormButton
          title={loading ? "Creating Product..." : "List Product"}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          variant="primary"
        />
      </View>
    </ScrollView>
  );
};
