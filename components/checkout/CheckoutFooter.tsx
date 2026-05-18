import { BagIcon, RightArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { formatPrice, PaymentMethod } from "@/lib/validations/checkout";
import React from "react";
import { View } from "react-native";

interface Props {
  step: number;
  isLastStep: boolean;
  showTotal: boolean;
  total: number;
  payment: PaymentMethod | undefined;
  submitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const continueLabel = (step: number) =>
  step === 1 ? "Continue to Payment" : "Review Order";

const submitLabel = (
  payment: PaymentMethod | undefined,
  total: number,
  submitting: boolean,
) => {
  if (submitting) return "Placing Order…";
  if (payment === "esewa" || payment === "fonepay")
    return `Pay ${formatPrice(total)}`;
  return `Place Order — ${formatPrice(total)}`;
};

export function CheckoutFooter({
  step,
  isLastStep,
  showTotal,
  total,
  payment,
  submitting,
  onBack,
  onNext,
  onSubmit,
}: Props) {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 pt-3 pb-8 gap-3">
      {showTotal && (
        <View className="flex-row justify-between items-center">
          <Typography variation="body-sm" className="text-ui-secondary">
            Total
          </Typography>
          <Typography variation="h4" className="text-brand-espresso">
            {formatPrice(total)}
          </Typography>
        </View>
      )}

      {isLastStep ? (
        <Button
          label={submitLabel(payment, total, submitting)}
          variant="primary"
          onPress={onSubmit}
          disabled={submitting}
          icon={<BagIcon width={18} height={18} color="#FFFFFF" />}
          noShadow
        />
      ) : (
        <Button
          label={continueLabel(step)}
          variant="primary"
          onPress={onNext}
          icon={<RightArrowIcon width={18} height={18} color="#FFFFFF" />}
          iconPosition="right"
          noShadow
        />
      )}
    </View>
  );
}
