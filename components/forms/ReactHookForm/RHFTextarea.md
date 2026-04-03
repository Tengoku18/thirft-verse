# RHFTextarea Component

## Overview

The `RHFTextarea` component is a React Hook Form integrated textarea field that builds on top of the base `Textarea` component. It provides seamless form state management using `Controller` hook from React Hook Form.

## Location

- **File:** `components/forms/ReactHookForm/RHFTextarea.tsx`
- **Export:** `components/forms/ReactHookForm/index.ts`

## Features

✅ Full React Hook Form integration via `Controller`
✅ Automatic error handling and display
✅ Form validation support with custom rules
✅ Inherits all Textarea component styling and variants
✅ Character counter support
✅ Information box support (default/secondary)
✅ TypeScript support with full type safety
✅ Supports all TextInput props from React Native

## Props

All props extend both `UseControllerProps` and `TextInputProps`:

### React Hook Form Props

| Prop               | Type                      | Description                                          |
| ------------------ | ------------------------- | ---------------------------------------------------- |
| `control`          | `Control<TFieldValues>`   | **Required** - Form control object from `useForm()`  |
| `name`             | `FieldPath<TFieldValues>` | **Required** - Field name (must match form schema)   |
| `rules`            | `RegisterOptions`         | Validation rules (required, pattern, min, max, etc.) |
| `defaultValue`     | `any`                     | Default field value                                  |
| `shouldUnregister` | `boolean`                 | Should unregister field on unmount                   |

### UI Props

| Prop                 | Type                                              | Default     | Description                                                |
| -------------------- | ------------------------------------------------- | ----------- | ---------------------------------------------------------- |
| `label`              | `string`                                          | -           | Field label text                                           |
| `placeholder`        | `string`                                          | -           | Placeholder text                                           |
| `variant`            | `"default" \| "error" \| "success" \| "disabled"` | `"default"` | Visual variant (error automatically applied on validation) |
| `containerClassName` | `string`                                          | -           | Custom container classes                                   |
| `inputClassName`     | `string`                                          | -           | Custom input classes                                       |
| `labelClassName`     | `string`                                          | -           | Custom label classes                                       |
| `maxLength`          | `number`                                          | `500`       | Maximum characters allowed                                 |
| `numberOfLines`      | `number`                                          | `6`         | Default number of text lines                               |
| `informationMessage` | `string`                                          | -           | Info box message below textarea                            |
| `infoMessageType`    | `"default" \| "secondary"`                        | `"default"` | Info box styling type                                      |

## Basic Usage

```tsx
import { useForm } from "react-hook-form";
import { RHFTextarea } from "@/components/forms/ReactHookForm";
import { Button, View } from "react-native";

export function BioForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      bio: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <View className="gap-4">
      <RHFTextarea
        control={control}
        name="bio"
        label="Store Bio"
        placeholder="Share your thrift story, style aesthetic, and shipping info..."
        maxLength={500}
        numberOfLines={6}
        informationMessage="Your bio is the first thing buyers see. Share your thrift story!"
        infoMessageType="secondary"
        rules={{
          required: "Bio is required",
          minLength: {
            value: 10,
            message: "Bio must be at least 10 characters",
          },
        }}
      />

      <Button title="Save Bio" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
```

## Validation Examples

### Required Field

```tsx
<RHFTextarea
  control={control}
  name="bio"
  label="Bio"
  rules={{ required: "Bio is required" }}
/>
```

### Min/Max Length

```tsx
<RHFTextarea
  control={control}
  name="bio"
  label="Bio"
  rules={{
    required: "Bio is required",
    minLength: { value: 10, message: "Minimum 10 characters" },
    maxLength: { value: 500, message: "Maximum 500 characters" },
  }}
/>
```

### Custom Validation

```tsx
<RHFTextarea
  control={control}
  name="bio"
  label="Bio"
  rules={{
    required: "Bio is required",
    validate: (value) => {
      if (value.length < 20) return "Bio must be at least 20 characters";
      if (!value.includes("thrift")) return "Bio must mention 'thrift'";
      return true;
    },
  }}
/>
```

## Integration with Other Form Components

```tsx
import { useForm } from "react-hook-form";
import {
  RHFInput,
  RHFTextarea,
  RHFSelect,
} from "@/components/forms/ReactHookForm";
import { Button, View } from "react-native";

const districtOptions = [
  { label: "Kathmandu", value: "kathmandu" },
  { label: "Lalitpur", value: "lalitpur" },
];

export function StoreForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      storeName: "",
      bio: "",
      district: "",
    },
  });

  return (
    <View className="gap-4">
      <RHFInput
        control={control}
        name="storeName"
        label="Store Name"
        placeholder="Enter store name"
        rules={{ required: "Store name is required" }}
      />

      <RHFTextarea
        control={control}
        name="bio"
        label="Store Bio"
        placeholder="Tell your story..."
        maxLength={500}
        informationMessage="Share your thrift story!"
        infoMessageType="secondary"
        rules={{ required: "Bio is required" }}
      />

      <RHFSelect
        control={control}
        name="district"
        label="District"
        placeholder="Select district"
        options={districtOptions}
        searchable
        rules={{ required: "District is required" }}
      />

      <Button title="Save" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
```

## Comparison with RHFInput and RHFSelect

| Feature            | RHFInput | RHFTextarea | RHFSelect |
| ------------------ | -------- | ----------- | --------- |
| Single line input  | ✅       | ❌          | ❌        |
| Multi-line input   | ❌       | ✅          | ❌        |
| Dropdown selection | ❌       | ❌          | ✅        |
| Character counter  | ❌       | ✅          | ❌        |
| Information box    | ❌       | ✅          | ❌        |
| Icon support       | ✅       | ❌          | ❌        |
| Searchable         | ❌       | ❌          | ✅        |

## Best Practices

1. **Always use `control` from `useForm()`** - Never create multiple form contexts
2. **Define validation at field level** - Use the `rules` prop for field-specific validation
3. **Handle form submission with `handleSubmit`** - Let React Hook Form manage submissions
4. **Provide clear error messages** - Help users understand validation requirements
5. **Use information box for hints** - Guide users with the `informationMessage` prop
6. **Set appropriate maxLength** - Prevent excessive input in bios/descriptions

## TypeScript Support

Full TypeScript support with strict typing:

```tsx
interface StoreFormData {
  storeName: string;
  bio: string;
  district: string;
}

export function StoreForm() {
  const { control, handleSubmit } = useForm<StoreFormData>({
    defaultValues: {
      storeName: "",
      bio: "",
      district: "",
    },
  });

  // Type-safe field names
  return (
    <RHFTextarea
      control={control}
      name="bio" // ✅ TypeScript checks this
      // name="invalidField" // ❌ TypeScript error
    />
  );
}
```
