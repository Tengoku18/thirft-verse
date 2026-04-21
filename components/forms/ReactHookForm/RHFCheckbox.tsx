import { Checkbox, CheckboxVariant } from "@/components/ui/Checkbox/Checkbox";
import React, { ReactNode } from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";

interface RHFCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends UseControllerProps<TFieldValues, TName> {
  label?: string | ReactNode;
  variant?: CheckboxVariant;
  containerClassName?: string;
  checkboxClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
}

/**
 * RHFCheckbox Component
 *
 * React Hook Form integrated checkbox field that wraps the base Checkbox component.
 * Uses useController for seamless form state management.
 *
 * @example
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { RHFCheckbox } from "@/components/forms/ReactHookForm";
 *
 * export function MyForm() {
 *   const { control, handleSubmit } = useForm({
 *     defaultValues: { rememberMe: false }
 *   });
 *
 *   return (
 *     <RHFCheckbox
 *       control={control}
 *       name="rememberMe"
 *       label="Remember me"
 *     />
 *   );
 * }
 * ```
 */
export function RHFCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  rules,
  defaultValue,
  shouldUnregister,
  label,
  variant = "default",
  containerClassName,
  checkboxClassName,
  labelClassName,
  disabled = false,
}: RHFCheckboxProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Checkbox
          checked={value ?? false}
          onPress={onChange}
          label={label}
          variant={variant}
          containerClassName={containerClassName}
          checkboxClassName={checkboxClassName}
          labelClassName={labelClassName}
          disabled={disabled}
          errorMessage={error?.message}
        />
      )}
    />
  );
}

export default RHFCheckbox;
