# THRIFTVERSE ATOMIC DESIGN STRUCTURE PROMPT

## 📋 COMPLETE STRUCTURE TO BUILD

```
components/
├── _atomic/                    # NEW ATOMIC DESIGN SYSTEM
│   ├── foundations/           # Design tokens & utilities
│   │   ├── hooks/
│   │   │   ├── useTheme.ts
│   │   │   ├── useStyles.ts
│   │   │   └── useSpacing.ts
│   │   ├── tokens/
│   │   │   ├── colors.ts
│   │   │   ├── spacing.ts
│   │   │   ├── typography.ts
│   │   │   ├── shadows.ts
│   │   │   └── breakpoints.ts
│   │   └── index.ts
│   │
│   ├── atoms/                 # BASIC ELEMENTS (Single Responsibility)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   └── index.ts
│   │   ├── Text/
│   │   │   ├── Text.tsx
│   │   │   ├── Text.types.ts
│   │   │   └── index.ts
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   ├── Input.types.ts
│   │   │   └── index.ts
│   │   ├── Badge/
│   │   ├── Card/
│   │   ├── Spacer/
│   │   ├── Divider/
│   │   ├── Container/
│   │   └── index.ts (barrel export)
│   │
│   ├── molecules/              # COMPOSITE COMPONENTS (2+ atoms)
│   │   ├── FormField/
│   │   │   ├── FormField.tsx
│   │   │   ├── FormField.types.ts
│   │   │   └── index.ts
│   │   ├── ButtonGroup/
│   │   ├── SimpleCard/
│   │   ├── ListItem/
│   │   ├── ToggleableItem/
│   │   ├── ProductCard/
│   │   ├── StoreCard/
│   │   └── index.ts (barrel export)
│   │
│   ├── organisms/              # FEATURE COMPLETE (Complex sections)
│   │   ├── FormLayout/
│   │   │   ├── FormLayout.tsx
│   │   │   ├── FormLayout.types.ts
│   │   │   └── index.ts
│   │   ├── ScreenHeader/
│   │   ├── ListLayout/
│   │   ├── GridLayout/
│   │   ├── TabLayout/
│   │   └── index.ts (barrel export)
│   │
│   └── index.ts               # Main export file
│
├── (OLD FOLDER)               # Keep for reference during migration
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── ...
```

---

## 🎯 COMPONENT ORGANIZATION RULES

### ATOMS (Foundations)

- **Single responsibility**: Do ONE thing well
- **No business logic**: Pure UI elements
- **Highly reusable**: Used across app
- **Examples**: Button, Text, Input, Badge, Card, Spacer, Divider, Container

**File Structure:**

```tsx
// Button/Button.tsx
export const Button: React.FC<ButtonProps> = ({ variant, size, ...props }) => {
  // Component JSX
};

// Button/Button.types.ts
export type ButtonVariant = "primary" | "secondary" | "outline";
export type ButtonSize = "sm" | "md" | "lg";
export interface ButtonProps {
  /* props */
}

// Button/index.ts
export { Button } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button.types";
```

### MOLECULES (Patterns)

- **Combination**: 2+ atoms + optional business logic
- **Specific purpose**: Solves common patterns
- **Reusable across features**: Not feature-specific
- **Examples**: FormField, ButtonGroup, Card, ListItem, ProductCard, StoreCard

**File Structure:**

```tsx
// FormField/FormField.tsx
import { Text, Input, Spacer } from "../atoms";

export const FormField: React.FC<FormFieldProps> = (props) => {
  return (
    <>
      <Text>{props.label}</Text>
      <Input {...props} />
      {props.error && <Text color="error">{props.error}</Text>}
    </>
  );
};

// FormField/index.ts
export { FormField } from "./FormField";
export type { FormFieldProps } from "./FormField.types";
```

### ORGANISMS (Features)

- **Complex layout**: Multiple molecules + organisms
- **Business logic**: May contain state/hooks
- **Screen-level**: Used to build complete screens
- **Examples**: FormLayout, ScreenHeader, ListLayout, DashboardSection

