import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/themed-text';
import { UserIcon, CameraIcon } from '@/components/icons';
import { getProfileImageUrl } from '@/lib/storage-helpers';

interface ProfileImagePickerProps {
  value?: string | null;
  onChange: (uri: string | null) => void;
  name?: string;
}

export const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({
  value,
  onChange,
  name = 'User',
}) => {
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photos to upload a profile picture.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      // Request permissions
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your camera to take a photo.');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const showOptions = () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
        ...(value ? [{ text: 'Remove Photo', onPress: () => onChange(null), style: 'destructive' as const }] : []),
      ]
    );
  };

  return (
    <View className="items-center mb-6">
      <ThemedText className="text-sm font-semibold mb-3 font-[NunitoSans_600SemiBold] text-[#3B2F2F]">
        Profile Picture (Optional)
      </ThemedText>

      <TouchableOpacity
        onPress={showOptions}
        className="relative"
        disabled={uploading}>
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

      <ThemedText className="text-xs text-[#6B705C] mt-2 text-center font-[NunitoSans_400Regular]">
        Tap to {value ? 'change' : 'add'} photo
      </ThemedText>
    </View>
  );
};
