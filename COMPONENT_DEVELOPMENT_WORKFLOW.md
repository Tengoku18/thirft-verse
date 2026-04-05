# 🎯 THRIFTVERSE COMPONENT DEVELOPMENT WORKFLOW

## 📋 Overview

This document establishes the complete workflow for building screens and components following atomic design principles while maintaining UI/UX consistency and color code standards.

---

## 🏗️ CORE PRINCIPLES

### 1. **Atomic Design Hierarchy**

```
Atoms (UI Base) → Molecules (Patterns) → Organisms (Layouts) → Screens (Features)
```

### 2. **Screen Size Constraint**

- **Maximum 200 lines per screen file**
- If exceeding, extract logic into custom hooks
- Keep screens focused on UI composition only

### 3. **Component Hierarchy**

```
Use ONLY: components/ui/* + components/_atomic/*
DON'T: Create custom UI components, bare React Native elements, external libraries
```

### 4. **Color Code System**

All colors must use the project's theme system - NO hardcoded values.

---

## 🎨 COLOR CODE STANDARDS

### Theme Colors (From `constants/theme.ts`)

#### **Light Mode**

```tsx
Colors.light = {
  text: "#3B2F2F", // Primary text
  textSecondary: "#6B705C", // Secondary text
  background: "#FAF7F2", // Screen background
  surface: "#FFFFFF", // Cards/surfaces
  surfaceAlt: "#F5F3F0", // Alternative surface
  tint: "#D4A373", // Primary action (brown)
  border: "#C7BFB3", // Borders & dividers
  success: "#28A745", // Success states
  warning: "#FFC107", // Warnings
  error: "#DC3545", // Errors
  disabled: "#BFBFBF", // Disabled states
};
```

#### **Dark Mode**

```tsx
Colors.dark = {
  text: "#F5F3F0", // Primary text
  textSecondary: "#C7BFB3", // Secondary text
  background: "#1A1715", // Screen background
  surface: "#2D2620", // Cards/surfaces
  surfaceAlt: "#3D3530", // Alternative surface
  tint: "#D4A373", // Primary action (brown)
  border: "#4A443D", // Borders & dividers
  success: "#51CF66", // Success states
  warning: "#FFD43B", // Warnings
  error: "#FF6B6B", // Errors
  disabled: "#666666", // Disabled states
};
```

### Implementation Example

```tsx
import { useTheme } from "@/_atomic/foundations";

export const MyComponent = () => {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        padding: spacing.md,
      }}
    >
      {/* content */}
    </View>
  );
};
```

---

## 📦 COMPONENT ORGANIZATION

### **Level 1: Atoms** (Single Purpose)

Location: `components/ui/` + `components/_atomic/atoms/`

**DO:**

- ✅ Single responsibility
- ✅ No business logic
- ✅ Highly reusable
- ✅ Use theme colors

**Examples:**

- Button, Text/Typography, Input, Card, Badge, Spacer, Divider, Checkbox, Avatar

**File Structure:**

```
atoms/Button/
├── Button.tsx
├── Button.types.ts
└── index.ts
```

---

### **Level 2: Molecules** (Patterns)

Location: `components/_atomic/molecules/`

**DO:**

- ✅ Combine 2+ atoms
- ✅ Solve common patterns
- ✅ Reusable across features
- ✅ May have simple state

**Examples:**

- FormField, ButtonGroup, ListItem, ProductCard, StoreCard, SimpleCard

**File Structure:**

```tsx
// molecules/FormField/FormField.tsx
import { Text, Input } from "../../atoms";
import { useTheme } from "../../foundations";

export const FormField: React.FC<FormFieldProps> = (props) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={{ marginVertical: spacing.sm }}>
      <Text color={colors.text}>{props.label}</Text>
      <Input {...props} />
      {props.error && (
        <Text color={colors.error} size="sm">
          {props.error}
        </Text>
      )}
    </View>
  );
};
```

