import { Typography } from "@/components/ui/Typography";
import React from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import AddCameraIcon from "../icons/AddCameraIcon";
import PlusIcon from "../icons/PlusIcon";
import { XIcon } from "@/components/icons";

export interface PhotoCarouselProps {
  coverUri: string | null;
  additionalUris: string[];
  onPickCover: () => void;
  onPickAdditional: () => void;
  onRemoveCover: () => void;
  onRemoveAdditional: (index: number) => void;
  coverError?: string;
  maxAdditional?: number;
}

const SLOT_WIDTH = 176;
const SLOT_HEIGHT = SLOT_WIDTH * (5 / 4);

const RemoveButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    style={{
      position: "absolute",
      top: 8,
      right: 8,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: "rgba(0,0,0,0.55)",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <XIcon width={12} height={12} color="#FFFFFF" />
  </TouchableOpacity>
);

export function PhotoCarousel({
  coverUri,
  additionalUris,
  onPickCover,
  onPickAdditional,
  onRemoveCover,
  onRemoveAdditional,
  coverError,
  maxAdditional = 5,
}: PhotoCarouselProps) {
  return (
    <View className="py-5">
      <View className="flex-row justify-between items-center px-5 mb-3">
        <Typography
          variation="label"
          style={{ color: "#0f172a", fontWeight: "600" }}
        >
          Upload Photos
        </Typography>
        <Typography variation="caption" style={{ color: "#64748b" }}>
          Up to {maxAdditional + 1} images
        </Typography>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
      >
        {/* Cover slot */}
        <TouchableOpacity
          onPress={onPickCover}
          activeOpacity={0.8}
          style={[
            {
              width: SLOT_WIDTH,
              height: SLOT_HEIGHT,
              borderRadius: 16,
              overflow: "hidden",
            },
            !coverUri && {
              borderWidth: 2,
              borderStyle: "dashed",
              borderColor: coverError ? "#EF4444" : "rgba(59,48,48,0.2)",
              backgroundColor: coverError ? "#FEF2F2" : "rgba(59,48,48,0.04)",
            },
          ]}
        >
          {coverUri ? (
            <>
              <Image
                source={{ uri: coverUri }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
              <RemoveButton onPress={onRemoveCover} />
            </>
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <AddCameraIcon
                width={36}
                height={36}
                color={coverError ? "#EF4444" : "rgba(59,48,48,0.35)"}
              />
              <Typography
                variation="caption"
                style={{
                  color: coverError ? "#EF4444" : "rgba(59,48,48,0.5)",
                  fontWeight: "500",
                }}
              >
                {coverError ? "Required" : "Main Image"}
              </Typography>
            </View>
          )}
        </TouchableOpacity>

        {/* Filled additional slots */}
        {additionalUris.map((uri, index) => (
          <View
            key={index}
            style={{
              width: SLOT_WIDTH,
              height: SLOT_HEIGHT,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            <RemoveButton onPress={() => onRemoveAdditional(index)} />
          </View>
        ))}

        {/* Add more slot */}
        {additionalUris.length < maxAdditional && (
          <TouchableOpacity
            onPress={onPickAdditional}
            activeOpacity={0.8}
            style={{
              width: SLOT_WIDTH,
              height: SLOT_HEIGHT,
              borderRadius: 16,
              borderWidth: 2,
              borderStyle: "dashed",
              borderColor: "rgba(59,48,48,0.2)",
              backgroundColor: "rgba(59,48,48,0.04)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PlusIcon width={28} height={28} color="rgba(59,48,48,0.35)" />
          </TouchableOpacity>
        )}
      </ScrollView>

      {coverError && (
        <Typography
          variation="caption"
          style={{ color: "#EF4444", paddingHorizontal: 20, marginTop: 6 }}
        >
          {coverError}
        </Typography>
      )}
    </View>
  );
}
