import * as yup from "yup";

const MIN_WITHDRAWAL = 100;
const MAX_WITHDRAWAL = 50000;

const formatAmount = (amount: number) =>
  `रु ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const createWithdrawSchema = (availableBalance: number) =>
  yup.object({
    amount: yup
      .number()
      .typeError("Please enter a valid amount")
      .required("Please enter a withdrawal amount")
      .positive("Amount must be greater than zero")
      .min(MIN_WITHDRAWAL, `Minimum withdrawal is ${formatAmount(MIN_WITHDRAWAL)}`)
      .max(MAX_WITHDRAWAL, `Maximum single withdrawal is ${formatAmount(MAX_WITHDRAWAL)}`)
      .test(
        "not-exceed-balance",
        `Amount exceeds your available balance (${formatAmount(availableBalance)})`,
        (value) => value == null || value <= availableBalance,
      ),
    note: yup.string().max(300, "Note cannot exceed 300 characters").default(""),
  });

export type WithdrawFormData = yup.InferType<ReturnType<typeof createWithdrawSchema>>;
