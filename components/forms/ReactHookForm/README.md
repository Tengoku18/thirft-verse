# React Hook Form Input Component (RHFInput)

## Overview

The `RHFInput` component is a React Hook Form integrated input field that builds on top of the base `Input` component from `/components/ui/Input/Input.tsx`. It provides seamless form state management using `useController` hook from React Hook Form.

## Location

- **File:** `components/forms/RHFInput.tsx`
- **Export:** `components/forms/index.ts`

## Naming Convention

- **Component Name:** `RHFInput`
- **Prefix:** `RHF` = React Hook Form
- **Directory:** `forms/` indicates form-related components

## Features

✅ Full React Hook Form integration via `useController`
✅ Automatic error handling and display  
✅ Form validation support with custom rules  
✅ Inherits all Input component styling and variants
✅ TypeScript support with full type safety
✅ Supports all TextInput props from React Native

## Basic Usage

```tsx
import { useForm } from "react-hook-form";
import { RHFInput } from "@/components/forms";
import { Button, View } from "react-native";

export function SignupForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <View className="gap-4">
      <RHFInput
        control={control}
        name="email"
        label="Email Address"
        placeholder="Enter your email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        }}
      />

      <RHFInput
        control={control}
        name="password"
        label="Password"
        placeholder="Enter your password"
        secureTextEntry={true}
        rules={{
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        }}
      />

      <Button title="Sign Up" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
```

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

| Prop                 | Type                                              | Default     | Description                                                        |
| -------------------- | ------------------------------------------------- | ----------- | ------------------------------------------------------------------ |
| `label`              | `string`                                          | -           | Field label text                                                   |
| `placeholder`        | `string`                                          | -           | Placeholder text                                                   |
| `variant`            | `"default" \| "error" \| "success" \| "disabled"` | `"default"` | Visual variant (error automatically applied on validation failure) |
| `leftIcon`           | `React.ReactNode`                                 | -           | Icon to display on left side                                       |
| `rightIcon`          | `React.ReactNode`                                 | -           | Icon to display on right side                                      |
| `containerClassName` | `string`                                          | -           | Custom container classes                                           |
| `inputClassName`     | `string`                                          | -           | Custom input classes                                               |
| `labelClassName`     | `string`                                          | -           | Custom label classes                                               |
| `helperText`         | `string`                                          | -           | Helper text below field                                            |

### TextInput Props

All standard React Native `TextInputProps` are supported:

- `secureTextEntry`
- `keyboardType`
- `editable`
- `maxLength`
- `multiline`
- etc.

## Validation Examples

```tsx
// Email validation with pattern
<RHFInput
  control={control}
  name="email"
  rules={{
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  }}
/>

// Password with multiple rules
<RHFInput
  control={control}
  name="password"
  secureTextEntry
  rules={{
    required: "Password is required",
    minLength: { value: 8, message: "Minimum 8 characters" },
    validate: (value) => {
      if (!/[A-Z]/.test(value)) return "Must contain uppercase letter";
      if (!/[0-9]/.test(value)) return "Must contain number";
      return true;
    },
  }}
/>

// Conditional validation with watch
const { control, watch } = useForm();
const password = watch("password");

<RHFInput
  control={control}
  name="confirmPassword"
  label="Confirm Password"
  secureTextEntry
  rules={{
    required: "Please confirm password",
    validate: (value) => value === password || "Passwords do not match",
  }}
/>
```

## Component Structure

```
components/
├── ui/
│   └── Input/
│       └── Input.tsx (Base unstyled input)
└── forms/
    ├── RHFInput.tsx (React Hook Form wrapper)
    └── index.ts (Exports)
```

## Related Components

- **Input** (`/components/ui/Input/Input.tsx`) - Base input component
- **Other Form Components** - Coming soon (RHFSelect, RHFTextarea, etc.)

## Best Practices

1. **Always use `control` from `useForm()`** - Never create multiple form contexts
2. **Define validation at field level** - Use the `rules` prop for field-specific validation
3. **Handle form submission with `handleSubmit`** - Let React Hook Form manage submissions
4. **Clear error messages** - Provide helpful validation messages for better UX
5. **Set appropriate keyboard types** - Use `keyboardType` for email, phone, numeric inputs

## TypeScript Support

Full TypeScript support with strict typing:

```tsx
interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export function SignupForm() {
  const { control, handleSubmit } = useForm<SignupFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Type-safe field names
  return (
    <RHFInput
      control={control}
      name="email" // ✅ TypeScript checks this
      // name="invalidField" // ❌ TypeScript error
    />
  );
}
```
