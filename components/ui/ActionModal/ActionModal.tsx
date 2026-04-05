import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { Typography } from "../Typography/Typography";

interface ActionModalProps {
  visible: boolean;
  /** Icon rendered inside the circular badge at the top */
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  primaryLoading?: boolean;
  /** Tapping the dim backdrop calls onSecondary by default. Set false to disable. */
  dismissOnBackdrop?: boolean;
}

/**
 * ActionModal — reusable confirmation / alert modal.
 *
 * Usage:
 * ```tsx
 * <ActionModal
 *   visible={showModal}
 *   icon={<LogoutIcon width={24} height={24} />}
 *   title="Sign Out?"
 *   description="Are you sure you want to sign out of ThriftVerse?"
 *   primaryLabel="Sign Out"
 *   secondaryLabel="Stay Logged In"
 *   onPrimary={handleSignOut}
 *   onSecondary={() => setShowModal(false)}
 * />
 * ```
 */
export function ActionModal({
  visible,
  icon,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  primaryLoading = false,
  dismissOnBackdrop = true,
}: ActionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      {/* Dim backdrop */}
      <Pressable
        className="flex-1 bg-black/40 items-center justify-center px-6"
        onPress={dismissOnBackdrop ? onSecondary : undefined}
      >
        {/* Card — stopPropagation prevents backdrop tap from closing when tapping inside */}
        <Pressable
          className="w-full bg-white rounded-3xl px-6 pt-8 pb-6 items-center"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Icon badge */}
          <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-5">
            {icon}
          </View>

          {/* Title */}
          <Typography
            variation="h2"
            className="text-brand-espresso text-center mb-3"
          >
            {title}
          </Typography>

          {/* Description */}
          <Typography
            variation="body-sm"
            className="text-slate-500 text-center leading-relaxed mb-7"
          >
            {description}
          </Typography>

          {/* Primary action */}
          <TouchableOpacity
            className="w-full h-14 bg-brand-espresso rounded-2xl items-center justify-center mb-3 active:opacity-80"
            onPress={onPrimary}
            disabled={primaryLoading}
            activeOpacity={0.85}
          >
            {primaryLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Typography
                variation="button"
                className="text-white font-sans-extrabold"
              >
                {primaryLabel}
              </Typography>
            )}
          </TouchableOpacity>

          {/* Secondary action */}
          <TouchableOpacity
            className="w-full h-14 bg-gray-100 rounded-2xl items-center justify-center active:opacity-70"
            onPress={onSecondary}
            disabled={primaryLoading}
            activeOpacity={0.85}
          >
            <Typography
              variation="button"
              className="text-brand-espresso font-sans-bold"
            >
              {secondaryLabel}
            </Typography>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default ActionModal;
