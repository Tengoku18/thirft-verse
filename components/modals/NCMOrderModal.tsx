import {
  BodyBoldText,
  BodyMediumText,
  CaptionText,
  HeadingBoldText
} from "@/components/Typography";
import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { FormPicker, PickerOption } from "@/components/atoms/FormPicker";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  createNCMOrder,
  fetchNCMBranches,
  NCMBranch,
  NCMCreateOrderParams,
} from "@/lib/ncm-helpers";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";

interface NCMOrderModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (ncmOrderId: number) => void;
  orderData: {
    orderId: string;
    orderCode: string;
    buyerName: string;
    buyerPhone: string;
    shippingAddress: {
      street: string;
      city: string;
      district: string;
      country: string;
      phone: string;
    };
    productTitle: string;
    totalAmount: number;
    shippingFee: number;
    notes?: string;
  };
}

const deliveryTypeOptions: PickerOption[] = [
  // { label: "Door to Door (NCM Pickup & Delivery)", value: "Door2Door" },
  { label: "Branch to Door (Drop at Branch, NCM Delivers)", value: "Branch2Door" },
  // { label: "Door to Branch (NCM Pickup, Collect at Branch)", value: "Door2Branch" },
  {
    label: "Branch to Branch (Drop & Collect at Branch)",
    value: "Branch2Branch",
  },
];

