import {
  BodyBoldText,
  BodyMediumText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { FormPicker, PickerOption } from "@/components/atoms/FormPicker";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { districtsOfNepal } from "@/lib/constants/districts";
import { updateOrderDetails } from "@/lib/database-helpers";
import {
  cleanNepaliPhone,
  isValidNepaliPhone,
} from "@/lib/validations/create-order";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

interface EditOrderModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  orderData: {
    orderId: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    shippingAddress: {
      street: string;
      city: string;
      district: string;
      country: string;
    } | null;
    buyerNotes?: string;
  };
}

// Convert districts to picker options
const districtOptions: PickerOption[] = districtsOfNepal.map((district) => ({
  label: district,
  value: district,
}));

export const EditOrderModal: React.FC<EditOrderModalProps> = ({
  visible,
  onClose,
  onSuccess,
  orderData,
}) => {
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState(orderData.buyerName);
  const [email, setEmail] = useState(orderData.buyerEmail);
  const [phone, setPhone] = useState(orderData.buyerPhone);
  const [street, setStreet] = useState(orderData.shippingAddress?.street || "");
  const [city, setCity] = useState(orderData.shippingAddress?.city || "");
  const [district, setDistrict] = useState(
    orderData.shippingAddress?.district || ""
  );
  const [notes, setNotes] = useState(orderData.buyerNotes || "");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens with new data
  useEffect(() => {
    if (visible) {
      setName(orderData.buyerName);
      setEmail(orderData.buyerEmail);
      setPhone(orderData.buyerPhone);
      setStreet(orderData.shippingAddress?.street || "");
      setCity(orderData.shippingAddress?.city || "");
      setDistrict(orderData.shippingAddress?.district || "");
      setNotes(orderData.buyerNotes || "");
      setErrors({});
    }
  }, [visible, orderData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Buyer name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (Nepali format)
    const cleanedPhone = cleanNepaliPhone(phone);
    if (!cleanedPhone) {
      newErrors.phone = "Phone number is required";
    } else if (!isValidNepaliPhone(cleanedPhone)) {
      newErrors.phone = "Enter valid 10-digit Nepali number (e.g., 98XXXXXXXX)";
    }

    // Address validation
    if (!street.trim()) {
      newErrors.street = "Street address is required";
    } else if (street.trim().length < 5) {
      newErrors.street = "Street address must be at least 5 characters";
    }

    if (!city.trim()) {
      newErrors.city = "City is required";
    }

    if (!district) {
      newErrors.district = "Please select a district";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const cleanedPhone = cleanNepaliPhone(phone);

      const result = await updateOrderDetails({
        orderId: orderData.orderId,
        buyerName: name.trim(),
        buyerEmail: email.trim().toLowerCase(),
        buyerPhone: cleanedPhone,
        shippingAddress: {
          street: street.trim(),
          city: city.trim(),
          district: district,
          country: "Nepal",
        },
        buyerNotes: notes.trim() || undefined,
      });

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        Alert.alert("Error", result.error || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View
            className="bg-white rounded-t-3xl"
            style={{ maxHeight: "90%" }}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-[#F3F4F6]">
              <View>
                <HeadingBoldText style={{ fontSize: 18 }}>
                  Edit Order Details
                </HeadingBoldText>
                <CaptionText style={{ color: "#9CA3AF", marginTop: 2 }}>
                  Update buyer information before sending to NCM
                </CaptionText>
              </View>
              <TouchableOpacity
                onPress={handleClose}
                disabled={submitting}
                className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center"
              >
                <IconSymbol name="xmark" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView
              className="px-5 py-4"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Warning Banner */}
              <View className="bg-[#FEF3C7] rounded-xl p-4 mb-5">
                <View className="flex-row items-start">
                  <IconSymbol
                    name="exclamationmark.triangle.fill"
                    size={18}
                    color="#D97706"
                    style={{ marginRight: 10, marginTop: 2 }}
                  />
                  <View className="flex-1">
                    <BodyMediumText style={{ color: "#92400E", fontSize: 13 }}>
                      Please verify all details carefully. Once the order is
                      sent to NCM, it cannot be edited.
                    </BodyMediumText>
                  </View>
                </View>
              </View>

              {/* Buyer Information Section */}
              <BodyBoldText style={{ fontSize: 15, marginBottom: 12 }}>
                Buyer Information
              </BodyBoldText>

              <FormInput
                label="Full Name"
                placeholder="Enter buyer's full name"
                value={name}
                onChangeText={setName}
                error={errors.name}
                autoCapitalize="words"
              />

              <FormInput
                label="Email Address"
                placeholder="Enter buyer's email"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <FormInput
                label="Phone Number"
                placeholder="98XXXXXXXX"
                value={phone}
                onChangeText={setPhone}
                error={errors.phone}
                keyboardType="phone-pad"
                maxLength={15}
              />
              {!errors.phone && (
                <CaptionText
                  style={{ color: "#9CA3AF", marginTop: -8, marginBottom: 12 }}
                >
                  Enter 10-digit Nepali mobile number
                </CaptionText>
              )}

              {/* Shipping Address Section */}
              <BodyBoldText style={{ fontSize: 15, marginTop: 8, marginBottom: 12 }}>
                Shipping Address
              </BodyBoldText>

              <FormInput
                label="Street Address"
                placeholder="House number, street name, area"
                value={street}
                onChangeText={setStreet}
                error={errors.street}
                multiline
                numberOfLines={2}
              />

              <FormInput
                label="City / Town"
                placeholder="Enter city or town"
                value={city}
                onChangeText={setCity}
                error={errors.city}
              />

              <FormPicker
                label="District"
                placeholder="Select district"
                value={district}
                onValueChange={setDistrict}
                options={districtOptions}
                error={errors.district}
                searchable
                searchPlaceholder="Search districts..."
              />

              {/* Notes Section */}
              <BodyBoldText style={{ fontSize: 15, marginTop: 8, marginBottom: 12 }}>
                Additional Notes (Optional)
              </BodyBoldText>

              <FormInput
                label=""
                placeholder="Any special instructions for delivery..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                maxLength={500}
              />
              <CaptionText
                style={{
                  color: "#9CA3AF",
                  marginTop: -8,
                  marginBottom: 12,
                  textAlign: "right",
                }}
              >
                {notes.length}/500
              </CaptionText>

              {/* Action Buttons */}
              <View className="mt-4 mb-8">
                <FormButton
                  title="Save Changes"
                  onPress={handleSubmit}
                  loading={submitting}
                  disabled={submitting}
                />

                <TouchableOpacity
                  onPress={handleClose}
                  disabled={submitting}
                  className="mt-3 py-3"
                  activeOpacity={0.7}
                >
                  <BodyMediumText
                    style={{
                      color: "#6B7280",
                      fontSize: 15,
                      textAlign: "center",
                    }}
                  >
                    Cancel
                  </BodyMediumText>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