**File Structure:**

```tsx
// FormLayout/FormLayout.tsx
import { ScrollView, KeyboardAvoidingView } from "react-native";
import { ScreenHeader, FormField } from "../molecules";
import { Button } from "../atoms";

export const FormLayout: React.FC<FormLayoutProps> = (props) => {
  return (
    <KeyboardAvoidingView>
      <ScreenHeader {...props} />
      <ScrollView>{props.children}</ScrollView>
    </KeyboardAvoidingView>
  );
};

// FormLayout/index.ts
export { FormLayout } from "./FormLayout";
export type { FormLayoutProps } from "./FormLayout.types";
```

---

## 📝 NAMING CONVENTIONS

### Component Names

- **PascalCase**: `Button`, `FormField`, `ScreenHeader`
- **Descriptive**: `SimpleCard`, not `Card2`
- **Variants as props**: `<Button variant="primary" />` not `PrimaryButton`

### File Names

```
MyComponent/
├── MyComponent.tsx          # Component implementation
├── MyComponent.types.ts     # TypeScript types/interfaces
├── MyComponent.stories.ts   # Storybook (optional)
├── MyComponent.test.tsx     # Tests (optional)
└── index.ts                # Barrel export
```

### Type Names

```tsx
export interface MyComponentProps {
  // Props interface
}

export type MyComponentVariant = "variant1" | "variant2";

export interface MyComponentState {
  // State interface (if needed)
}
```

---

## 🎨 THEMING PATTERN

### Using Theme in Components

```tsx
import { useTheme } from "@/_atomic/foundations";

export const MyComponent = () => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View
      style={{
        padding: spacing.lg,
        backgroundColor: colors.background,
      }}
    >
      <Text
        style={{
          fontSize: typography.body.fontSize,
          color: colors.text,
        }}
      >
        Content
      </Text>
    </View>
  );
};
```

### Colors (Update in `/constants/theme.ts`)

```tsx
Colors.light = {
  text: "#3B2F2F", // Primary text
  background: "#FAF7F2", // Background
  tint: "#D4A373", // Primary action
  icon: "#6B705C", // Icons
  border: "#C7BFB3", // Borders
  surface: "#FFFFFF", // Cards/surfaces
  success: "#28A745", // Success states
  warning: "#FFC107", // Warnings
  error: "#DC3545", // Errors
};

Colors.dark = {
  // Dark mode variants
};
```

### Spacing Scale

```tsx
const SPACING = {
  xs: 4, // Tiny gaps
  sm: 8, // Small spacing
  md: 12, // Medium (default)
  lg: 16, // Large
  xl: 24, // Extra large
  xxl: 32, // Huge
} as const;
```

### Typography

```tsx
const TYPOGRAPHY = {
  h1: { size: 32, weight: "bold", lineHeight: 40 },
  h2: { size: 24, weight: "bold", lineHeight: 32 },
  h3: { size: 20, weight: "semibold", lineHeight: 28 },
  h4: { size: 18, weight: "semibold", lineHeight: 26 },
  body: { size: 16, weight: "regular", lineHeight: 24 },
  bodySmall: { size: 14, weight: "regular", lineHeight: 20 },
  caption: { size: 12, weight: "regular", lineHeight: 16 },
} as const;
```

---

## 🚀 IMPLEMENTATION STEPS

### Step 1: Create Folder Structure

```bash
mkdir -p components/_atomic/{atoms,molecules,organisms,foundations/{hooks,tokens}}
```

### Step 2: Create Foundations (Design Tokens)

```tsx
// foundations/tokens/colors.ts
export const colors = { /* theme colors */ };

// foundations/tokens/spacing.ts
export const spacing = { xs: 4, sm: 8, ... };

// foundations/tokens/typography.ts
export const typography = { h1: {...}, body: {...}, ... };

// foundations/hooks/useTheme.ts
export const useTheme = () => ({ colors, spacing, typography, isDark });

// foundations/index.ts
export * from './hooks';
export * from './tokens';
```

### Step 3: Create Atoms

