# Link Component Documentation

## Overview

The `Link` component is a reusable, accessible link/text link component following the Thriftverse design system. It supports three variants, three sizes, underline styling, and both internal (routing) and external link functionality.

## Variants

### 1. **Primary Link** (Default)

Used for main navigation links and important interactive text

```tsx
import { Link } from "@/components/Link";

<Link label="View Profile" href="/profile" />;
```

**Styles:**

- Color: Espresso (#3B3030)
- Font: Nunito Sans Bold (700)
- Opacity on press: 0.7

---

### 2. **Secondary Link**

Used for additional information and less prominent links

```tsx
<Link label="Learn More" variant="secondary" href="/info" />
```

**Styles:**

- Color: Secondary Gray (#6B7280)
- Font: Nunito Sans SemiBold (600)
- Opacity on press: 0.7

---

### 3. **Destructive Link**

Used for delete, remove, or danger actions

```tsx
<Link label="Delete Account" variant="destructive" href="/settings/delete" />
```

**Styles:**

- Color: Error Red (#DC2626)
- Font: Nunito Sans Bold (700)
- Warning indicator of destructive action
- Opacity on press: 0.7

---

## Sizes

- **`sm`** (small): 14px - For captions, helper text
- **`md`** (medium, default): 16px - Standard body text
- **`lg`** (large): 18px - Headings, prominent links

```tsx
<Link label="Small Link" size="sm" href="/" />
<Link label="Medium Link" size="md" href="/" />
<Link label="Large Link" size="lg" href="/" />
```

---

## Link Types

### **Internal Links** (Navigation)

Uses `expo-router` for in-app navigation

```tsx
<Link
  label="Go to Dashboard"
  type="internal"
  href="/dashboard"
/>

<Link
  label="Edit Settings"
  href="/settings"  {/* type="internal" is default */}
/>
```

### **External Links** (URLs)

For external URLs or custom handlers

```tsx
<Link
  label="Visit Website"
  type="external"
  href="https://example.com"
  onPress={() => handleExternalLink()}
/>

<Link
  label="Contact Support"
  type="external"
  href="mailto:support@example.com"
/>
```

---

## Props

| Prop        | Type                                        | Default      | Description                          |
| ----------- | ------------------------------------------- | ------------ | ------------------------------------ |
| `label`     | `string`                                    | Required     | Link text content                    |
| `href`      | `string`                                    | Required     | Route (internal) or URL (external)   |
| `variant`   | `'primary' \| 'secondary' \| 'destructive'` | `'primary'`  | Visual style variant                 |
| `size`      | `'sm' \| 'md' \| 'lg'`                      | `'md'`       | Font size                            |
| `type`      | `'internal' \| 'external'`                  | `'internal'` | Link behavior                        |
| `underline` | `boolean`                                   | `false`      | Show text underline                  |
| `disabled`  | `boolean`                                   | `false`      | Disables link with reduced opacity   |
| `onPress`   | `() => void`                                | Optional     | Custom press handler (external only) |
| `style`     | `ViewStyle`                                 | Optional     | Custom React Native styles           |
| `testID`    | `string`                                    | Optional     | For testing purposes                 |

---

## Styling Options

### **Underline Variants**

```tsx
<Link label="No Underline" href="/" />
<Link label="With Underline" href="/" underline={true} />
```

### **Disabled State**

```tsx
<Link label="Unavailable" href="/" disabled={true} />
```

---

## States

### **Active/Pressed State**

- Opacity: `0.7` for visual feedback
- Smooth opacity transition
- Maintains readability

```tsx
<Link label="Press me" href="/" /> {/* Automatically handles press feedback */}
```

### **Disabled State**

- Opacity: `50%`
- Pointer events: Disabled
- Visual indication of unavailability

```tsx
<Link label="Coming Soon" href="/" disabled={true} />
```

---

## Utility Shortcuts

For convenience, specific variant links are exported as standalone components:

```tsx
import {
  Link,
  PrimaryTextLink,
  SecondaryTextLink,
  DestructiveTextLink,
  UnderlinedLink
} from "@/components/Link";

// These are equivalent:
<Link variant="primary" label="Home" href="/" />
<PrimaryTextLink label="Home" href="/" />

// These are equivalent:
<Link variant="secondary" label="Learn More" href="/info" />
<SecondaryTextLink label="Learn More" href="/info" />

// These are equivalent:
<Link variant="destructive" label="Delete" href="/settings" />
<DestructiveTextLink label="Delete" href="/settings" />

// These are equivalent:
<Link label="Underlined" href="/" underline={true} />
<UnderlinedLink label="Underlined" href="/" />
```

---

## Usage Examples

### Example 1: Navigation Menu

```tsx
import { Link, PrimaryTextLink } from "@/components/Link";

export function NavigationLinks() {
  return (
    <View className="gap-2">
      <PrimaryTextLink label="Home" href="/" />
      <PrimaryTextLink label="Explore" href="/explore" />
      <PrimaryTextLink label="Dashboard" href="/dashboard" />
      <PrimaryTextLink label="Settings" href="/settings" />
    </View>
  );
}
```

### Example 2: Inline Text with Links

```tsx
<View>
  <Text>
    By creating an account, you agree to our{" "}
    <Link label="Terms of Service" href="/terms" size="sm" /> and{" "}
    <Link label="Privacy Policy" href="/privacy" size="sm" />
  </Text>
</View>
```

### Example 3: Contextual Links

```tsx
<View className="gap-4">
  {/* Primary action */}
  <Link label="View Full Profile" href={`/profile/${userId}`} size="lg" />

  {/* Secondary info */}
  <Link
    label="View activity history"
    variant="secondary"
    href={`/profile/${userId}/activity`}
    size="sm"
  />

  {/* Destructive action */}
  <Link
    label="Block User"
    variant="destructive"
    href={`/settings/blocked`}
    size="sm"
  />
</View>
```

### Example 4: External and Dynamic Links

```tsx
const handleExternalLink = () => {
  // Handle external navigation
};

<View className="gap-2">
  {/* External link */}
  <Link
    label="Visit our website"
    type="external"
    href="https://thriftverse.com"
    onPress={handleExternalLink}
  />

  {/* Email link */}
  <Link
    label="Email support"
    type="external"
    href="mailto:support@thriftverse.com"
  />

  {/* Phone link */}
  <Link label="Call us" type="external" href="tel:+1234567890" />
</View>;
```

### Example 5: Footer Links

```tsx
export function FooterLinks() {
  return (
    <View className="border-t border-ui-border-light pt-4 gap-3">
      <Link label="About Us" variant="secondary" href="/about" size="sm" />
      <Link label="Contact" variant="secondary" href="/contact" size="sm" />
      <Link label="Privacy" variant="secondary" href="/privacy" size="sm" />
      <Link label="Terms" variant="secondary" href="/terms" size="sm" />
    </View>
  );
}
```

---

## Color Reference

| Variant     | Color          | Hex     |
| ----------- | -------------- | ------- |
| Primary     | Espresso       | #3B3030 |
| Secondary   | Secondary Gray | #6B7280 |
| Destructive | Error Red      | #DC2626 |
| Disabled    | Tertiary Gray  | #9CA3AF |

---

## Accessibility

- All links have proper `testID` prop support for testing
- Color contrast meets WCAG standards
- Semantic `accessibilityRole="link"` on all links
- `disabled` prop properly prevents interaction
- Full TypeScript support
- Touch targets are at least 44 pixels tall

---

## Implementation Checklist

- ✅ Primary variant with espresso color
- ✅ Secondary variant with gray color
- ✅ Destructive variant with error red
- ✅ Three sizes (sm, md, lg)
- ✅ Underline styling option
- ✅ Internal navigation (expo-router)
- ✅ External links support
- ✅ Disabled state
- ✅ Press/active feedback
- ✅ TypeScript support with proper types
- ✅ Utility component shortcuts
- ✅ Accessibility features

---

## Notes

- Links automatically handle routing via `expo-router`
- Opacity feedback provides tactile response on press
- External links require explicit `type="external"` prop
- All variants support underlines independently
- Disabled state visually indicates unavailable links
- Font weights vary by variant (bold for primary/destructive, semibold for secondary)