---

### **Level 3: Organisms** (Complex Layouts)

Location: `components/_atomic/organisms/`

**DO:**

- ✅ Multiple molecules + atoms
- ✅ Business logic allowed
- ✅ Screen-level components
- ✅ Handle state/hooks

**Examples:**

- FormLayout, ScreenHeader, ListLayout, GridLayout, ProductGrid

**File Structure:**

```tsx
// organisms/FormLayout/FormLayout.tsx
import { ScrollView, KeyboardAvoidingView } from "react-native";
import { ScreenHeader } from "../molecules";
import { useTheme } from "../../foundations";

export const FormLayout: React.FC<FormLayoutProps> = (props) => {
  const { colors } = useTheme();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScreenHeader title={props.title} onBack={props.onBack} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {props.children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
```

---

### **Level 4: Screens** (App Routes)

Location: `app/` and `app/(tabs)/`, `app/(auth)/`

**CONSTRAINTS:**

- ⚠️ **Maximum 200 lines per file**
- ✅ Extract hooks → `hooks/`
- ✅ Extract logic → separate utilities
- ✅ Use organisms as layout
- ✅ Compose molecules/atoms inside

**File Structure:**

```
app/(auth)/signup-step5.tsx        # 200 lines MAX
hooks/useSignupStep5.ts            # Business logic
lib/types/signup.types.ts          # Types
```

---

## 🔄 SCREEN DEVELOPMENT WORKFLOW

### Step 1: Plan the Screen Structure

```
SignupStep5Screen
├── AuthScreenLayout (Organism)
│   ├── Stepper (Molecule)
│   ├── ScrollView
│   │   ├── Typography (Atom)
│   │   ├── FormField (Molecule)
│   │   │   ├── Input (Atom)
│   │   │   └── Text (Atom)
│   │   └── InfoBox (Molecule)
│   └── Button (Atom)
```

### Step 2: Identify Component Layers

```
Input -> FormField (molecule) -> ScrollView -> FormLayout (organism)
         ↓
      Single screen responsibility
```

### Step 3: Extract Logic into Hooks

**File:** `hooks/useSignupStep5.ts`

```tsx
export const useSignupStep5 = () => {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQRImagePick = async () => {
    // Logic here
  };

  const onSubmit = async (data: Step5FormData) => {
    // Logic here
  };

  return {
    qrImage,
    setQrImage,
    loading,
    error,
    handleQRImagePick,
    onSubmit,
  };
};
```

### Step 4: Build Screen Component (Max 200 Lines)

**File:** `app/(auth)/signup-step5.tsx`

