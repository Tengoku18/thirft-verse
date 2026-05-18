import {
  CheckoutFooter,
  DetailsStep,
  ProductSummaryCard,
} from "@/components/checkout";
import { ScreenLayout } from "@/components/layouts";
import { Stepper } from "@/components/ui/Stepper/Stepper";
import { useToast } from "@/contexts/ToastContext";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import { STEP_FIELDS } from "@/lib/validations/checkout";
import { resetCheckout, setCheckoutData, setCheckoutQuantity } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { ScrollView, View } from "react-native";

/**
 * Step 1 of checkout (Details) — this IS the `/checkout` screen, so entering
 * checkout lands here directly with no redirect bounce. It also starts a
 * fresh checkout session: clears any stale slice data and seeds the quantity
 * from the route. Steps 2 and 3 are separate screens (checkout/step2, step3).
 */
export default function CheckoutIndex() {
  const router = useRouter();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const { quantity: quantityParam } = useLocalSearchParams<{
    quantity?: string;
  }>();
  const qty = parseInt(quantityParam ?? "1", 10) || 1;

  // Fresh session on every entry: clear previous data, seed quantity.
  useEffect(() => {
    dispatch(resetCheckout());
    dispatch(setCheckoutQuantity(qty));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { form, product } = useCheckoutForm();

  if (!product) return null;

  const handleNext = async () => {
    try {
      const ok = await form.trigger(STEP_FIELDS[1]);
      if (!ok) {
        toast.error("Please fix the errors above");
        return;
      }
      const v = form.getValues();
      dispatch(
        setCheckoutData({
          buyerName: v.buyerName,
          buyerEmail: v.buyerEmail,
          buyerPhone: v.buyerPhone,
          street: v.street,
          city: v.city,
          district: v.district,
          buyerNotes: v.buyerNotes ?? "",
        }),
      );
      router.push("/checkout/step2");
    } catch (e: any) {
      console.error("checkout step1 → next failed", e);
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
            <Stepper title="Details" currentStep={1} totalSteps={3} />
            <View className="px-4 pt-2 gap-4">
              <ProductSummaryCard
                coverImage={product.cover_image}
                title={product.title}
                quantity={qty}
                unitPrice={product.price}
              />
              <DetailsStep control={form.control} />
            </View>
          </ScrollView>
        </FormProvider>
      </ScreenLayout>

      <CheckoutFooter
        step={1}
        isLastStep={false}
        showTotal={false}
        total={0}
        payment={undefined}
        submitting={false}
        onBack={() => router.back()}
        onNext={handleNext}
        onSubmit={() => {}}
      />
    </View>
  );
}
