import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import Typography from "@/components/ui/Typography";
import React from "react";
import { Linking, Modal, TouchableOpacity, View } from "react-native";

const STEPS = [
  {
    num: "1",
    title: "Order Arrives",
    desc: "Check buyer details and prepare the item.",
    color: "#D97706",
    bg: "#FEF3C7",
  },
  {
    num: "2",
    title: "Send to NCM",
    desc: "Create an NCM delivery order and drop your parcel at a branch.",
    color: "#2563EB",
    bg: "#DBEAFE",
  },
  {
    num: "3",
    title: "NCM Delivers",
    desc: "NCM handles delivery to the buyer's address. Track status here.",
    color: "#7C3AED",
    bg: "#EDE9FE",
  },
  {
    num: "4",
    title: "Earnings Confirmed",
    desc: "Once delivered, your earnings are confirmed for withdrawal.",
    color: "#059669",
    bg: "#D1FAE5",
  },
];

interface SellerGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SellerGuideModal({ visible, onClose }: SellerGuideModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      >
        <View className="bg-[#FAF7F2] rounded-t-[28px] px-5 pt-5 pb-10">
          <View
            className="w-10 h-1 rounded-full self-center mb-5"
            style={{ backgroundColor: "rgba(59,48,48,0.2)" }}
          />

          <Typography variation="h3" className="text-brand-espresso mb-1">
            Order Handling Guide
          </Typography>
          <Typography
            variation="body-sm"
            className="text-brand-espresso/50 mb-5"
          >
            How to fulfill a Thriftverse order
          </Typography>

          <View className="gap-4">
            {STEPS.map((step) => (
              <View key={step.num} className="flex-row items-start gap-3.5">
                <View
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{ backgroundColor: step.bg }}
                >
                  <Typography variation="label" style={{ color: step.color }}>
                    {step.num}
                  </Typography>
                </View>
                <View className="flex-1">
                  <Typography variation="label" className="text-brand-espresso">
                    {step.title}
                  </Typography>
                  <Typography
                    variation="body-sm"
                    className="text-brand-espresso/60 mt-0.5"
                  >
                    {step.desc}
                  </Typography>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://www.thriftverse.shop/blogs/how-to-handle-orders",
              )
            }
            className="flex-row items-center justify-center gap-1.5 mt-6"
            activeOpacity={0.7}
          >
            <Typography variation="body-sm" className="text-brand-espresso/50">
              Read full guide
            </Typography>
            <IconSymbol
              name="arrow.up.right"
              size={12}
              color="rgba(59,48,48,0.4)"
            />
          </TouchableOpacity>

          <View className="mt-4">
            <Button
              label="Got it"
              variant="primary"
              onPress={onClose}
              noShadow
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
