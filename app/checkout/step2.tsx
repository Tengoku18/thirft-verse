import {
  CheckoutFooter,
  DeliveryPaymentStep,
  ProductSummaryCard,
} from "@/components/checkout";
import { ScreenLayout } from "@/components/layouts";
import { Stepper } from "@/components/ui/Stepper/Stepper";
import { useToast } from "@/contexts/ToastContext";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import {
  PaymentMethod,
  SHIPPING_FEES,
  ShippingOption,
  STEP_FIELDS,
} from "@/lib/validations/checkout";
import { setCheckoutData } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "expo-router";
import React from "react";
import { FormProvider } from "react-hook-form";
import { ScrollView, View } from "react-native";

export default function CheckoutStep2() {
  const router = useRouter();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const { form, product, quantity, checkout } = useCheckoutForm();

  const shipping = form.watch("shipping") as ShippingOption | undefined;
  const payment = form.watch("payment") as PaymentMethod | undefined;

  if (!product) return null;

  const subtotal = product.price * quantity;
  const discount =
    checkout.appliedOffer && checkout.appliedOffer.itemsSubtotal === subtotal
      ? checkout.appliedOffer.discountAmount
      : 0;
  const shippingFee = shipping ? SHIPPING_FEES[shipping] : 0;
  const total = subtotal - discount + shippingFee;

  const handleNext = async () => {
    try {
      const ok = await form.trigger(STEP_FIELDS[2]);
      if (!ok) {
        toast.error("Please choose delivery and payment");
        return;
      }
      const v = form.getValues();
      dispatch(
        setCheckoutData({
          shipping: v.shipping as ShippingOption,
          payment: v.payment as PaymentMethod,
        }),
      );
      router.push("/checkout/step3");
    } catch (e: any) {
      console.error("checkout step2 → next failed", e);
      toast.error(e?.message ?? "Couldn't continue. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <ScreenLayout
        title="Checkout"
        contentBackgroundColor="#F5F5F5"
        paddingHorizontal={0}
        scrollable={false}
      >
        <FormProvider {...form}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 160 }}
            keyboardShouldPersistTaps="handled"
          >
            <Stepper title="Payment" currentStep={2} totalSteps={3} />
            <View className="px-4 pt-2 gap-4">
              <ProductSummaryCard
                coverImage={product.cover_image}
                title={product.title}
                quantity={quantity}
                unitPrice={product.price}
              />
              <DeliveryPaymentStep />
            </View>
          </ScrollView>
        </FormProvider>
      </ScreenLayout>

      <CheckoutFooter
        step={2}
        isLastStep={false}
        showTotal={!!shipping}
        total={total}
        payment={payment}
        submitting={false}
        onBack={() => router.back()}
        onNext={handleNext}
        onSubmit={() => {}}
      />
    </View>
  );
}
