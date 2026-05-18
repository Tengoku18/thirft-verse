import { AddPhotoIcon, CameraIcon, XIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

export interface ProductPhotoPickerProps {
  /** Display-ready cover image URI (local or resolved remote URL). */
  coverUri: string | null;
  /** Display-ready additional image URIs. */
  additionalUris: string[];
  /** Pick / replace the cover image. */
  onPickCover: () => void;
  onRemoveCover: () => void;
  /** Pick additional images. */
  onPickAdditional: () => void;
  onRemoveAdditional: (index: number) => void;
  maxAdditional?: number;
  coverError?: string;
}

/**
 * Cover photo + additional photos grid for the product edit form.
 * Presentational only — the parent owns the image state and upload logic.
 */
export function ProductPhotoPicker({
  coverUri,
  additionalUris,
  onPickCover,
  onRemoveCover,
  onPickAdditional,
  onRemoveAdditional,
  maxAdditional = 5,
  coverError,
}: ProductPhotoPickerProps) {
  return (
    <View>
      {/* Cover Photo */}
      <Typography
        variation="body-sm"
        className="mb-3"
        style={{ fontSize: 13, fontWeight: "600" }}
      >
        Cover Photo
      </Typography>
      <View
        style={{
          aspectRatio: 1.15,
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: "#E5E7EB",
          borderWidth: coverError ? 2 : 0,
          borderColor: coverError ? "#EF4444" : "transparent",
          flex: 1,
        }}
      >
        {coverUri ? (
          <View style={{ flex: 1, position: "relative" }}>
            <Image
              source={{ uri: coverUri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={onRemoveCover}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "rgba(59, 47, 47, 0.85)",
                justifyContent: "center",
                alignItems: "center",
              }}
              activeOpacity={0.8}
            >
              <XIcon width={16} height={16} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPickCover}
              style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
              }}
              activeOpacity={0.8}
            >
              <Typography
                variation="body-sm"
                style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "600" }}
              >
                Change Photo
              </Typography>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={onPickCover}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            activeOpacity={0.7}
          >
            <View className="items-center">
              <AddPhotoIcon width={48} height={48} color="#9CA3AF" />
              <Typography
                variation="body-sm"
                className="mt-3"
                style={{ color: "#6B7280", fontSize: 16, fontWeight: "600" }}
              >
                Tap to add cover photo
              </Typography>
            </View>
          </TouchableOpacity>
        )}
      </View>
      {coverError && (
        <Typography
          variation="caption"
          className="mt-2"
          style={{ color: "#EF4444", fontSize: 13 }}
        >
          {coverError}
        </Typography>
      )}

      {/* Additional Photos */}
      <View className="flex-row items-center justify-between my-3">
        <Typography
          variation="body-sm"
          style={{ fontSize: 13, fontWeight: "600" }}
        >
          Additional Photos
        </Typography>
        <Typography
          variation="body-sm"
          style={{
            color: additionalUris.length >= maxAdditional ? "#EF4444" : "#6B7280",
            fontSize: 12,
            fontWeight: "600",
          }}
        >
          {additionalUris.length}/{maxAdditional}
        </Typography>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 24,
        }}
      >
        {additionalUris.map((uri, index) => (
          <View
            key={index}
            style={{
              width: 90,
              height: 90,
              borderRadius: 10,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              source={{ uri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => onRemoveAdditional(index)}
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: "rgba(59, 47, 47, 0.85)",
                justifyContent: "center",
                alignItems: "center",
              }}
              activeOpacity={0.8}
            >
              <XIcon width={12} height={12} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ))}

        {additionalUris.length < maxAdditional && (
          <TouchableOpacity
            onPress={onPickAdditional}
            style={{
              width: 90,
              height: 90,
              borderRadius: 10,
              borderWidth: 2,
              borderStyle: "dashed",
              borderColor: "#D1D5DB",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#FAFAFA",
            }}
            activeOpacity={0.7}
          >
            <View className="items-center">
              <CameraIcon width={24} height={24} color="#9CA3AF" />
              <Typography
                variation="caption"
                className="mt-1"
                style={{ color: "#9CA3AF" }}
              >
                Add
              </Typography>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
