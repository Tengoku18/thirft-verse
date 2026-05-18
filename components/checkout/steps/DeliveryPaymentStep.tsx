import React from "react";
import { View } from "react-native";
import { useFormContext, useWatch } from "react-hook-form";
import { CreditCardIcon, HomeIcon, StoreIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import {
  CheckoutForm,
  PaymentMethod,
  SHIPPING_FEES,
  ShippingOption,
  formatPrice,
} from "@/lib/validations/checkout";
import { SelectionCard } from "../SelectionCard";

const PAYMENT_OPTIONS: { value: PaymentMethod; title: string; sub: string }[] = [
  { value: "cod", title: "Cash on Delivery", sub: "Pay when your order arrives" },
  // TODO: Temporarily disabled — re-enable eSewa & FonePay after integration work.
  // { value: "esewa", title: "eSewa", sub: "Pay via eSewa digital wallet" },
  // { value: "fonepay", title: "FonePay", sub: "Pay via FonePay" },
];

export function DeliveryPaymentStep() {
  const { control, setValue, formState } = useFormContext<CheckoutForm>();
  const shipping = useWatch({ control, name: "shipping" });
  const payment = useWatch({ control, name: "payment" });
  const shippingError = formState.errors.shipping?.message;
  const paymentError = formState.errors.payment?.message;

  const selectShipping = (value: ShippingOption) => {
    setValue("shipping", value, { shouldValidate: true, shouldDirty: true });
  };

  const selectPayment = (value: PaymentMethod) => {
    setValue("payment", value, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <View className="gap-6">
      <View className="gap-3">
        <Typography variation="h4" className="text-brand-espresso">
          How should we send it?
        </Typography>

        <SelectionCard
          selected={shipping === "home"}
          onPress={() => selectShipping("home")}
          icon={<HomeIcon width={20} height={20} color="#3B3030" />}
          title="Home Delivery"
          subtitle="Delivered to your address"
          trailingText={`+${formatPrice(SHIPPING_FEES.home)}`}
        />
        <SelectionCard
          selected={shipping === "branch"}
          onPress={() => selectShipping("branch")}
          icon={<StoreIcon width={20} height={20} color="#3B3030" />}
          title="Branch Pickup"
          subtitle="Pick up at nearest branch"
          trailingText={`+${formatPrice(SHIPPING_FEES.branch)}`}
        />

        {shippingError && (
          <Typography variation="caption" className="text-red-500 px-1">
            {shippingError}
          </Typography>
        )}
      </View>

      <View className="gap-3">
        <Typography variation="h4" className="text-brand-espresso">
          Payment Method
        </Typography>

        {PAYMENT_OPTIONS.map((opt) => (
          <SelectionCard
            key={opt.value}
            selected={payment === opt.value}
            onPress={() => selectPayment(opt.value)}
            icon={<CreditCardIcon width={20} height={20} color="#3B3030" />}
            title={opt.title}
            subtitle={opt.sub}
          />
        ))}

        {paymentError && (
          <Typography variation="caption" className="text-red-500 px-1">
            {paymentError}
          </Typography>
        )}

        {(payment === "esewa" || payment === "fonepay") && (
          <View className="bg-amber-50 rounded-2xl p-3 border border-amber-200">
            <Typography variation="caption" className="text-amber-800">
              You&apos;ll be redirected to the{" "}
              {payment === "esewa" ? "eSewa" : "FonePay"} payment page to
              complete your purchase.
            </Typography>
          </View>
        )}
      </View>
    </View>
  );
}
