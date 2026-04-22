import { CustomHeader } from "@/components/navigation/CustomHeader";
import { Button } from "@/components/ui/Button/Button";
import { Card } from "@/components/ui/Card/Card";
import { Input } from "@/components/ui/Input/Input";
import { Typography } from "@/components/ui/Typography";
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
      className="flex-1 bg-brand-off-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader title="Offer Code" showBackButton />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Section */}
        <View className="mx-4 mb-6">
          <Card variant="elevated">
            <View className="gap-3">
              <Typography
                variation="caption"
                intent="muted"
                className="uppercase tracking-wider"
              >
                Store Promotion
              </Typography>
              <Typography
                variation="h3"
                intent="default"
                className="font-sans-bold"
              >
                Create one active offer code for your store
              </Typography>
              <Typography variation="body" intent="muted" className="leading-6">
                Buyers can apply this code during website checkout. Discounts
                only apply to the product subtotal, never shipping.
              </Typography>
            </View>
          </Card>
        </View>

        {/* Current Status Section */}
        <View className="mx-4 mb-6">
          <Card variant="elevated">
            <View className="gap-3">
              <Typography
                variation="caption"
                intent="muted"
                className="uppercase tracking-wider"
              >
                Current Status
              </Typography>
              {loading ? (
                <ActivityIndicator size="small" color="#3B3030" />
              ) : currentOffer ? (
                <>
                  <Typography
                    variation="h3"
                    className="font-sans-bold text-2xl"
                  >
                    {currentOffer.code}
                  </Typography>
                  <Typography
                    variation="body"
                    className={`font-sans-semibold ${
                      isExpired ? "text-status-error" : "text-status-success"
                    }`}
                  >
                    {isExpired
                      ? "Expired"
                      : `${currentOffer.discountPercent}% off is live`}
                  </Typography>
                  <Typography
                    variation="body"
                    intent="muted"
                    className="leading-6"
                  >
                    Expires {new Date(currentOffer.expiresAt).toLocaleString()}
                  </Typography>
                </>
              ) : (
                <Typography
                  variation="body"
                  intent="muted"
                  className="leading-6"
                >
                  No active offer code yet.
                </Typography>
              )}
            </View>
          </Card>
        </View>

        {/* Configure Code Section */}
        <View className="mx-4 rounded-2xl">
          <Card variant="elevated">
            <View className="gap-4">
              <Typography
                variation="caption"
                intent="muted"
                className="uppercase tracking-wider"
              >
                Configure Code
              </Typography>

              <Input
                label="Offer Code"
                value={code}
                onChangeText={(text) =>
                  setCode(text.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))
                }
                autoCapitalize="characters"
                autoCorrect={false}
                placeholder="e.g. NIKHIL10"
              />

              <Input
                label="Discount Percentage"
                value={discountPercent}
                onChangeText={setDiscountPercent}
                keyboardType="number-pad"
                placeholder="1 - 90"
              />

              <View>
                <Typography
                  variation="caption"
                  intent="muted"
                  className="uppercase tracking-wider mb-3"
                >
                  Valid For
                </Typography>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8 }}
                  style={{ marginBottom: 8 }}
                >
                  {DURATION_OPTIONS.map((option) => {
                    const selected = selectedHours === option.hours;
                    return (
                      <TouchableOpacity
                        key={option.hours}
                        onPress={() => setSelectedHours(option.hours)}
                        className={`px-4 py-2 rounded-full border ${
                          selected
                            ? "border-brand-espresso bg-brand-espresso"
                            : "border-ui-border-light bg-brand-off-white"
                        }`}
                      >
                        <Typography
                          variation="body-xs"
                          className={`font-sans-semibold ${
                            selected ? "text-white" : "text-ui-secondary"
                          }`}
                        >
                          {option.label}
                        </Typography>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <Typography
                variation="body-xs"
                intent="muted"
                className="leading-6"
              >
                Maximum discount is 90% so the platform&apos;s 5% product
                commission remains protected.
              </Typography>

              <Typography
                variation="body-xs"
                intent="muted"
                className="leading-6"
              >
                Updating an active offer resets its expiry from now using the
                selected duration.
              </Typography>

              <View className="gap-3 mt-2">
                <Button
                  label={
                    profile?.offer_code_object
                      ? "Update Offer Code"
                      : "Create Offer Code"
                  }
                  onPress={handleSave}
                  isLoading={saving}
                  variant="primary"
                />

                {profile?.offer_code_object && (
                  <Button
                    label="Delete Offer Code"
                    onPress={handleDelete}
                    isLoading={deleting}
                    variant="secondary"
                  />
                )}
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