For each atom:

```tsx
// atoms/Button/Button.types.ts
export interface ButtonProps {
  /* define props */
}

// atoms/Button/Button.tsx
export const Button: React.FC<ButtonProps> = (props) => {
  const { colors, spacing } = useTheme();
  return <View>{/* JSX */}</View>;
};

// atoms/Button/index.ts
export { Button } from "./Button";
export type { ButtonProps } from "./Button.types";

// atoms/index.ts
export * from "./Button";
export * from "./Text";
// ... export all atoms
```

### Step 4: Create Molecules

Combine atoms with specific patterns:

```tsx
// molecules/FormField/FormField.types.ts
export interface FormFieldProps {
  /* props */
}

// molecules/FormField/FormField.tsx
import { Text, Input } from "../../atoms";
export const FormField: React.FC<FormFieldProps> = (props) => {
  return (
    <>
      <Text variant="label">{props.label}</Text>
      <Input {...props} />
      {props.error && <Text color="error">{props.error}</Text>}
    </>
  );
};

// molecules/FormField/index.ts
export { FormField } from "./FormField";
export type { FormFieldProps } from "./FormField.types";

// molecules/index.ts
export * from "./FormField";
export * from "./ButtonGroup";
// ... export all molecules
```

### Step 5: Create Organisms

Build screens/layouts from molecules:

```tsx
// organisms/FormLayout/FormLayout.types.ts
export interface FormLayoutProps {
  /* props */
}

// organisms/FormLayout/FormLayout.tsx
import { ScrollView } from "react-native";
import { ScreenHeader } from "../molecules";

export const FormLayout: React.FC<FormLayoutProps> = (props) => {
  return (
    <>
      <ScreenHeader title={props.title} />
      <ScrollView>{props.children}</ScrollView>
    </>
  );
};

// organisms/index.ts
export * from "./FormLayout";
export * from "./ScreenHeader";
// ... export all organisms
```

### Step 6: Create Main Export

```tsx
// _atomic/index.ts
export * from "./foundations";
export * from "./atoms";
export * from "./molecules";
export * from "./organisms";
```

---

## 📊 MIGRATION CHECKLIST (Per Screen)

For each screen you want to update:

- [ ] Review old screen code
- [ ] Identify components to replace (buttons, inputs, cards, etc.)
- [ ] Replace with new atomic components
- [ ] Remove inline styles (use theme instead)
- [ ] Remove color scheme hook calls (theme handles it)
- [ ] Test on light/dark mode
- [ ] Verify functionality works
- [ ] Update imports from new system
- [ ] Clean up old code
- [ ] Commit changes

**Estimated time per screen**: 20-40 minutes

---

## ⚡ QUICK IMPORT EXAMPLES

### From atoms

```tsx
import {
  Button,
  Text,
  Input,
  Badge,
  Card,
  Container,
  Spacer,
  Divider,
} from "@/_atomic/atoms";
```

### From molecules

```tsx
import {
  FormField,
  ButtonGroup,
  SimpleCard,
  ListItem,
  ProductCard,
} from "@/_atomic/molecules";
```

### From organisms

```tsx
import {
  FormLayout,
  ScreenHeader,
  ListLayout,
  GridLayout,
} from "@/_atomic/organisms";
```

### From foundations

```tsx
import { useTheme, SPACING, TYPOGRAPHY, COLORS } from "@/_atomic/foundations";
```

---

## 🔄 COMPONENT HIERARCHY EXAMPLE

```
Screen (App route)
  ↓
FormLayout (organism)
  ├── ScreenHeader (molecule)
  ├── ScrollView
  │   ├── FormField (molecule)
  │   │   ├── Text (atom)
  │   │   ├── Input (atom)
  │   │   └── Text error (atom)
  │   ├── FormField (molecule)
  │   └── ButtonGroup (molecule)
  │       ├── Button (atom)
  │       └── Button (atom)
```

---

## ✅ BEST PRACTICES

