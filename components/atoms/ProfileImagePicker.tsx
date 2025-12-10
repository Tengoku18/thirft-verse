import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { BodySemiboldText, CaptionText } from "@/components/Typography";
import { UserIcon, CameraIcon } from "@/components/icons";
import { getProfileImageUrl } from "@/lib/storage-helpers";
import { showImagePickerOptions } from "@/lib/image-picker-helpers";

interface ProfileImagePickerProps {
  value?: string | null;
  onChange: (uri: string | null) => void;
  name?: string;
}

export const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({
  value,
  onChange,
  name = "User",
}) => {
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = () => {
    showImagePickerOptions(
      { aspectRatio: [1, 1], quality: 0.8 },
      (result) => {
        if (result.success && result.uri) {
          onChange(result.uri);
        }
      },
      !!value,
      () => onChange(null)
    );
  };

  return (
    <View className="items-center mb-6">
      <BodySemiboldText
        className="mb-3"
        style={{ color: "#3B2F2F", fontSize: 14 }}
      >
        Profile Picture (Optional)
      </BodySemiboldText>

      <TouchableOpacity
        onPress={handleImageSelect}
        className="relative"
        disabled={uploading}
      >
        {value ? (
          <Image
            source={{ uri: getProfileImageUrl(value) }}
            className="w-24 h-24 rounded-full border-[3px] border-[#D4A373]"
          />
        ) : (
          <View className="w-24 h-24 rounded-full bg-[#D4A373] justify-center items-center border-[3px] border-[#C7BFB3]">
            <UserIcon size={48} color="#FFFFFF" />
          </View>
        )}

        {/* Add/Edit Icon */}
        <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#D4A373] border-2 border-white justify-center items-center">
          <CameraIcon size={16} color="#FFFFFF" />
        </View>

        {uploading && (
          <View className="absolute inset-0 bg-black/50 rounded-full justify-center items-center">
            <ActivityIndicator color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>

      <CaptionText className="mt-2 text-center" style={{ color: "#6B705C" }}>
        Tap to {value ? "change" : "add"} photo
      </CaptionText>
    </View>
  );
};
