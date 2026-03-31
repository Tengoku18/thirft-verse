# Button Component Documentation

## Overview

The `Button` component is a reusable, accessible button component following the ThriftVerse design system with three variants and two sizes. It supports loading and disabled states with proper visual feedback.

## Variants

### 1. **Primary Button** (Default)

Used for the most important actions (Sign In, Next Step, Post Product)

```tsx
import { Button } from "@/components/Button";

<Button label="Sign In" onPress={() => handleSignIn()} />;
```

**Styles:**

- Background: Rich Espresso (#3B3030)
- Text: White, ExtraBold
- Shadow: Subtle elevation (shadow-md)
- Height: 56px (default) or 48px (compact)

---

### 2. **Secondary Button**

Used for secondary actions or alternatives (Skip, Share, View Details)

```tsx
<Button
  label="Skip"
  variant="secondary"
  onPress={() => handleSkip()}
  size="large"
/>
```

**Styles:**

- Background: Transparent
- Border: 1px solid Espresso (#3B3030)
- Text: Espresso, Bold
- Height: 56px (default) or 48px (compact)

---

### 3. **Accent Button**

Used for high-conversion highlights and CTAs (View, Available, Highlights)

```tsx
<Button
  label="View"
  variant="accent"
  onPress={() => handleView()}
  size="compact"
/>
```

**Styles:**

- Background: Warm Tan (#D4A373)
- Text: White, Bold
- Border Radius: 8px
- Height: 40px (default) or 48px (large)
- Note: Not full-width by default

---

## Sizes

- **`large`** (default): Height 56px - Perfect for primary CTAs and full-width buttons
- **`compact`**: Height 48px or 40px depending on variant - Ideal for secondary buttons or limited space

```tsx
<Button label="Large Button" size="large" />
<Button label="Compact Button" variant="secondary" size="compact" />
```

---

## Props

| Prop        | Type                                   | Default     | Description                               |
| ----------- | -------------------------------------- | ----------- | ----------------------------------------- |
| `label`     | `string`                               | Required    | Button text content                       |
| `variant`   | `'primary' \| 'secondary' \| 'accent'` | `'primary'` | Visual style variant                      |
| `size`      | `'large' \| 'compact'`                 | `'large'`   | Button size                               |
| `onPress`   | `() => void`                           | Optional    | Press handler callback                    |
| `isLoading` | `boolean`                              | `false`     | Shows spinner, disables interaction       |
| `disabled`  | `boolean`                              | `false`     | Disables button with reduced opacity      |
| `fullWidth` | `boolean`                              | `true`      | Whether button takes full container width |
| `style`     | `ViewStyle`                            | Optional    | Custom React Native styles                |
| `testID`    | `string`                               | Optional    | For testing purposes                      |

---

## States

### **Active/Pressed State**

- Scale: `scale-95` for tactile feedback
- Opacity: `opacity-90` for visual feedback
- Smooth transition animation

```tsx
<Button label="Press me" /> {/* Automatically handles press feedback */}
```

### **Disabled State**

- Opacity: `50%`
- Pointer events: Disabled
- Visual indication of unavailability

```tsx
<Button label="Disabled Button" disabled={true} />
```

### **Loading State**

- Replaces text with `ActivityIndicator` spinner
- Maintains button height to prevent layout shift
- Button is automatically disabled while loading

```tsx
<Button label="Sign In" isLoading={true} />
```

---

## Utility Shortcuts

For convenience, specific variant buttons are exported as standalone components:

```tsx
import {
  Button,
  PrimaryActionButton,
  SecondaryActionButton,
  AccentActionButton
} from "@/components/Button";

// These are equivalent:
<Button variant="primary" label="Sign In" onPress={handleSignIn} />
<PrimaryActionButton label="Sign In" onPress={handleSignIn} />

// These are equivalent:
<Button variant="secondary" label="Skip" onPress={handleSkip} />
<SecondaryActionButton label="Skip" onPress={handleSkip} />

// These are equivalent:
<Button variant="accent" label="View" onPress={handleView} />
<AccentActionButton label="View" onPress={handleView} />
```

---

## Usage Examples

### Example 1: Sign In Flow

```tsx
import { Button, SecondaryActionButton } from "@/components/Button";

export function AuthScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await authenticateUser();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 p-4 gap-4">
      <Button label="Sign In" onPress={handleSignIn} isLoading={isLoading} />
      <SecondaryActionButton
        label="Create Account"
        onPress={() => navigateTo("signup")}
      />
    </View>
  );
}
```

### Example 2: Mixed Actions

```tsx
<View className="gap-3">
  <Button
    label="Post Product"
    variant="primary"
    fullWidth
    isLoading={isPosting}
  />

  <Button label="Save Draft" variant="secondary" size="compact" fullWidth />

  <View className="flex-row gap-2">
    <Button label="View" variant="accent" fullWidth={false} />
    <Button
      label="Cancel"
      variant="secondary"
      size="compact"
      fullWidth={false}
    />
  </View>
</View>
```

### Example 3: Dynamic States

```tsx
const [isSubmitting, setIsSubmitting] = useState(false);
const isFormValid = allFieldsCompleted();

<Button
  label={isSubmitting ? "Submitting..." : "Submit"}
  onPress={handleSubmit}
  isLoading={isSubmitting}
  disabled={!isFormValid}
  size="large"
/>;
```

---

## Styling Notes

- **Font**: Nunito Sans (via tailwind font-family configuration)
  - Primary: `font-sans-extrabold` (weight 800)
  - Secondary/Accent: `font-sans-bold` (weight 700)

- **Spacing**: Uses `h-14` (56px) for large, `h-12` (48px) for secondary compact

- **Colors**: Uses custom brand colors from tailwind config:
  - `bg-brand-espresso` → #3B3030
  - `bg-brand-tan` → #D4A373
  - `text-brand-espresso` → #3B3030

- **Shadows**: `shadow-md` on primary variant for elevation

- **Transitions**: Smooth `active:scale-95` and opacity changes for feedback

---

## Accessibility

- All buttons have proper `testID` prop support for testing
- Color contrast meets WCAG standards
- Touch targets are at least 44x44 pixels (44px minimum touch height)
- `disabled` prop properly disables interaction
- Loading state provides visual feedback

---

## Implementation Checklist

- ✅ Primary variant with espresso background
- ✅ Secondary variant with outline style
- ✅ Accent variant with warm tan background
- ✅ Large (56px) and Compact (48px) sizes
- ✅ Loading state with spinner
- ✅ Disabled state with opacity
- ✅ Active/pressed feedback with scale
- ✅ Full-width and fixed-width support
- ✅ TypeScript support with proper types
- ✅ Utility component shortcuts
