import { ActionModal } from "@/components/ui/ActionModal";
import { TrashIcon, WarningFillIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const COUNTDOWN_SEC = 10;

export interface DeleteInfo {
  activeOrders: number;
  totalListings: number;
}

interface DeleteModalProps {
  visible: boolean;
  deleteInfo: DeleteInfo | null;
  deleteLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
  onViewOrders: () => void;
}

export function DeleteModal({
  visible,
  deleteInfo,
  deleteLoading,
  onConfirm,
  onClose,
  onViewOrders,
}: DeleteModalProps) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SEC);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isBlocked = !!deleteInfo && deleteInfo.activeOrders > 0;

  // Start countdown when modal opens with no active orders
  useEffect(() => {
    if (!visible || !deleteInfo || isBlocked) {
      setCountdown(COUNTDOWN_SEC);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setCountdown(COUNTDOWN_SEC);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [visible, deleteInfo, isBlocked]);

  // ── Loading: orders check in flight — block every deletion path ──
  if (!deleteInfo) {
    return (
      <ActionModal
        visible={visible}
        icon={<ActivityIndicator size="large" color="#3B3030" />}
        title="Checking your account"
        description="Please wait while we verify there are no active orders on your account."
        primaryLabel="Please wait…"
        secondaryLabel="Cancel"
        onPrimary={() => {}}
        onSecondary={onClose}
        primaryDisabled
        showCloseButton={false}
        dismissOnBackdrop={false}
      />
    );
  }

  // ── Blocked: user has active orders ──
  if (isBlocked && deleteInfo) {
    return (
      <ActionModal
        visible={visible}
        icon={<WarningFillIcon width={28} height={28} color="#F59E0B" />}
        title="Cannot Delete Account"
        description={`You have ${deleteInfo.activeOrders} active order${deleteInfo.activeOrders > 1 ? "s" : ""} still in progress. Complete or cancel all orders before deleting your account.`}
        primaryLabel="View My Orders"
        secondaryLabel="Cancel"
        onPrimary={onViewOrders}
        onSecondary={onClose}
        showCloseButton
      >
        <BlockedOrdersInfo orderCount={deleteInfo.activeOrders} />
      </ActionModal>
    );
  }

  // ── Ready: no active orders ──
  const primaryLabel =
    countdown > 0 ? `Delete Account (${countdown}s)` : "Yes, Delete My Account";

  return (
    <ActionModal
      visible={visible}
      icon={<TrashIcon width={28} height={28} color="#DC2626" />}
      title="Delete Account?"
      description={`This will permanently remove your profile${deleteInfo ? `, ${deleteInfo.totalListings} listing${deleteInfo.totalListings !== 1 ? "s" : ""},` : ","} payment details, and all personal data. This cannot be undone.`}
      primaryLabel={primaryLabel}
      secondaryLabel="Cancel"
      onPrimary={onConfirm}
      onSecondary={onClose}
      primaryLoading={deleteLoading}
      primaryDisabled={countdown > 0}
      showCloseButton={!deleteLoading}
      dismissOnBackdrop={!deleteLoading}
    />
  );
}

// ── Sub-components ──

function BlockedOrdersInfo({ orderCount }: { orderCount: number }) {
  return (
    <View
      className="rounded-2xl p-4 mt-2 gap-1.5"
      style={{ backgroundColor: "rgba(245,158,11,0.08)", borderWidth: 1, borderColor: "rgba(245,158,11,0.2)" }}
    >
      <Typography variation="body-sm" className="text-amber-700 font-sans-semibold">
        Why can&apos;t I delete my account?
      </Typography>
      <Typography variation="body-sm" className="text-amber-600 leading-relaxed">
        • {orderCount} order{orderCount > 1 ? "s are" : " is"} pending or being processed{"\n"}
        • Buyers are waiting on their delivery{"\n"}
        • Go to Orders tab to resolve them first
      </Typography>
    </View>
  );
}