1. **Keep atoms simple**: No business logic, only presentation
2. **Reuse built atoms**: Don't create new atoms if similar exists
3. **Use theme everywhere**: Never hardcode colors/spacing
4. **Props over variants**: `<Button variant="primary" />` not `<PrimaryButton />`
5. **TypeScript first**: Define interfaces before implementation
6. **Barrel exports**: Use index.ts in each folder for clean imports
7. **Single responsibility**: Each component does one thing
8. **Document variants**: Show available props/variants
9. **Test themes**: Check light/dark mode
10. **Compose over inherit**: Build complex from simple components

---

## 🎯 SCREENS TO MIGRATE (Suggested Order)

**Phase 1 (Easy)**: Start with simple screens

1. Settings screen
2. Profile screen
3. Help/Support screen

**Phase 2 (Medium)**: Form screens

1. Login/Signup
2. Edit Profile
3. Change Password

**Phase 3 (Complex)**: Feature screens

1. Product creation
2. Order management
3. Dashboard

**Phase 4 (Advanced)**: Dynamic screens

1. Explore screen
2. Search results
3. Product details

---

## 📚 FILE TEMPLATES

### Atom Template

```tsx
// atoms/MyAtom/MyAtom.types.ts
export interface MyAtomProps {
  // Required props
  children?: React.ReactNode;
  // Optional props
  style?: ViewStyle;
}

// atoms/MyAtom/MyAtom.tsx
import React from "react";
import { View } from "react-native";
import { useTheme } from "../../foundations";

export const MyAtom: React.FC<MyAtomProps> = ({ children, style }) => {
  const { colors, spacing } = useTheme();

  return <View style={[{ padding: spacing.md }, style]}>{children}</View>;
};

// atoms/MyAtom/index.ts
export { MyAtom } from "./MyAtom";
export type { MyAtomProps } from "./MyAtom.types";
```

### Molecule Template

```tsx
// molecules/MyMolecule/MyMolecule.types.ts
export interface MyMoleculeProps {
  // Props combining multiple atoms
}

// molecules/MyMolecule/MyMolecule.tsx
import React from "react";
import { View } from "react-native";
import { Atom1, Atom2 } from "../../atoms";
import { useTheme } from "../../foundations";

export const MyMolecule: React.FC<MyMoleculeProps> = (props) => {
  const { spacing } = useTheme();

  return (
    <View style={{ marginVertical: spacing.md }}>
      <Atom1 {...props} />
      <Atom2 {...props} />
    </View>
  );
};

// molecules/MyMolecule/index.ts
export { MyMolecule } from "./MyMolecule";
export type { MyMoleculeProps } from "./MyMolecule.types";
```

### Organism Template

```tsx
// organisms/MyOrganism/MyOrganism.types.ts
export interface MyOrganismProps {
  // Screen-level props
}

// organisms/MyOrganism/MyOrganism.tsx
import React from "react";
import { ScrollView } from "react-native";
import { Molecule1, Molecule2 } from "../../molecules";
import { useTheme } from "../../foundations";

export const MyOrganism: React.FC<MyOrganismProps> = (props) => {
  const { colors } = useTheme();

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <Molecule1 {...props} />
      <Molecule2 {...props} />
    </ScrollView>
  );
};

// organisms/MyOrganism/index.ts
export { MyOrganism } from "./MyOrganism";
export type { MyOrganismProps } from "./MyOrganism.types";
```

---

## 🚦 START HERE

1. Create the folder structure (step 1)
2. Set up foundations with design tokens (step 2)
3. Build atoms from foundations (step 3)
4. Combine atoms into molecules (step 4)
5. Create organisms from molecules (step 5)
6. Export everything (step 6)
7. Start migrating screens one by one

**Total Setup Time**: 2-4 hours
**Per Screen Migration**: 20-40 minutes

---

## 📞 FOLLOW THIS STRUCTURE

This is the complete blueprint. Follow it step-by-step and you'll have:

- ✅ Consistent UI system
- ✅ Reusable components
- ✅ Automatic theming (light/dark)
- ✅ Easy maintenance
- ✅ Scalable architecture
