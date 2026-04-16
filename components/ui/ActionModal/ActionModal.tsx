import { BlurModal } from "@/components/ui/BlurModal";
import { Button } from "@/components/ui/Button/Button";
import React from "react";
import { Pressable, View } from "react-native";
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
  /** Show close button (X icon) in top-right corner. Defaults to true. */
  showCloseButton?: boolean;
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
 *   showCloseButton={true}
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
  showCloseButton = true,
}: ActionModalProps) {
  return (
    <BlurModal visible={visible} onDismiss={onSecondary}>
      <Pressable
        className="w-full bg-white rounded-3xl px-6 pt-8 pb-6 gap-4"
        onPress={(e) => e.stopPropagation()}
      >
        {/* Icon badge */}
        <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-5 self-center">
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
          variation="body"
          className="text-slate-500 text-center leading-relaxed mb-7"
        >
          {description}
        </Typography>

        {/* Primary action */}
        <Button
          label={primaryLabel}
          variant="primary"
          size="large"
          onPress={onPrimary}
          isLoading={primaryLoading}
          disabled={primaryLoading}
          fullWidth
          noShadow
        />

        {/* Secondary action */}
        <Button
          label={secondaryLabel}
          variant="tertiary"
          size="large"
          onPress={onSecondary}
          disabled={primaryLoading}
          fullWidth
          noShadow
        />
      </Pressable>
    </BlurModal>
  );
}

export default ActionModal;
