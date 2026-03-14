import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { CustomHeader } from "@/components/navigation/CustomHeader";
import {
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { useToast } from "@/contexts/ToastContext";
import {
  deleteMyOfferCode,
  getMyOfferCode,
  upsertMyOfferCode,
} from "@/lib/database-helpers";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserProfile } from "@/store/profileSlice";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

const DURATION_OPTIONS = [
  { label: "1 Day", hours: 24 },
  { label: "2 Days", hours: 48 },
  { label: "3 Days", hours: 72 },
  { label: "4 Days", hours: 96 },
  { label: "5 Days", hours: 120 },
  { label: "6 Days", hours: 144 },
  { label: "1 Week", hours: 168 },
  { label: "2 Weeks", hours: 336 },
  { label: "1 Month", hours: 720 },
  { label: "2 Months", hours: 1440 },
  { label: "3 Months", hours: 2160 },
  { label: "4 Months", hours: 2880 },
  { label: "5 Months", hours: 3600 },
  { label: "6 Months", hours: 4320 },
];

const OFFER_CODE_REGEX = /^[A-Z0-9_-]{4,24}$/;

function getClosestDurationHours(expiresAt: string) {
  const remainingMs = new Date(expiresAt).getTime() - Date.now();

  if (remainingMs <= 0) {
    return DURATION_OPTIONS[0].hours;
  }

  const remainingHours = Math.max(1, Math.ceil(remainingMs / (60 * 60 * 1000)));

  return DURATION_OPTIONS.reduce((closestHours, option) => {
    const currentDelta = Math.abs(option.hours - remainingHours);
    const closestDelta = Math.abs(closestHours - remainingHours);

    if (currentDelta < closestDelta) {
      return option.hours;
    }

    return closestHours;
  }, DURATION_OPTIONS[0].hours);
}

