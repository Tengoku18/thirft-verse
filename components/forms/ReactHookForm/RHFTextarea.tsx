import { Textarea, TextareaVariant } from "@/components/ui/TextareaInput";
import React from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { TextInputProps } from "react-native";

interface RHFTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>
  extends
    UseControllerProps<TFieldValues, TName>,
    Omit<
      TextInputProps,
      "value" | "onChangeText" | "onBlur" | "defaultValue" | "multiline"
    > {
  label?: string;
  placeholder?: string;
  variant?: TextareaVariant;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  maxLength?: number;
  numberOfLines?: number;
  informationMessage?: string;
  infoMessageType?: "default" | "secondary";
}

/**
 * RHFTextarea Component
 *
 * React Hook Form integrated textarea field that wraps the base Textarea component.
 * Uses Controller for seamless form state management.
 *
 * @example
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { RHFTextarea } from "@/components/forms/ReactHookForm";
 *
 * export function MyForm() {
 *   const { control, handleSubmit } = useForm({
 *     defaultValues: { bio: "" }
 *   });
 *
 *   return (
 *     <RHFTextarea
 *       control={control}
 *       name="bio"
 *       label="Bio"
 *       placeholder="Tell us about yourself"
 *       maxLength={500}
 *       numberOfLines={6}
 *       informationMessage="Your bio is the first thing buyers see."
 *       infoMessageType="secondary"
 *       rules={{ required: "Bio is required" }}
 *     />
 *   );
 * }
 * ```
 */
export function RHFTextarea<
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
  containerClassName,
  inputClassName,
  labelClassName,
  maxLength = 500,
  numberOfLines = 6,
  informationMessage,
  infoMessageType = "default",
  ...textInputProps
}: RHFTextareaProps<TFieldValues, TName>) {
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
        <Textarea
          label={label}
          placeholder={placeholder}
          variant={error ? "error" : variant}
          containerClassName={containerClassName}
          inputClassName={inputClassName}
          labelClassName={labelClassName}
          errorMessage={error?.message}
          value={value ?? ""}
          onChangeText={onChange}
          onBlur={onBlur}
          maxLength={maxLength}
          numberOfLines={numberOfLines}
          informationMessage={informationMessage}
          infoMessageType={infoMessageType}
          {...textInputProps}
        />
      )}
    />
  );
}

export default RHFTextarea;
