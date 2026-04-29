import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Typography from "@/components/ui/Typography";
import React from "react";
import { Image, Modal, TouchableOpacity, View } from "react-native";
import { CameraIcon } from "@/components/icons";

interface ShippingConfirmModalProps {
  visible: boolean;
  shippingId: string;
  billImageUri: string | null;
  uploading: boolean;
  onChangeId: (val: string) => void;
  onPickImage: () => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function ShippingConfirmModal({
  visible, shippingId, billImageUri, uploading,
  onChangeId, onPickImage, onConfirm, onClose,
}: ShippingConfirmModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
        <View className="bg-[#FAF7F2] rounded-t-[28px] px-5 pt-5 pb-10">
          <View className="w-10 h-1 rounded-full self-center mb-5" style={{ backgroundColor: "rgba(59,48,48,0.2)" }} />

          <Typography variation="h4" className="text-brand-espresso mb-1">Confirm Shipping</Typography>
          <Typography variation="body-sm" className="text-brand-espresso/50 mb-5">
            Enter the shipping ID from your bill and upload a photo
          </Typography>

          <View className="mb-4">
            <Input
              label="Shipping / Tracking ID"
              placeholder="Enter ID from your shipping bill"
              value={shippingId}
              onChangeText={onChangeId}
            />
          </View>

          <TouchableOpacity
            onPress={onPickImage}
            activeOpacity={0.75}
            className="rounded-xl h-28 items-center justify-center bg-white mb-5 overflow-hidden"
            style={{ borderWidth: 1.5, borderStyle: "dashed", borderColor: "rgba(59,48,48,0.15)" }}
          >
            {billImageUri ? (
              <Image source={{ uri: billImageUri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
            ) : (
              <View className="items-center gap-1.5">
                <CameraIcon width={28} height={28} color="rgba(59,48,48,0.3)" />
                <Typography variation="body-sm" className="text-brand-espresso/40">Upload bill photo</Typography>
              </View>
            )}
          </TouchableOpacity>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button label="Cancel" variant="secondary" onPress={onClose} noShadow />
            </View>
            <View style={{ flex: 1.5 }}>
              <Button label="Confirm Shipped" variant="primary" onPress={onConfirm} isLoading={uploading} disabled={uploading} noShadow />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
