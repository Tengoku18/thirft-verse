import { CustomHeader } from "@/components/navigation/CustomHeader";
import { ProductForm } from "@/components/organisms/ProductForm";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types/database";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

export default function EditProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error loading product:", error);
        Alert.alert("Error", "Failed to load product.");
        router.back();
        return;
      }

      setProduct(data);
    } catch (error) {
      console.error("Error loading product:", error);
      Alert.alert("Error", "Failed to load product.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white">
        <CustomHeader title="Edit Product" showBackButton />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B2F2F" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <CustomHeader title="Edit Product" showBackButton />
      <ProductForm mode="edit" product={product} />
    </View>
  );
}
