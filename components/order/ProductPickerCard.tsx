import { Typography } from "@/components/ui/Typography/Typography";
import { getProductImageUrl } from "@/lib/storage-helpers";
import { Product } from "@/lib/types/database";
import React from "react";
import { Image, Pressable, TouchableOpacity, View } from "react-native";
import { AddPhotoIcon, CheckmarkIcon, MinusIcon, PlusIcon } from "@/components/icons";

interface ProductPickerCardProps {
  product: Product;
  selected: boolean;
  quantity: number;
  onPress: () => void;
  onQuantityChange: (delta: number) => void;
}

export function ProductPickerCard({
  product,
  selected,
  quantity,
  onPress,
  onQuantityChange,
}: ProductPickerCardProps) {
  const imageUri = product.cover_image
    ? getProductImageUrl(product.cover_image)
    : null;
  const isSoldOut = product.availability_count === 0;

  return (
    <View style={{ width: "50%" }} className="p-1.5">
      {/* Image — tap to select/deselect */}
      <Pressable onPress={onPress} style={{ borderRadius: 18 }}>
        {({ pressed }) => (
          <View
            className="rounded-[18px] overflow-hidden bg-primary/5 aspect-square"
            style={{ opacity: pressed ? 0.85 : 1 }}
          >
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <AddPhotoIcon width={32} height={32} color="#D1D5DB" />
              </View>
            )}

            {/* Sold out overlay */}
            {isSoldOut && (
              <View className="absolute inset-0 bg-black/30 items-center justify-center">
                <View className="bg-status-error px-2.5 py-1 rounded-md">
                  <Typography
                    variation="caption"
                    className="text-white font-sans-bold tracking-wide"
                  >
                    Sold Out
                  </Typography>
                </View>
              </View>
            )}

            {/* Checkbox — top right */}
            <View className="absolute top-2 right-2">
              {selected ? (
                <View
                  className="w-6 h-6 rounded-full items-center justify-center"
                  style={{ backgroundColor: "#3B2F2F" }}
                >
                  <CheckmarkIcon width={11} height={11} color="#FFFFFF" />
                </View>
              ) : (
                <View
                  className="w-6 h-6 rounded-full"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.75)",
                    borderWidth: 1.5,
                    borderColor: "rgba(255,255,255,0.9)",
                  }}
                />
              )}
            </View>
          </View>
        )}
      </Pressable>

      {/* Info — plain View, no parent touchable so stepper never conflicts */}
      <View className="px-0.5 pt-2 pb-1">
        <Typography
          variation="body-sm"
          numberOfLines={1}
          className="text-brand-espresso font-sans-medium"
        >
          {product.title}
        </Typography>

        <View className="flex-row items-center justify-between mt-1">
          <Typography
            variation="body-sm"
            className="text-brand-espresso font-sans-bold"
          >
            NPR {product.price.toLocaleString()}
          </Typography>

          {/* Quantity stepper — invisible but still takes space when not selected */}
          <View
            style={{ opacity: selected ? 1 : 0 }}
            pointerEvents={selected ? "auto" : "none"}
            className="flex-row items-center gap-1"
          >
            <TouchableOpacity
              onPress={() => onQuantityChange(-1)}
              activeOpacity={0.7}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              className="w-6 h-6 rounded-full items-center justify-center"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              <MinusIcon width={10} height={10} color="#3B2F2F" />
            </TouchableOpacity>

            <Typography
              variation="body-sm"
              className="text-brand-espresso font-sans-bold"
              style={{ minWidth: 18, textAlign: "center" }}
            >
              {quantity}
            </Typography>

            <TouchableOpacity
              onPress={() => onQuantityChange(1)}
              activeOpacity={0.7}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              className="w-6 h-6 rounded-full items-center justify-center"
              style={{ backgroundColor: "#3B2F2F" }}
            >
              <PlusIcon width={10} height={10} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