export const NCMOrderModal: React.FC<NCMOrderModalProps> = ({
  visible,
  onClose,
  onSuccess,
  orderData,
}) => {
  const [branches, setBranches] = useState<NCMBranch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState(orderData.buyerName);
  const [phone, setPhone] = useState(orderData.buyerPhone);
  const [phone2, setPhone2] = useState("");
  const [address, setAddress] = useState(
    [
      orderData.shippingAddress.street,
      orderData.shippingAddress.city,
      orderData.shippingAddress.district,
    ]
      .filter((part) => part && part.trim())
      .join(", ")
  );
  const [fromBranch, setFromBranch] = useState("");
  const [destinationBranch, setDestinationBranch] = useState("");
  const [packageName, setPackageName] = useState(orderData.productTitle);
  const [deliveryType, setDeliveryType] = useState<string>("Branch2Door");
  const [weight, setWeight] = useState("1");
  const [instruction, setInstruction] = useState(orderData.notes || "");
  const [codCharge, setCodCharge] = useState(orderData.totalAmount.toString());

  // Load branches on mount
  useEffect(() => {
    if (visible) {
      loadBranches();
    }
  }, [visible]);

  const loadBranches = async () => {
    setLoadingBranches(true);
    const result = await fetchNCMBranches();
    if (result.success) {
      setBranches(result.data);
    } else {
      Alert.alert("Error", "Failed to load NCM branches. Please try again.");
    }
    setLoadingBranches(false);
  };

  const branchOptions: PickerOption[] = branches.map((branch) => ({
    label: branch.district_name
      ? `${branch.name} - ${branch.district_name}`
      : branch.name,
    value: branch.name,
    description: branch.areas_covered || undefined,
    searchableText: `${branch.areas_covered || ''} ${branch.district_name || ''}`,
  }));

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Error", "Customer name is required");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Error", "Customer phone is required");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Error", "Delivery address is required");
      return;
    }
    if (!fromBranch) {
      Alert.alert("Error", "Please select a pickup branch");
      return;
    }
    if (!destinationBranch) {
      Alert.alert("Error", "Please select a destination branch");
      return;
    }
    if (!codCharge || parseFloat(codCharge) <= 0) {
      Alert.alert("Error", "COD charge must be greater than 0");
      return;
    }

    setSubmitting(true);

    try {
      const params: NCMCreateOrderParams = {
        name: name.trim(),
        phone: phone.trim(),
        phone2: phone2.trim() || undefined,
        cod_charge: parseFloat(codCharge).toFixed(2),
        address: address.trim(),
        fbranch: fromBranch,
        branch: destinationBranch,
        package: packageName.trim() || undefined,
        instruction: instruction.trim() || undefined,
        delivery_type: deliveryType as any,
        weight: weight || undefined,
      };

      const result = await createNCMOrder(params);

      if (result.success && result.data) {
        Alert.alert("Success", `NCM Order created successfully! Order ID: ${result.data.orderid}`);
        onSuccess(result.data.orderid);
        onClose();
      } else {
        Alert.alert("Error", result.error || "Failed to create NCM order");
      }
    } catch (error) {
      console.error("Error creating NCM order:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Header */}
          <View className="px-6 pt-4 pb-3 border-b border-[#E5E7EB] flex-row items-center justify-between">
          <View className="flex-1">
            <HeadingBoldText style={{ fontSize: 20 }}>Move to NCM</HeadingBoldText>
            <CaptionText style={{ color: "#6B7280", marginTop: 4 }}>
              Order: {orderData.orderCode}
            </CaptionText>
          </View>
          <TouchableOpacity onPress={onClose} className="ml-4">
            <IconSymbol name="xmark" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {loadingBranches ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3B2F2F" />
            <BodyMediumText style={{ color: "#6B7280", marginTop: 12 }}>
              Loading NCM branches...
            </BodyMediumText>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            <View className="px-4 pt-4">
              {/* Customer Information */}
              <View className="mb-6">
                <BodyBoldText style={{ fontSize: 16, marginBottom: 12 }}>
                  Customer Information
                </BodyBoldText>

                <FormInput
                  label="Customer Name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter customer name"
                  required
                  editable={false}
                />

                <FormInput
                  label="Phone Number"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  required
                  editable={false}
                />

                <FormInput
                  label="Secondary Phone (Optional)"
                  value={phone2}
                  onChangeText={setPhone2}
                  placeholder="Enter secondary phone"
                  keyboardType="phone-pad"
                />
              </View>

              {/* Delivery Address */}
              <View className="mb-6">
                <BodyBoldText style={{ fontSize: 16, marginBottom: 12 }}>
                  Delivery Address
                </BodyBoldText>

                <FormInput
                  label="Full Address"
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Street, City, District"
                  multiline
                  numberOfLines={3}
                  required
                  editable={false}
                />
              </View>

              {/* Branch Selection */}
              <View className="mb-6">
                <BodyBoldText style={{ fontSize: 16, marginBottom: 12 }}>
                  Branch Selection
                </BodyBoldText>

                <FormPicker
                  label="Pickup Branch (From)"
                  value={fromBranch}
                  onChange={setFromBranch}
                  options={branchOptions}
                  placeholder="Select pickup branch"
                  required
                />

                <FormPicker
                  label="Destination Branch (To)"
                  value={destinationBranch}
                  onChange={setDestinationBranch}
                  options={branchOptions}
                  placeholder="Select destination branch"
                  required
                />
              </View>

              {/* Order Details */}
              <View className="mb-6">
                <BodyBoldText style={{ fontSize: 16, marginBottom: 12 }}>
                  Order Details
                </BodyBoldText>

                <FormInput
                  label="Package Name"
                  value={packageName}
                  onChangeText={setPackageName}
                  placeholder="Enter package name"
                  editable={false}
                />

                <FormInput
                  label="COD Amount (including delivery)"
                  value={codCharge}
                  onChangeText={setCodCharge}
                  placeholder="Enter COD amount"
                  keyboardType="numeric"
                  required
                  editable={false}
                />

                <FormPicker
                  label="Delivery Type"
                  value={deliveryType}
                  onChange={setDeliveryType}
                  options={deliveryTypeOptions}
                  placeholder="Select delivery type"
                  required
                />

                <FormInput
                  label="Weight (kg)"
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="Enter weight in kg"
                  keyboardType="numeric"
                />

                <FormInput
                  label="Delivery Instructions (Optional)"
                  value={instruction}
                  onChangeText={setInstruction}
                  placeholder="Any special instructions..."
                  multiline
                  numberOfLines={3}
                  editable={false}
                />
              </View>
            </View>
          </ScrollView>
        )}

          {/* Submit Button */}
          {!loadingBranches && (
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#F3F4F6] px-6 py-4">
              <FormButton
                title="Create NCM Order"
                onPress={handleSubmit}
                loading={submitting}
                disabled={submitting || loadingBranches}
                variant="primary"
              />
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};