```tsx
import { AuthScreenLayout } from "@/components/layouts/AuthScreenLayout";
import { Stepper } from "@/components/ui/Stepper/Stepper";
import { Button } from "@/components/ui/Button/Button";
import { Typography } from "@/components/ui/Typography/Typography";
import { RHFInput } from "@/components/forms/ReactHookForm";
import { useSignupStep5 } from "@/hooks/useSignupStep5";
import { useTheme } from "@/_atomic/foundations";
import { View, ScrollView, Pressable } from "react-native";
import React from "react";

export default function SignupStep5Screen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const {
    qrImage,
    loading,
    error,
    handleQRImagePick,
    onSubmit,
    handleBack,
    handleSkip,
  } = useSignupStep5();

  return (
    <AuthScreenLayout
      showHeader
      headerTitle="Payment Setup"
      onBack={handleBack}
    >
      <Stepper title="Payout Info" currentStep={5} totalSteps={6} />

      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
            }}
          >
            {/* Header */}
            <Typography
              variant="h1"
              style={{ textAlign: "center", marginBottom: spacing.lg }}
            >
              Get Paid Easily
            </Typography>

            {/* Error Display */}
            {error && (
              <InfoBox
                type="error"
                message={error}
                style={{ marginBottom: spacing.md }}
              />
            )}

            {/* eSewa ID Field */}
            <RHFInput
              name="paymentUsername"
              label="ESEWA ID / USERNAME"
              placeholder="Enter your eSewa ID"
              style={{ marginBottom: spacing.md }}
            />

            {/* QR Code Upload */}
            <UploadBox
              icon={<QRCodeIcon size={32} />}
              title="Upload QR Image"
              subtitle="PNG, JPG up to 5MB"
              onPress={handleQRImagePick}
              image={qrImage}
              style={{ marginBottom: spacing.lg }}
            />

            {/* Info Message */}
            <View
              style={{
                padding: spacing.md,
                backgroundColor: colors.surfaceAlt,
                borderRadius: 12,
                marginBottom: spacing.lg,
              }}
            >
              <Typography variant="body-sm" color={colors.textSecondary}>
                Your eSewa details are secure and used only for withdrawals.
              </Typography>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            flexDirection: "row",
            gap: spacing.md,
          }}
        >
          <Pressable onPress={handleSkip} disabled={loading}>
            <Typography variant="body" style={{ color: colors.textSecondary }}>
              Skip
            </Typography>
          </Pressable>

          <View style={{ flex: 1 }}>
            <Button
              label="Next"
              onPress={onSubmit}
              isLoading={loading}
              disabled={loading}
            />
          </View>
        </View>
      </View>
    </AuthScreenLayout>
  );
}
```

---

## ✅ LINE COUNT CHECKLIST

| Component | Max Lines | Status |
| --------- | --------- | ------ |
| Atom      | 80        | ✅     |
| Molecule  | 120       | ✅     |
| Organism  | 150       | ✅     |
| Screen    | 200       | ✅     |
| Hook      | 150       | ✅     |

**If exceeding:** Extract into smaller unit or custom hook

---

## 🎯 IMPORT PATTERN

### From UI Library

```tsx
import { Button } from "@/components/ui/Button/Button";
import { Typography } from "@/components/ui/Typography/Typography";
import { Input } from "@/components/ui/Input";
```

### From Atomic System

```tsx
import { FormField, ButtonGroup } from "@/_atomic/molecules";
import { FormLayout, ScreenHeader } from "@/_atomic/organisms";
import { useTheme, SPACING, COLORS } from "@/_atomic/foundations";
```

### From Utilities

```tsx
import { useSignupStep5 } from "@/hooks/useSignupStep5";
import { supabase } from "@/lib/supabase";
```

---

## 🚀 DEVELOPMENT WORKFLOW

### 1. **Create Custom Hook** (if logic > 20 lines)

```bash
hooks/useScreenName.ts
```

### 2. **Build Component Structure**

```
Identify Atoms → Combine into Molecules → Wrap with Organism → Build Screen
```

### 3. **Apply Theme Throughout**

```tsx
const { colors, spacing, typography } = useTheme();
// Use in all styles
```

### 4. **Validate Line Count**

- Screen < 200 lines
- Hook < 150 lines
- Component < 120 lines

### 5. **Test Theme Colors**

- Light mode ✅
- Dark mode ✅
- Disabled states ✅
- Error states ✅

### 6. **Export & Import**

Use barrel exports: `export { Component } from "./Component"`

---

## 🔍 CODE REVIEW CHECKLIST

Before committing:

- [ ] All colors use `useTheme()` - NO hardcoded values
- [ ] Screen file ≤ 200 lines
- [ ] Logic extracted to hooks
- [ ] Only UI components from `components/ui/` or `_atomic/`
- [ ] Imports follow established patterns
- [ ] TypeScript types defined (`.types.ts` files)
- [ ] Tested in light & dark modes
- [ ] No bare React Native elements for UI (Text, TextInput, Pressable)
- [ ] Proper spacing using theme tokens
- [ ] Error states displayed with appropriate colors

---

## ❌ COMMON MISTAKES TO AVOID

### ❌ WRONG: Hardcoded Colors

