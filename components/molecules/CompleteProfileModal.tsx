import { BlurModal } from "@/components/ui/BlurModal";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/Typography";
import React from "react";
import { Pressable, View } from "react-native";

interface CompleteProfileModalProps {
  visible: boolean;
  onGoToProfile: () => void;
  onCancel: () => void;
}

interface RequirementRowProps {
  icon: string;
  label: string;
}

function RequirementRow({ icon, label }: RequirementRowProps) {
  return (
    <View className="flex-row items-center gap-2.5">
      <View className="w-7 h-7 rounded-full bg-brand-beige items-center justify-center">
        <IconSymbol name={icon as any} size={14} color="#3B3030" />
      </View>
      <Typography variation="body-sm" className="text-ui-secondary flex-1">
        {label}
      </Typography>
    </View>
  );
}

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  visible,
  onGoToProfile,
  onCancel,
}) => {
  return (
    <BlurModal visible={visible} onDismiss={onCancel}>
      <Pressable
        className="bg-brand-surface rounded-3xl w-full overflow-hidden"
        onPress={(e) => e.stopPropagation()}
      >
        {/* Amber accent strip at top */}
        <View className="h-1 bg-status-warning rounded-t-3xl" />

        <View className="px-6 pt-7 pb-6 gap-5">
          {/* Icon badge */}
          <View className="items-center">
            <View className="w-16 h-16 rounded-full bg-status-warning-bg items-center justify-center">
              <IconSymbol
                name="person.crop.circle.badge.exclamationmark"
                size={30}
                color="#D97706"
              />
            </View>
          </View>

          {/* Title + description */}
          <View className="items-center gap-1.5">
            <Typography
              variation="h4"
              className="text-brand-espresso font-folito-bold text-center"
            >
              Complete Your Profile
            </Typography>
            <Typography
              variation="body-sm"
              className="text-ui-secondary text-center leading-relaxed"
            >
              To list products, you need to add your payment details so buyers
              can pay you.
            </Typography>
          </View>

          {/* Requirements card */}
          <View className="bg-brand-off-white rounded-2xl p-4 gap-3 border border-brand-beige">
            <Typography
              variation="label"
              className="text-brand-espresso font-sans-semibold"
            >
              Required to proceed:
            </Typography>
            <RequirementRow
              icon="person.fill"
              label="Payment Account Holder Name"
            />
            <RequirementRow
              icon="qrcode"
              label="Payment QR Code Image"
            />
          </View>

          {/* Actions */}
          <View className="gap-3">
            <Button
              label="Complete Payment Profile"
              variant="primary"
              fullWidth
              onPress={onGoToProfile}
              icon={<IconSymbol name="arrow.right" size={16} color="#FFFFFF" />}
              iconPosition="right"
            />
            <Button
              label="Cancel"
              variant="secondary"
              fullWidth
              onPress={onCancel}
            />
          </View>
        </View>
      </Pressable>
    </BlurModal>
  );
};