export default function OfferCodeScreen() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.profile.profile);

  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [selectedHours, setSelectedHours] = useState(24);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const currentOffer =
    code && discountPercent && expiresAt
      ? {
          code,
          discountPercent: Number(discountPercent),
          expiresAt,
        }
      : (profile?.offer_code_object ?? null);

  useEffect(() => {
    const loadOfferCode = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await getMyOfferCode();

      if (result.success && result.data) {
        const activeOffer = result.data;
        setCode(activeOffer.code);
        setDiscountPercent(String(activeOffer.discount_percent));
        setExpiresAt(activeOffer.expires_at);
        setSelectedHours(getClosestDurationHours(activeOffer.expires_at));
      } else if (!result.success && result.error) {
        toast.error(result.error);
      }

      setLoading(false);
    };

    loadOfferCode();
  }, [toast, user?.id]);

  const isExpired = expiresAt
    ? new Date(expiresAt).getTime() <= Date.now()
    : false;

  const handleSave = async () => {
    if (!user?.id) {
      toast.error("You must be signed in to manage offer codes.");
      return;
    }

    const normalizedCode = code.trim().toUpperCase();
    const parsedDiscount = Number(discountPercent);

    if (!OFFER_CODE_REGEX.test(normalizedCode)) {
      toast.error(
        "Code must be 4-24 characters using letters, numbers, hyphens, or underscores.",
      );
      return;
    }

    if (
      !Number.isFinite(parsedDiscount) ||
      parsedDiscount <= 0 ||
      parsedDiscount > 90
    ) {
      toast.error("Discount must be between 1% and 90%.");
      return;
    }

    setSaving(true);
    const result = await upsertMyOfferCode({
      code: normalizedCode,
      discountPercent: parsedDiscount,
      validHours: selectedHours,
    });
    setSaving(false);

    if (!result.success || !result.data) {
      toast.error(result.error || "Failed to save offer code.");
      return;
    }

    setCode(result.data.code);
    setDiscountPercent(String(result.data.discount_percent));
    setExpiresAt(result.data.expires_at);
    await dispatch(fetchUserProfile(user.id));
    toast.success("Offer code saved.");
  };

  const handleDelete = async () => {
    if (!user?.id) {
      toast.error("You must be signed in to manage offer codes.");
      return;
    }

    setDeleting(true);
    const result = await deleteMyOfferCode();
    setDeleting(false);

    if (!result.success) {
      toast.error(result.error || "Failed to delete offer code.");
      return;
    }

    setCode("");
    setDiscountPercent("");
    setSelectedHours(24);
    setExpiresAt(null);
    await dispatch(fetchUserProfile(user.id));
    toast.success("Offer code deleted.");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#FAFAFA]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader title="Offer Code" showBackButton />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B2F2F" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mx-4 mb-6 rounded-2xl bg-white p-5">
            <CaptionText
              style={{
                color: "#6B7280",
                fontWeight: "600",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              Store Promotion
            </CaptionText>
            <HeadingBoldText
              style={{ fontSize: 24, marginTop: 8, marginBottom: 8 }}
            >
              Create one active offer code for your store
            </HeadingBoldText>
            <BodyRegularText style={{ color: "#6B7280", lineHeight: 22 }}>
              Buyers can apply this code during website checkout. Discounts only
              apply to the product subtotal, never shipping.
            </BodyRegularText>
          </View>

          <View className="mx-4 mb-6 rounded-2xl bg-white p-5">
            <CaptionText
              style={{
                color: "#6B7280",
                fontWeight: "600",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              Current Status
            </CaptionText>
            {currentOffer ? (
              <>
                <HeadingBoldText style={{ fontSize: 22, marginTop: 8 }}>
                  {currentOffer.code}
                </HeadingBoldText>
                <BodySemiboldText
                  style={{
                    color: isExpired ? "#DC2626" : "#059669",
                    marginTop: 6,
                  }}
                >
                  {isExpired
                    ? "Expired"
                    : `${currentOffer.discountPercent}% off is live`}
                </BodySemiboldText>
                <BodyRegularText
                  style={{ color: "#6B7280", marginTop: 6, lineHeight: 22 }}
                >
                  Expires {new Date(currentOffer.expiresAt).toLocaleString()}
                </BodyRegularText>
              </>
            ) : (
              <BodyRegularText
                style={{ color: "#6B7280", marginTop: 8, lineHeight: 22 }}
              >
                No active offer code yet.
              </BodyRegularText>
            )}
          </View>

          <View className="mx-4 rounded-2xl bg-white p-5">
            <CaptionText
              style={{
                color: "#6B7280",
                fontWeight: "600",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              Configure Code
            </CaptionText>

            <View className="mt-4">
              <FormInput
                label="Offer Code"
                value={code}
                onChangeText={(text) =>
                  setCode(text.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))
                }
                autoCapitalize="characters"
                autoCorrect={false}
                placeholder="e.g. NIKHIL10"
              />

              <FormInput
                label="Discount Percentage"
                value={discountPercent}
                onChangeText={setDiscountPercent}
                keyboardType="number-pad"
                placeholder="1 - 90"
              />

              <CaptionText
                style={{
                  color: "#6B7280",
                  fontWeight: "600",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 10,
                }}
              >
                Valid For
              </CaptionText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
                style={{ marginBottom: 16 }}
              >
                {DURATION_OPTIONS.map((option) => {
                  const selected = selectedHours === option.hours;
                  return (
                    <TouchableOpacity
                      key={option.hours}
                      onPress={() => setSelectedHours(option.hours)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: 20,
                        borderWidth: 1.5,
                        borderColor: selected ? "#3B2F2F" : "#D1D5DB",
                        backgroundColor: selected ? "#3B2F2F" : "#F9FAFB",
                      }}
                    >
                      <BodySemiboldText
                        style={{
                          fontSize: 13,
                          color: selected ? "#FFFFFF" : "#374151",
                        }}
                      >
                        {option.label}
                      </BodySemiboldText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <BodyRegularText
                style={{
                  color: "#6B7280",
                  lineHeight: 22,
                  marginTop: -8,
                  marginBottom: 8,
                }}
              >
                Maximum discount is 90% so the platform&apos;s 5% product
                commission remains protected.
              </BodyRegularText>

              <BodyRegularText
                style={{ color: "#6B7280", lineHeight: 22, marginBottom: 20 }}
              >
                Updating an active offer resets its expiry from now using the
                selected duration.
              </BodyRegularText>

              <FormButton
                title={
                  profile?.offer_code_object
                    ? "Update Offer Code"
                    : "Create Offer Code"
                }
                onPress={handleSave}
                loading={saving}
                variant="primary"
              />

              {profile?.offer_code_object && (
                <FormButton
                  title="Delete Offer Code"
                  onPress={handleDelete}
                  loading={deleting}
                  variant="outline"
                  className="mt-4"
                />
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}
