import IIcon from "@/components/icons/IIcon";
import { ActionModal } from "@/components/ui/ActionModal";
import { Button } from "@/components/ui/Button/Button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/Typography";
import { useToast } from "@/contexts/ToastContext";
import { updateUserProfile } from "@/lib/database-helpers";
import { uploadProfileImage } from "@/lib/storage-helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import * as yup from "yup";
import { EsewaPaymentFields } from "./EsewaPaymentFields";

const schema = yup.object({
  paymentUsername: yup
    .string()
    .trim()
    .min(3, "eSewa ID must be at least 3 characters")
    .max(100, "eSewa ID must be less than 100 characters")
    .required("eSewa ID/Username is required"),
  paymentQRImage: yup.string().required("QR code image is required"),
});

type FormData = yup.InferType<typeof schema>;

interface EsewaPaymentFormProps {
  userId: string;
  initialUsername?: string;
  initialQrImage?: string | null;
  onSuccess: () => void;
  /** If provided, renders a header section above the fields */
  title?: string;
  subtitle?: string;
  /** Label for the save button */
  saveLabel?: string;
  /** When true, confirmation modal says "Update" instead of "Save" */
  isEditing?: boolean;
  /** If provided, renders a secondary Cancel button */
  onCancel?: () => void;
}

export function EsewaPaymentForm({
  userId,
  initialUsername = "",
  initialQrImage = null,
  onSuccess,
  title,
  subtitle,
  saveLabel,
  isEditing = false,
  onCancel,
}: EsewaPaymentFormProps) {
  const toast = useToast();

  const [qrUri, setQrUri] = useState<string | null>(initialQrImage ?? null);
  const [saving, setSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingData, setPendingData] = useState<FormData | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      paymentUsername: initialUsername,
      paymentQRImage: initialQrImage ?? "",
    },
  });

  useEffect(() => {
    reset({
      paymentUsername: initialUsername,
      paymentQRImage: initialQrImage ?? "",
    });
    setQrUri(initialQrImage ?? null);
  }, [initialUsername, initialQrImage, reset]);

  const handlePickQRImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library to upload a QR code.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setQrUri(uri);
      setValue("paymentQRImage", uri);
    }
  };

  // Validate → store pending data → show confirmation modal
  const handlePressSubmit = handleSubmit((data) => {
    setPendingData(data);
    setShowConfirmModal(true);
  });

  // User confirmed → upload + save
  const handleConfirmSave = async () => {
    if (!pendingData) return;

    setSaving(true);
    setShowConfirmModal(false);

    try {
      let finalQrUrl: string | null = initialQrImage ?? null;

      if (
        qrUri &&
        qrUri !== initialQrImage &&
        (qrUri.startsWith("file") || qrUri.startsWith("ph://"))
      ) {
        const upload = await uploadProfileImage(userId, qrUri);
        if (upload.success && upload.url) {
          finalQrUrl = upload.url;
        } else {
          toast.error("Failed to upload QR code. Please try again.");
          return;
        }
      } else if (qrUri) {
        finalQrUrl = qrUri;
      }

      const result = await updateUserProfile({
        userId,
        payment_username: pendingData.paymentUsername.trim(),
        payment_qr_image: finalQrUrl ?? undefined,
      });

      if (!result.success) {
        toast.error("Failed to save payment details. Please try again.");
        return;
      }

      toast.success(
        isEditing
          ? "Payment details updated."
          : "Payment details saved. You're all set!",
      );
      onSuccess();
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setSaving(false);
      setPendingData(null);
    }
  };

  const resolvedSaveLabel =
    saveLabel ??
    (isEditing ? "Update Payment Details" : "Save Payment Details");

  return (
    <View className="gap-6">
      {/* Header — only rendered when title is provided */}
      {title && (
        <View className="gap-2">
          <Typography variation="h3" className="y-2">
            {title}
          </Typography>
          {subtitle && (
            <Typography variation="body-sm" className="text-slate-500">
              {subtitle}
            </Typography>
          )}
        </View>
      )}

      {/* Fields */}
      <EsewaPaymentFields
        control={control}
        esewaIdFieldName="paymentUsername"
        qrImage={qrUri}
        onPickQRImage={handlePickQRImage}
        qrError={errors.paymentQRImage?.message}
      />

      {/* Info box */}
      <View className="p-4 bg-[#FEF3C7] rounded-2xl flex-row items-start gap-3">
        <View className="text-xl pt-0.5">
          <IIcon />
        </View>
        <Typography variation="body-sm" className="text-[#92400E] flex-1">
          Your eSewa details are used only to process your withdrawals. Make
          sure your QR code is clear and up to date.
        </Typography>
      </View>

      {/* Actions */}
      <View className="gap-3">
        <Button
          label={resolvedSaveLabel}
          variant="primary"
          onPress={handlePressSubmit}
          isLoading={saving}
          disabled={saving}
          fullWidth
        />
        {onCancel && (
          <Button
            label="Cancel"
            variant="secondary"
            onPress={onCancel}
            disabled={saving}
          />
        )}
      </View>

      {/* Confirmation modal */}
      <ActionModal
        visible={showConfirmModal}
        icon={<IconSymbol name="creditcard.fill" size={24} color="#3B3030" />}
        title={isEditing ? "Update Payment Details?" : "Save Payment Details?"}
        description={
          isEditing
            ? "You're about to update your eSewa account. Make sure the new details are correct before proceeding."
            : "Your eSewa account will be linked to receive payouts. Make sure your details are accurate."
        }
        primaryLabel={isEditing ? "Update" : "Save"}
        secondaryLabel="Go Back"
        onPrimary={handleConfirmSave}
        onSecondary={() => setShowConfirmModal(false)}
        primaryLoading={saving}
      />
    </View>
  );
}
