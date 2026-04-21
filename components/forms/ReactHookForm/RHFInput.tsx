import { Input, InputVariant } from "@/components/ui/Input/Input";
import React from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { TextInputProps } from "react-native";

interface RHFInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>
  extends
    UseControllerProps<TFieldValues, TName>,
    Omit<TextInputProps, "value" | "onChangeText" | "onBlur" | "defaultValue"> {
  label?: string;
  placeholder?: string;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  helperText?: string;
}

/**
 * RHFInput Component
 *
 * React Hook Form integrated input field that wraps the base Input component.
 * Uses useController for seamless form state management.
 *
 * @example
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { RHFInput } from "@/components/forms/RHFInput";
 *
 * export function MyForm() {
 *   const { control, handleSubmit } = useForm({
 *     defaultValues: { email: "" }
 *   });
 *
 *   return (
 *     <RHFInput
 *       control={control}
 *       name="email"
 *       label="Email Address"
 *       placeholder="Enter your email"
 *       rules={{ required: "Email is required" }}
 *     />
 *   );
 * }
 * ```
 */
export function RHFInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  rules,
  defaultValue,
  shouldUnregister,
  label,
  placeholder,
  variant = "default",
  leftIcon,
  rightIcon,
  containerClassName,
  inputClassName,
  labelClassName,
  helperText,
  secureTextEntry = false,
  ...textInputProps
}: RHFInputProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <Input
          label={label}
          placeholder={placeholder}
          variant={error ? "error" : variant}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          containerClassName={containerClassName}
          inputClassName={inputClassName}
          labelClassName={labelClassName}
          errorMessage={error?.message}
          value={value ?? ""}
          onChangeText={onChange}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          {...textInputProps}
        />
      )}
    />
  );
}

export default RHFInput;