```tsx
<View style={{ backgroundColor: "#D4A373" }}>{/* ❌ BAD */}</View>
```

### ✅ CORRECT: Theme Colors

```tsx
const { colors } = useTheme();
<View style={{ backgroundColor: colors.tint }}>{/* ✅ GOOD */}</View>;
```

---

### ❌ WRONG: Screen Over 200 Lines

```tsx
export default function MyScreen() {
  // 300+ lines of mixed logic and UI
}
```

### ✅ CORRECT: Extract Logic

```tsx
// hooks/useMyScreen.ts
export const useMyScreen = () => ({ /* logic */ });

// app/my-screen.tsx
export default function MyScreen() {
  const { /* data */ } = useMyScreen();
  return ( /* 150 lines UI */ );
}
```

---

### ❌ WRONG: Bare React Native Elements

```tsx
<TextInput style={{ color: "black" }} />
<Text>Hello</Text>
<Pressable onPress={...}><Text>Click</Text></Pressable>
```

### ✅ CORRECT: Use Component Library

```tsx
<Input value={...} onChange={...} />
<Typography>Hello</Typography>
<Button label="Click" onPress={...} />
```

---

## 📚 COMPONENT LIBRARY REFERENCE

### Always Available

```tsx
// UI Components
import {
  Button,
  Typography,
  Input,
  Card,
  Badge,
  Select,
} from "@/components/ui";

// Atomic Components
import { FormField, ListItem, ProductCard } from "@/_atomic/molecules";
import { FormLayout, ScreenHeader } from "@/_atomic/organisms";

// Theme & Design
import { useTheme, SPACING, COLORS } from "@/_atomic/foundations";
```

---

## 🔗 QUICK LINKS

- **Atomic Design**: `ATOMIC_STRUCTURE_PROMPT.md`
- **UI Components**: `UI_COMPONENTS_REFERENCE.md`
- **Theme System**: `constants/theme.ts`
- **Hooks Directory**: `hooks/`
- **Component System**: `components/`

---

## 📋 SCREEN MIGRATION TEMPLATE

**When refactoring an existing screen:**

1. **Backup original** → comment out or create branch
2. **Extract logic** → `hooks/use[ScreenName].ts`
3. **Build with components** → use atoms + molecules + organisms
4. **Apply theme** → `useTheme()` for all colors/spacing
5. **Validate** → < 200 lines, no hardcoded colors, proper imports
6. **Test** → Light/dark modes, all interactions
7. **Clean** → Remove old code, optimize imports
8. **Commit** → Clear message describing changes

---

## 🎓 LEARNING PATH

### Day 1: Understand Structure

- Read atomic design principles
- Review folder structure
- Study component hierarchy

### Day 2-3: Build Atoms

- Create Button atom
- Create Input atom
- Create Typography atom

### Day 4-5: Build Molecules

- Combine atoms into FormField
- Create ListItem molecule
- Create Card molecule

### Day 6: Build Organisms

- Wrap molecules in FormLayout
- Create ScreenHeader organism

### Day 7: Refactor Screens

- Migrate one screen using new system
- Follow 200-line constraint
- Apply color code standards

---

## ✨ BEST PRACTICES

1. **Keep it Simple** → Atoms do one thing
2. **Compose Over Customize** → Build from existing components
3. **Use Theme Everywhere** → Never hardcode colors/spacing
4. **Extract Early** → Move logic to hooks when needed
5. **Limit Screen Size** → 200 lines max enforces good separation
6. **Type Everything** → Define `.types.ts` for components
7. **Document Variants** → Show available props/variants
8. **Test Themes** → Always check light/dark mode
9. **Follow Conventions** → Consistent naming and structure
10. **Review Before Commit** → Use code review checklist

---

**Version:** 1.0  
**Last Updated:** April 5, 2026  
**Maintained By:** Thriftverse Development Team  
**Status:** ✅ Active & Enforced
