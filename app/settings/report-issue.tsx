import { RHFSelect, RHFTextarea } from "@/components/forms/ReactHookForm";
import { ScreenLayout } from "@/components/layouts";
import { SuccessModal } from "@/components/molecules/SuccessModal";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useToast } from "@/contexts/ToastContext";
import { uploadMultipleImages } from "@/lib/upload-helpers";
import {
  ISSUE_CATEGORIES,
  ReportIssueFormData,
  reportIssueSchema,
} from "@/lib/validations/report-issue";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearReportIssueError,
  submitReportIssue,
} from "@/store/reportIssueSlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Image,
  Keyboard,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";

const MAX_SCREENSHOTS = 3;

const categoryOptions = ISSUE_CATEGORIES.map((c) => ({
  label: c.label,
  value: c.value as string,
}));

export default function ReportIssueScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const profile = useAppSelector((s) => s.profile.profile);
  const authUser = useAppSelector((s) => s.auth.user);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const { control, handleSubmit, reset } = useForm<ReportIssueFormData>({
    resolver: yupResolver(reportIssueSchema),
    mode: "onSubmit",
    defaultValues: {
      category: "",
      description: "",
    },
  });

  const handlePickImage = async () => {
    if (screenshots.length >= MAX_SCREENSHOTS) {
      Alert.alert(
        "Limit Reached",
        `You can attach up to ${MAX_SCREENSHOTS} screenshots.`,
      );
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library in Settings.",
      );
      return;
    }

    const remaining = MAX_SCREENSHOTS - screenshots.length;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setScreenshots((prev) => [...prev, ...uris].slice(0, MAX_SCREENSHOTS));
    }
  };

  const handleRemoveScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ReportIssueFormData) => {
    Keyboard.dismiss();
    setSubmitError(null);
    dispatch(clearReportIssueError());
    setSubmitting(true);

    try {
      let screenshotUrls: string[] = [];

      if (screenshots.length > 0) {
        const uploadResults = await uploadMultipleImages(
          screenshots,
          "issue-reports",
          "screenshots",
        );
        screenshotUrls = uploadResults
          .filter((r) => r.success && r.url)
          .map((r) => r.url!);

        if (screenshotUrls.length < screenshots.length) {
          toast.warning(
            "Some screenshots could not be uploaded, but your report will still be submitted.",
          );
        }
      }

      await dispatch(
        submitReportIssue({
          user_id: profile?.id ?? "",
          category: data.category,
          description: data.description,
          screenshot_urls: screenshotUrls,
          user_email: authUser?.email ?? "",
        }),
      ).unwrap();

      reset();
      setScreenshots([]);
      setShowSuccess(true);
    } catch (err: unknown) {
      const message =
        typeof err === "string"
          ? err
          : "Failed to submit your report. Please check your connection and try again.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenLayout
      title="Report an Issue"
      contentBackgroundColor="#F5F5F5"
      paddingHorizontal={0}
    >
      <View>
        {/* Hero */}
        <View className="px-4 pt-6 pb-4">
          <Typography
            variation="h3"
            className="text-brand-espresso font-folito-bold mb-1"
          >
            {"We're here to help"}
          </Typography>
          <Typography
            variation="body-sm"
            className="text-ui-secondary"
            style={{ lineHeight: 22 }}
          >
            Encountered a glitch or have a problem with an order? Let us know
            the details below and our team will look into it within 24–48 hours.
          </Typography>
        </View>

        {/* Form */}
        <View className="px-4 gap-5 mt-2">
          {/* Category */}
          <RHFSelect
            control={control}
            name="category"
            label="Issue Category"
            placeholder="Select a category"
            options={categoryOptions}
            modalTitle="Select Issue Category"
            disabled={submitting}
          />

          {/* Description */}
          <RHFTextarea
            control={control}
            name="description"
            label="Detailed Description"
            placeholder="Please describe what happened, any steps to reproduce, and what you expected to happen..."
            maxLength={1000}
            numberOfLines={6}
            informationMessage="Minimum 20 characters. More detail helps us resolve your issue faster."
            infoMessageType="secondary"
            editable={!submitting}
          />

          {/* Screenshots */}
          <View className="gap-2">
            <Typography
              variation="label"
              className="text-brand-espresso font-sans-semibold ml-1"
            >
              Attach Screenshots{" "}
              <Typography
                variation="label"
                className="text-ui-tertiary font-sans-regular"
              >
                (Optional, max {MAX_SCREENSHOTS})
              </Typography>
            </Typography>

            <View className="flex-row flex-wrap gap-3">
              {screenshots.map((uri, index) => (
                <View
                  key={uri}
                  className="w-24 h-24 rounded-2xl overflow-hidden"
                  style={{ position: "relative" }}
                >
                  <Image
                    source={{ uri }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveScreenshot(index)}
                    activeOpacity={0.8}
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: "rgba(59,48,48,0.75)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="close" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}

              {screenshots.length < MAX_SCREENSHOTS && (
                <Pressable
                  onPress={handlePickImage}
                  disabled={submitting}
                  className="w-24 h-24 rounded-2xl items-center justify-center active:opacity-70"
                  style={{
                    borderWidth: 1.5,
                    borderStyle: "dashed",
                    borderColor: "rgba(59,48,48,0.2)",
                    backgroundColor: "rgba(59,48,48,0.04)",
                  }}
                >
                  <Ionicons
                    name="camera-outline"
                    size={24}
                    color="rgba(59,48,48,0.4)"
                  />
                  <Typography
                    variation="body-xs"
                    className="text-center mt-1"
                    style={{ color: "rgba(59,48,48,0.4)" }}
                  >
                    Add Photo
                  </Typography>
                </Pressable>
              )}
            </View>
          </View>

          {/* Submit */}
          <View className="pt-2 gap-3">
            {/* Inline error */}
            {submitError && (
              <View
                className="flex-row items-center gap-2 px-4 py-3 rounded-2xl"
                style={{ backgroundColor: "rgba(220,38,38,0.08)" }}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color="#DC2626"
                />
                <Typography
                  variation="body-sm"
                  className="flex-1"
                  style={{ color: "#DC2626", lineHeight: 20 }}
                >
                  {submitError}
                </Typography>
              </View>
            )}

            <Button
              label={submitting ? "Submitting…" : "Submit Report"}
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              isLoading={submitting}
              disabled={submitting}
              fullWidth
            />

            <Typography
              variation="body-xs"
              className="text-ui-tertiary text-center px-4"
              style={{ lineHeight: 18 }}
            >
              By submitting this report, you agree to our Terms of Service. Our
              team typically responds within 24–48 hours.
            </Typography>
          </View>
        </View>
      </View>

      <SuccessModal
        visible={showSuccess}
        title="Report Submitted"
        message="Thank you for letting us know. Our team will review your report and get back to you within 24–48 hours."
        onClose={() => {
          setShowSuccess(false);
          router.back();
        }}
        actions={[
          {
            label: "Done",
            onPress: () => {
              setShowSuccess(false);
              router.back();
            },
            variant: "primary",
          },
        ]}
      />
    </ScreenLayout>
  );
}
