import {
  Select,
  SelectOption,
  SelectVariant,
} from "@/components/ui/Select/Select";
import React from "react";
import {
  Controller,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";

interface RHFSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends UseControllerProps<TFieldValues, TName> {
  label?: string;
  placeholder?: string;
  variant?: SelectVariant;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  options: SelectOption[];
  searchable?: boolean;
  searchPlaceholder?: string;
  modalTitle?: string;
  disabled?: boolean;
}

/**
 * RHFSelect Component
 *
 * React Hook Form integrated select field that wraps the base Select component.
 * Uses Controller for seamless form state management.
 *
 * @example
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { RHFSelect } from "@/components/forms/ReactHookForm/RHFSelect";
 *
 * const districtOptions = [
 *   { label: "Kathmandu", value: "Kathmandu" },
 *   { label: "Lalitpur", value: "Lalitpur" },
 * ];
 *
 * export function MyForm() {
 *   const { control, handleSubmit } = useForm({
 *     defaultValues: { district: "" }
 *   });
 *
 *   return (
 *     <RHFSelect
 *       control={control}
 *       name="district"
 *       label="District"
 *       placeholder="Select your district"
 *       options={districtOptions}
 *       rules={{ required: "District is required" }}
 *     />
 *   );
 * }
 * ```
 */
export function RHFSelect<
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
  containerClassName,
  labelClassName,
  options,
  searchable,
  searchPlaceholder,
  modalTitle,
  disabled,
}: RHFSelectProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Select
          label={label}
          placeholder={placeholder}
          variant={error ? "error" : variant}
          leftIcon={leftIcon}
          containerClassName={containerClassName}
          labelClassName={labelClassName}
          errorMessage={error?.message}
          value={value ?? ""}
          options={options}
          onChange={onChange}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          modalTitle={modalTitle}
          disabled={disabled}
        />
      )}
    />
  );
}

export default RHFSelect;
