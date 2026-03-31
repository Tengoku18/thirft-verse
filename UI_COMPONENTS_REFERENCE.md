# UI Components Reference Guide

**CRITICAL: This guide MUST be followed for ALL design updates and refactoring.**

## Overview

This project has a custom UI component library located in `components/ui/`. When refactoring, updating designs, or building new features, you MUST ONLY use these components. Do NOT create new components or use external UI libraries for elements that already exist here.

## Available UI Components

### Core Components

#### 1. **Typography** (`components/ui/Typography`)

- **Purpose**: All text rendering
- **Import**: `import { Typography } from '@/components/ui/Typography'`
- **Usage**: Use for headings, body text, labels, captions, etc.
- **DO NOT**: Use bare `<Text>` or `<Heading>` components

#### 2. **Button** (`components/ui/Button`)

- **Purpose**: All button interactions
- **Import**: `import { Button } from '@/components/ui/Button'`
- **Usage**: Primary, secondary, tertiary buttons, icon buttons
- **DO NOT**: Create custom button components or use bare `<Pressable>`

#### 3. **Link** (`components/ui/Link`)

- **Purpose**: All navigation and link elements
- **Import**: `import { Link } from '@/components/ui/Link'`
- **Usage**: Text links, navigation links, external links
- **DO NOT**: Use bare `<Link>` from Expo Router or create custom link components

#### 4. **Input** (`components/ui/Input`)

- **Purpose**: Text input fields
- **Import**: `import { Input } from '@/components/ui/Input'`
- **Usage**: Form inputs, search fields, text entry
- **DO NOT**: Use bare `<TextInput>` or create custom input components

#### 5. **PasswordInput** (`components/ui/PasswordInput`)

- **Purpose**: Password input fields with show/hide functionality
- **Import**: `import { PasswordInput } from '@/components/ui/PasswordInput'`
- **Usage**: Password fields, secure text entry
- **DO NOT**: Create custom password inputs

#### 6. **Checkbox** (`components/ui/Checkbox`)

- **Purpose**: Checkbox selections
- **Import**: `import { Checkbox } from '@/components/ui/Checkbox'`
- **Usage**: Form checkboxes, selection toggles
- **DO NOT**: Create custom checkbox components

#### 7. **Card** (`components/ui/Card`)

- **Purpose**: Container component for content grouping
- **Import**: `import { Card } from '@/components/ui/Card'`
- **Usage**: Content cards, information panels
- **DO NOT**: Create custom card/container components

#### 8. **Avatar** (`components/ui/Avatar`)

- **Purpose**: User profile images and avatars
- **Import**: `import { Avatar } from '@/components/ui/Avatar'`
- **Usage**: User profile pictures, avatar placeholders
- **DO NOT**: Create custom avatar components

#### 9. **Carousel** (`components/ui/Carousel`)

- **Purpose**: Horizontal scrollable content
- **Import**: `import { Carousel } from '@/components/ui/Carousel'`
- **Usage**: Image galleries, content sliders
- **DO NOT**: Create custom carousel/slider components

#### 10. **Loader** (`components/ui/Loader`)

- **Purpose**: Loading states and spinners
- **Import**: `import { Loader } from '@/components/ui/Loader'`
- **Usage**: Loading indicators, async operation feedback
- **DO NOT**: Create custom loading components

#### 11. **Stepper** (`components/ui/Stepper`)

- **Purpose**: Multi-step processes and progress indicators
- **Import**: `import { Stepper } from '@/components/ui/Stepper'`
- **Usage**: Onboarding flows, multi-step forms
- **DO NOT**: Create custom stepper components

#### 12. **SocialAuthButton** (`components/ui/SocialAuthButton`)

- **Purpose**: Social authentication buttons
- **Import**: `import { SocialAuthButton } from '@/components/ui/SocialAuthButton'`
- **Usage**: Google, Facebook, Apple sign-in buttons
- **DO NOT**: Create custom social auth buttons

#### 13. **Collapsible** (`components/ui/collapsible`)

- **Purpose**: Expandable/collapsible content sections
- **Import**: `import { Collapsible } from '@/components/ui/collapsible'`
- **Usage**: Accordion sections, expandable panels
- **DO NOT**: Create custom collapsible components

#### 14. **IconSymbol** (`components/ui/icon-symbol`)

- **Purpose**: SF Symbols icons (iOS) and Material icons
- **Import**: `import { IconSymbol } from '@/components/ui/icon-symbol'`
- **Usage**: All icon needs across the app
- **DO NOT**: Use other icon libraries

## Rules for Refactoring & Design Updates

### ✅ DO:

1. **ALWAYS** use components from `components/ui/` folder
2. **ALWAYS** import from the component folder (e.g., `@/components/ui/Button`)
3. Check if a component exists before creating a new one
4. Compose existing components to create complex UIs
5. Follow the established component patterns and props
6. Maintain consistency with existing implementations

### ❌ DO NOT:

1. **NEVER** create new basic UI components (buttons, inputs, text, etc.)
2. **NEVER** use bare React Native components for UI elements that have custom counterparts
3. **NEVER** install or use external UI libraries (shadcn, NativeBase, etc.) for covered components
4. **NEVER** duplicate component functionality
5. **NEVER** bypass these components with custom implementations

## Component Discovery Process

Before creating ANY new component:

1. Check `components/ui/` folder first
2. Review this reference guide
3. If unsure, ask for clarification
4. Only create new components for genuinely unique functionality

## Design System Compliance

All components in `components/ui/` follow the project's design system:

- Consistent spacing and typography
- Theme-aware colors and styles
- Responsive design patterns
- Accessibility standards
- Cross-platform compatibility (iOS/Android/Web)

## Examples

### ✅ CORRECT:

```tsx
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Input } from "@/components/ui/Input";

function MyScreen() {
  return (
    <>
      <Typography variant="h1">Welcome</Typography>
      <Input placeholder="Enter email" />
      <Button onPress={handleSubmit}>Submit</Button>
    </>
  );
}
```

### ❌ INCORRECT:

```tsx
import { Text, TextInput, Pressable } from "react-native";

function MyScreen() {
  return (
    <>
      <Text style={styles.title}>Welcome</Text>
      <TextInput placeholder="Enter email" />
      <Pressable onPress={handleSubmit}>
        <Text>Submit</Text>
      </Pressable>
    </>
  );
}
```

## Questions?

If you need a component that doesn't exist:

1. Confirm it's not available in `components/ui/`
2. Check if existing components can be composed to achieve the goal
3. Only then consider creating a new component in the `components/ui/` folder following established patterns

---

**Last Updated**: March 2026
**Maintained By**: Thriftverse Development Team
