import { CheckMarkCircleIcon } from "@/components/icons";
import { ScreenLayout } from "@/components/layouts";
import { EsewaPaymentForm } from "@/components/payment/EsewaPaymentForm";
import { Button } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";
import { Typography } from "@/components/ui/Typography";
import { useToast } from "@/contexts/ToastContext";
import { updateUserProfile } from "@/lib/database-helpers";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserProfile } from "@/store/profileSlice";
import React, { useState } from "react";
import { Alert, View } from "react-native";

const ESEWA_GREEN = "#60BB46";

export default function PaymentMethodScreen() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const user = useAppSelector((s) => s.auth.user);
  const profile = useAppSelector((s) => s.profile.profile);

  const [removing, setRemoving] = useState(false);

  const isLinked = !!profile?.payment_username;

  const handleRemove = () => {
    Alert.alert(
      "Remove Payment Method",
      "Are you sure you want to remove your eSewa account? You won't receive payouts until you add one.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            if (!user?.id) return;
            setRemoving(true);
            try {
              await updateUserProfile({
                userId: user.id,
                payment_username: "",
                payment_qr_image: undefined,
              });
              await dispatch(fetchUserProfile(user.id));
              toast.success("Payment method removed.");
            } finally {
              setRemoving(false);
            }
          },
        },
      ],
    );
  };

  return (
    <ScreenLayout
      title="Payment Method"
      paddingHorizontal={0}
      contentBackgroundColor="#F5F5F5"
    >
      <View className="pt-4 pb-8 gap-6">
        {/* ── Status Card ──────────────────────────────────────── */}
        <View className="mx-4">
          <Card variant="elevated">
            <View className="flex-row items-center gap-4">
              <View
                className="w-14 h-14 rounded-2xl items-center justify-center"
                style={{ backgroundColor: `${ESEWA_GREEN}18` }}
              >
                <Typography
                  variation="h4"
                  style={{ color: ESEWA_GREEN }}
                  className="font-sans-bold"
                >
                  eS
                </Typography>
              </View>

              <View className="flex-1">
                <Typography variation="body" className="font-sans-bold">
                  eSewa
                </Typography>
                <Typography variation="caption" intent="muted">
                  Digital wallet · Nepal
                </Typography>
              </View>

              <View
                className="px-3 py-1 rounded-full flex-row items-center gap-1"
                style={{
                  backgroundColor: isLinked
                    ? `${ESEWA_GREEN}18`
                    : "rgba(156,163,175,0.12)",
                }}
              >
                <View
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: isLinked ? ESEWA_GREEN : "#9CA3AF",
                  }}
                />
                <Typography
                  variation="caption"
                  className="font-sans-semibold"
                  style={{ color: isLinked ? ESEWA_GREEN : "#9CA3AF" }}
                >
                  {isLinked ? "Connected" : "Not set up"}
                </Typography>
              </View>
            </View>

            {isLinked && (
              <View
                className="mt-4 pt-4 flex-row items-center gap-3"
                style={{
                  borderTopWidth: 1,
                  borderTopColor: "rgba(0,0,0,0.06)",
                }}
              >
                <CheckMarkCircleIcon
                  width={16}
                  height={16}
                  color={ESEWA_GREEN}
                />
                <Typography variation="caption" intent="muted">
                  Payouts go to{" "}
                  <Typography
                    variation="caption"
                    className="font-sans-semibold text-ui-primary"
                  >
                    {profile?.payment_username}
                  </Typography>
                </Typography>
              </View>
            )}
          </Card>
        </View>

        {/* ── Payment Form ──────────────────────────────────────── */}
        <View className="mx-4">
          <EsewaPaymentForm
            userId={user?.id ?? ""}
            initialUsername={profile?.payment_username ?? ""}
            initialQrImage={profile?.payment_qr_image ?? null}
            saveLabel="Save Payment Method"
            isEditing={isLinked}
            onSuccess={() => {
              if (user?.id) dispatch(fetchUserProfile(user.id));
            }}
          />
        </View>

        {/* ── Remove ────────────────────────────────────────────── */}
        {isLinked && (
          <View className="mx-4">
            <Button
              label="Remove Payment Method"
              variant="secondary"
              onPress={handleRemove}
              isLoading={removing}
              disabled={removing}
            />
          </View>
        )}
      </View>
    </ScreenLayout>
  );
}
