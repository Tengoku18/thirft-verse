import React from "react";
import { ActivityIndicator, TextInput, TouchableOpacity, View } from "react-native";
import { useFormContext } from "react-hook-form";
import { Typography } from "@/components/ui/Typography";
import type { AppliedCheckoutOffer } from "@/lib/database-helpers";
import {
  CheckoutForm,
  PaymentMethod,
  ShippingOption,
  formatPrice,
} from "@/lib/validations/checkout";

interface Props {
  unitPrice: number;
  quantity: number;
  shippingFee: number;
  total: number;
  offerInput: string;
  onOfferInputChange: (v: string) => void;
  appliedOffer: AppliedCheckoutOffer | null;
  offerError: string | null;
  offerLoading: boolean;
  onApplyOffer: () => void;
  onRemoveOffer: () => void;
}

const shippingLabel = (s: ShippingOption | undefined) =>
  s === "home" ? "Home Delivery" : s === "branch" ? "Branch Pickup" : "—";

const paymentLabel = (p: PaymentMethod | undefined) =>
  p === "cod"
    ? "Cash on Delivery"
    : p === "esewa"
      ? "eSewa"
      : p === "fonepay"
        ? "FonePay"
        : "—";

export function ReviewStep({
  unitPrice,
  quantity,
  shippingFee,
  total,
  offerInput,
  onOfferInputChange,
  appliedOffer,
  offerError,
  offerLoading,
  onApplyOffer,
  onRemoveOffer,
}: Props) {
  const { getValues } = useFormContext<CheckoutForm>();
  const v = getValues();
  const subtotal = unitPrice * quantity;
  const discount = appliedOffer?.discountAmount ?? 0;

  return (
    <View className="gap-3">
      <Typography variation="h4" className="text-brand-espresso">
        Review Your Order
      </Typography>

      <View className="bg-white rounded-2xl p-4 border border-slate-100 gap-1">
        <Typography
          variation="caption"
          className="text-ui-secondary uppercase tracking-widest font-bold mb-1"
        >
          Shipping To
        </Typography>
        <Typography
          variation="body-sm"
          className="text-brand-espresso font-semibold"
        >
          {v.buyerName}
        </Typography>
        <Typography variation="body-sm" className="text-ui-secondary">
          {v.buyerEmail}
        </Typography>
        <Typography variation="body-sm" className="text-ui-secondary">
          {v.buyerPhone}
        </Typography>
        <Typography variation="body-sm" className="text-ui-secondary">
          {v.street}, {v.city}, {v.district}
        </Typography>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 bg-white rounded-2xl p-4 border border-slate-100">
          <Typography
            variation="caption"
            className="text-ui-secondary uppercase tracking-widest font-bold mb-1"
          >
            Delivery
          </Typography>
          <Typography
            variation="body-sm"
            className="text-brand-espresso font-semibold"
          >
            {shippingLabel(v.shipping as ShippingOption | undefined)}
          </Typography>
          <Typography variation="caption" className="text-amber-700">
            +{formatPrice(shippingFee)}
          </Typography>
        </View>
        <View className="flex-1 bg-white rounded-2xl p-4 border border-slate-100">
          <Typography
            variation="caption"
            className="text-ui-secondary uppercase tracking-widest font-bold mb-1"
          >
            Payment
          </Typography>
          <Typography
            variation="body-sm"
            className="text-brand-espresso font-semibold"
          >
            {paymentLabel(v.payment as PaymentMethod | undefined)}
          </Typography>
        </View>
      </View>

      {/* Offer code */}
      <View className="bg-white rounded-2xl p-4 border border-slate-100 gap-2">
        <Typography
          variation="caption"
          className="text-ui-secondary uppercase tracking-widest font-bold"
        >
          Offer Code
        </Typography>

        {appliedOffer ? (
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Typography
                variation="body-sm"
                className="text-brand-espresso font-bold"
              >
                {appliedOffer.code} applied
              </Typography>
              <Typography variation="caption" className="text-emerald-600">
                {appliedOffer.discountPercent}% off · −
                {formatPrice(appliedOffer.discountAmount)}
              </Typography>
            </View>
            <TouchableOpacity
              onPress={onRemoveOffer}
              activeOpacity={0.7}
              className="px-3 py-2 rounded-lg"
              style={{ backgroundColor: "rgba(59,47,47,0.06)" }}
            >
              <Typography
                variation="caption"
                className="text-brand-espresso font-bold"
              >
                Remove
              </Typography>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View className="flex-row gap-2">
              <View
                className="flex-1 rounded-xl border border-slate-200 px-3"
                style={{ justifyContent: "center" }}
              >
                <TextInput
                  value={offerInput}
                  onChangeText={onOfferInputChange}
                  placeholder="Enter code"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  editable={!offerLoading}
                  placeholderTextColor="#9CA3AF"
                  style={{
                    fontSize: 14,
                    color: "#3B2F2F",
                    paddingVertical: 12,
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={onApplyOffer}
                activeOpacity={0.85}
                disabled={offerLoading || offerInput.trim().length === 0}
                className="px-5 rounded-xl items-center justify-center"
                style={{
                  backgroundColor:
                    offerLoading || offerInput.trim().length === 0
                      ? "rgba(59,47,47,0.3)"
                      : "#3B2F2F",
                }}
              >
                {offerLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Typography
                    variation="label"
                    style={{ color: "#FFFFFF", fontSize: 14 }}
                  >
                    Apply
                  </Typography>
                )}
              </TouchableOpacity>
            </View>
            {offerError && (
              <Typography variation="caption" className="text-red-500">
                {offerError}
              </Typography>
            )}
          </>
        )}
      </View>

      <View className="bg-white rounded-2xl p-4 border border-slate-100 gap-2">
        <View className="flex-row justify-between">
          <Typography variation="body-sm" className="text-ui-secondary">
            Subtotal ({quantity}×{formatPrice(unitPrice)})
          </Typography>
          <Typography variation="body-sm" className="text-brand-espresso">
            {formatPrice(subtotal)}
          </Typography>
        </View>
        {discount > 0 && (
          <View className="flex-row justify-between">
            <Typography variation="body-sm" className="text-emerald-600">
              Discount ({appliedOffer?.code})
            </Typography>
            <Typography variation="body-sm" className="text-emerald-600">
              −{formatPrice(discount)}
            </Typography>
          </View>
        )}
        <View className="flex-row justify-between">
          <Typography variation="body-sm" className="text-ui-secondary">
            Shipping
          </Typography>
          <Typography variation="body-sm" className="text-amber-700">
            +{formatPrice(shippingFee)}
          </Typography>
        </View>
        <View className="h-px bg-slate-100 my-1" />
        <View className="flex-row justify-between">
          <Typography variation="h4" className="text-brand-espresso">
            Total
          </Typography>
          <Typography variation="h3" className="text-brand-espresso">
            {formatPrice(total)}
          </Typography>
        </View>
      </View>
    </View>
  );
}
