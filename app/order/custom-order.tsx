import {
  RHFInput,
  RHFSelect,
  RHFTextarea,
} from "@/components/forms/ReactHookForm";
import { RightArrowIcon } from "@/components/icons";
import XIcon from "@/components/icons/XIcon";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import {
  PickerItem,
  ProductPickerModal,
} from "@/components/order/ProductPickerModal";
import { Button } from "@/components/ui/Button/Button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/Typography/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useToast } from "@/contexts/ToastContext";
import { districtsOfNepal } from "@/lib/constants/districts";
import {
  createCustomOrder,
  CreateCustomOrderParams,
} from "@/lib/database-helpers";
import { getProductImageUrl } from "@/lib/storage-helpers";
import {
  cleanNepaliPhone,
  isValidNepaliPhone,
} from "@/lib/validations/create-order";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Image, TouchableOpacity, View } from "react-native";
import * as yup from "yup";

// ─────────────────────────────────────────────────────────────
// Schema — item fields removed; products come from the picker
// ─────────────────────────────────────────────────────────────

const schema = yup.object({
  buyerName: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Buyer name is required"),
  buyerPhone: yup
    .string()
    .required("Phone number is required")
    .test(
      "nepali-phone",
      "Enter a valid Nepali phone number (98XXXXXXXX)",
      (val) => !!val && isValidNepaliPhone(cleanNepaliPhone(val)),
    ),
  buyerEmail: yup
    .string()
    .email("Enter a valid email address")
    .optional()
    .default(""),
  street: yup
    .string()
    .trim()
    .min(3, "Street / area is required")
    .required("Street / area is required"),
  city: yup.string().trim().required("City is required"),
  district: yup.string().required("District is required"),
  shippingOption: yup
    .string()
    .oneOf(["home", "branch"] as const)
    .required("Shipping method is required"),
  shippingFee: yup
    .number()
    .transform((val, orig) => (orig === "" ? 0 : val))
    .typeError("Enter a valid shipping fee")
    .min(0, "Shipping fee cannot be negative")
    .default(0),
  paymentMethod: yup
    .string()
    .oneOf(["COD", "Online", "Manual/Cash Received"] as const)
    .required("Payment method is required"),
  notes: yup.string().optional().default(""),
});

type CustomOrderFormData = yup.InferType<typeof schema>;

// ─────────────────────────────────────────────────────────────
// Options
// ─────────────────────────────────────────────────────────────

const districtOptions = districtsOfNepal.map((d) => ({ label: d, value: d }));

const shippingOptions = [
  { label: "Home Delivery", value: "home" },
  { label: "Branch Pickup", value: "branch" },
];

const paymentOptions = [
  { label: "Cash on Delivery (COD)", value: "COD" },
  { label: "Online Payment", value: "Online" },
  { label: "Manual / Cash Received", value: "Manual/Cash Received" },
];

// ─────────────────────────────────────────────────────────────
// Section header
// ─────────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <View className="mb-4 pb-2 border-b border-gray-100">
      <Typography variation="h4" className="text-brand-espresso">
        {title}
      </Typography>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Selected item row
// ─────────────────────────────────────────────────────────────

function SelectedItemRow({
  item,
  onRemove,
}: {
  item: PickerItem;
  onRemove: () => void;
}) {
  const imageUri = item.product.cover_image
    ? getProductImageUrl(item.product.cover_image)
    : null;

  return (
    <View
      className="flex-row items-center rounded-2xl px-3 py-2.5 gap-3 border border-gray-200"
      style={{ backgroundColor: "#F8F5F1" }}
    >
      <View className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <IconSymbol name="photo" size={16} color="#D1D5DB" />
          </View>
        )}
      </View>

      <View className="flex-1">
        <Typography
          variation="label"
          className="text-brand-espresso"
          numberOfLines={1}
        >
          {item.product.title}
        </Typography>
        <Typography variation="caption" className="text-ui-secondary mt-0.5">
          NPR {item.product.price.toLocaleString()} × {item.quantity}
        </Typography>
      </View>

      <TouchableOpacity
        onPress={onRemove}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        className="w-7 h-7 rounded-full bg-gray-200 items-center justify-center shrink-0"
      >
        <XIcon width={12} height={12} />
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────

