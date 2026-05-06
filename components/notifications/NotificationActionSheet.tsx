import { Typography } from '@/components/ui/Typography';
import { AppNotification } from '@/lib/types/database';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
  item: AppNotification | null;
  visible: boolean;
  onClose: () => void;
  onToggleRead: () => void;
  onDelete: () => void;
  onReport: () => void;
}

interface Option {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}

export function NotificationActionSheet({
  item,
  visible,
  onClose,
  onToggleRead,
  onDelete,
  onReport,
}: Props) {
  if (!item) return null;

  const options: Option[] = [
    {
      icon: item.is_read ? 'ellipse-outline' : 'checkmark-circle-outline',
      label: item.is_read ? 'Mark as Unread' : 'Mark as Read',
      color: '#1F2937',
      onPress: () => { onToggleRead(); onClose(); },
    },
    {
      icon: 'trash-outline',
      label: 'Delete Notification',
      color: '#DC2626',
      onPress: () => { onDelete(); onClose(); },
    },
    {
      icon: 'flag-outline',
      label: 'Report Notification',
      color: '#1F2937',
      onPress: () => { onReport(); onClose(); },
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill}>
        {/* Dark overlay — tap to dismiss */}
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
          onPress={onClose}
        />

        <Pressable className="flex-1 justify-end" onPress={onClose}>
          <Pressable
            className="bg-white rounded-t-3xl"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View className="px-6 pt-6 pb-4 border-b border-gray-100">
              <Typography variation="caption" style={{ color: '#9CA3AF', marginBottom: 4 }}>
                Notification
              </Typography>
              <Typography
                variation="body"
                numberOfLines={1}
                style={{ color: '#1F2937', fontWeight: '600' }}
              >
                {item.title}
              </Typography>
            </View>

            {/* Options */}
            <View className="px-4 py-2">
              {options.map((opt, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={opt.onPress}
                  activeOpacity={0.7}
                  className="py-4 px-2 rounded-xl my-0.5 flex-row items-center"
                  style={{ gap: 14 }}
                >
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      backgroundColor: opt.color === '#DC2626' ? '#FEE2E2' : '#F3F4F6',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={opt.icon as any} size={18} color={opt.color} />
                  </View>
                  <Typography variation="body" style={{ color: opt.color, fontWeight: '500' }}>
                    {opt.label}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>

            {/* Cancel */}
            <View className="px-6 pt-2 pb-10 border-t border-gray-100">
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                className="py-4 items-center"
              >
                <Typography variation="body" style={{ color: '#6B7280', fontWeight: '600' }}>
                  Cancel
                </Typography>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </BlurView>
    </Modal>
  );
}