export default function CustomOrderScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<PickerItem[]>([]);

  const { control, handleSubmit } = useForm<CustomOrderFormData>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      buyerName: "",
      buyerPhone: "",
      buyerEmail: "",
      street: "",
      city: "",
      district: "",
      shippingOption: "home",
      shippingFee: 0,
      paymentMethod: "COD",
      notes: "",
    },
  });

  const handleProductSelect = (items: PickerItem[]) => {
    setSelectedItems(items);
    setPickerVisible(false);
  };

  const removeItem = (productId: string) => {
    setSelectedItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const onSubmit = async (data: CustomOrderFormData) => {
    if (!user) return;
    if (selectedItems.length === 0) {
      toast.error("Please select at least one product.");
      return;
    }
    setLoading(true);
    try {
      const params: CreateCustomOrderParams = {
        seller_id: user.id,
        items: selectedItems.map(({ product, quantity }) => ({
          product_id: product.id,
          product_name: product.title,
          price: product.price,
          quantity,
          cover_image: product.cover_image ?? null,
        })),
        buyer_name: data.buyerName.trim(),
        buyer_email: data.buyerEmail?.trim() || "not-provided@thriftverse.app",
        buyer_phone: cleanNepaliPhone(data.buyerPhone),
        street: data.street.trim(),
        city: data.city.trim(),
        district: data.district,
        shipping_fee: data.shippingFee ?? 0,
        shipping_option: data.shippingOption as "home" | "branch",
        payment_method: data.paymentMethod as
          | "COD"
          | "Online"
          | "Manual/Cash Received",
        notes: data.notes?.trim() || undefined,
      };

      const result = await createCustomOrder(params);
      if (result.success) {
        toast.success("Custom order created!");
        router.replace("/(tabs)/orders");
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScreenLayout title="Custom Order" showBackButton paddingHorizontal={16}>
        <View className="pt-5 gap-5">
          {/* Products */}
          <View className="bg-white rounded-3xl p-5 shadow-sm">
            <SectionHeader title="Products" />
            <View className="gap-3">
              {/* Selected items list */}
              {selectedItems.length > 0 && (
                <View className="gap-2">
                  {selectedItems.map((item) => (
                    <SelectedItemRow
                      key={item.product.id}
                      item={item}
                      onRemove={() => removeItem(item.product.id)}
                    />
                  ))}
                </View>
              )}

              {/* Browse trigger */}
              <TouchableOpacity
                onPress={() => setPickerVisible(true)}
                activeOpacity={0.7}
                className="flex-row items-center gap-3 rounded-2xl px-4 py-3.5 border border-gray-200"
                style={{ backgroundColor: "#F8F5F1" }}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center shrink-0"
                  style={{ backgroundColor: "#EDE8E1" }}
                >
                  <IconSymbol name="cube" size={18} color="#6B5E52" />
                </View>
                <View className="flex-1">
                  <Typography variation="label" className="text-brand-espresso">
                    {selectedItems.length > 0
                      ? "Change products"
                      : "Browse your products"}
                  </Typography>
                  <Typography
                    variation="caption"
                    className="text-ui-secondary mt-0.5"
                  >
                    {selectedItems.length > 0
                      ? `${selectedItems.length} product${selectedItems.length > 1 ? "s" : ""} selected`
                      : "Pick items for this order"}
                  </Typography>
                </View>
                <IconSymbol name="chevron.right" size={15} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Buyer Information */}
          <View className="bg-white rounded-3xl p-5 shadow-sm">
            <SectionHeader title="Buyer Information" />
            <View className="gap-4">
              <RHFInput
                control={control}
                name="buyerName"
                label="Buyer Name"
                placeholder="Full name"
              />
              <RHFInput
                control={control}
                name="buyerPhone"
                label="Phone Number"
                placeholder="98XXXXXXXX"
                keyboardType="phone-pad"
                leftIcon={
                  <View className="flex-row items-center gap-2">
                    <Typography
                      variation="body"
                      className="text-brand-espresso font-sans-medium"
                    >
                      +977
                    </Typography>
                    <View
                      style={{
                        width: 1,
                        height: 20,
                        backgroundColor: "#E5E7EB",
                      }}
                    />
                  </View>
                }
              />
              <RHFInput
                control={control}
                name="buyerEmail"
                label="Email (Optional)"
                placeholder="buyer@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Delivery Address */}
          <View className="bg-white rounded-3xl p-5 shadow-sm">
            <SectionHeader title="Delivery Address" />
            <View className="gap-4">
              <RHFInput
                control={control}
                name="street"
                label="Street / Area"
                placeholder="e.g. Thamel, Kathmandu"
              />
              <RHFInput
                control={control}
                name="city"
                label="City"
                placeholder="e.g. Kathmandu"
              />
              <RHFSelect
                control={control}
                name="district"
                label="District"
                placeholder="Select district"
                options={districtOptions}
                searchable
                searchPlaceholder="Search district..."
              />
            </View>
          </View>

          {/* Shipping & Payment */}
          <View className="bg-white rounded-3xl p-5 shadow-sm">
            <SectionHeader title="Shipping & Payment" />
            <View className="gap-4">
              <RHFSelect
                control={control}
                name="shippingOption"
                label="Shipping Method"
                placeholder="Select method"
                options={shippingOptions}
                searchable={false}
              />
              <RHFInput
                control={control}
                name="shippingFee"
                label="Shipping Fee (NPR)"
                placeholder="0"
                keyboardType="numeric"
              />
              <RHFSelect
                control={control}
                name="paymentMethod"
                label="Payment Method"
                placeholder="Select payment"
                options={paymentOptions}
                searchable={false}
              />
            </View>
          </View>

          {/* Notes */}
          <View className="bg-white rounded-3xl p-5 shadow-sm">
            <SectionHeader title="Notes (Optional)" />
            <RHFTextarea
              control={control}
              name="notes"
              placeholder="Any special instructions or notes for this order..."
              numberOfLines={4}
              maxLength={500}
            />
          </View>

          {/* Submit */}
          <Button
            label="Create Order"
            variant="primary"
            onPress={handleSubmit(onSubmit)}
            isLoading={loading}
            disabled={loading}
            fullWidth
            iconPosition="right"
            icon={<RightArrowIcon width={20} height={20} color="#fff" />}
          />
        </View>
      </ScreenLayout>

      <ProductPickerModal
        visible={pickerVisible}
        onDismiss={() => setPickerVisible(false)}
        onSelect={handleProductSelect}
        initialSelection={selectedItems}
      />
    </>
  );
}
