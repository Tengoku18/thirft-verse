# SearchInput Component Documentation

## Overview

A reusable, pill-shaped search input field with integrated search and clear icons. Consistent with the Input and Select component design patterns.

## Location

`components/ui/SearchInput/SearchInput.tsx`

## Features

- ✅ Pill-shaped design (rounded-full)
- ✅ Integrated search icon (left side)
- ✅ Clear icon that appears on input
- ✅ Auto-focus functionality after clearing
- ✅ ForwardRef support for imperative actions
- ✅ Customizable icons visibility
- ✅ Consistent theme colors from INPUT_COLORS
- ✅ TypeScript support with TextInputProps extension

## Props

```typescript
interface SearchInputProps extends Omit<TextInputProps, "ref"> {
  value: string; // Current search query
  onChangeText: (text: string) => void; // Change handler
  placeholder?: string; // Placeholder text (default: "Search...")
  clearable?: boolean; // Show clear button (default: true)
  onClear?: () => void; // Callback when clear is pressed
  showSearchIcon?: boolean; // Show search icon (default: true)
  showClearIcon?: boolean; // Show clear icon (default: true)
  // ... all TextInputProps
}
```

## Usage Examples

### Basic Search Input

```tsx
import { SearchInput } from "@/components/ui/SearchInput";
import { useState } from "react";

export function BasicSearch() {
  const [search, setSearch] = useState("");

  return (
    <SearchInput
      value={search}
      onChangeText={setSearch}
      placeholder="Search items..."
    />
  );
}
```

### With Ref and Clear Handler

```tsx
import { SearchInput } from "@/components/ui/SearchInput";
import { useRef, useState } from "react";

export function SearchWithRef() {
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);

  const handleClear = () => {
    console.log("Search cleared");
  };

  return (
    <SearchInput
      ref={searchInputRef}
      value={search}
      onChangeText={setSearch}
      placeholder="Search..."
      clearable
      onClear={handleClear}
    />
  );
}
```

### Without Icons

```tsx
<SearchInput
  value={search}
  onChangeText={setSearch}
  placeholder="Minimal search..."
  showSearchIcon={false}
  showClearIcon={false}
/>
```

### In a List/Modal Context

```tsx
import { SearchInput } from "@/components/ui/SearchInput";
import { useState } from "react";
import { FlatList, View } from "react-native";

export function SearchableList() {
  const [search, setSearch] = useState("");
  const allItems = ["Item 1", "Item 2", "Item 3"];
  const filtered = allItems.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View className="flex-1 px-4 py-4">
      <SearchInput
        value={search}
        onChangeText={setSearch}
        placeholder="Filter items..."
      />
      <FlatList
        data={filtered}
        renderItem={({ item }) => (
          <View>
            <Text>{item}</Text>
          </View>
        )}
        keyExtractor={(item) => item}
      />
    </View>
  );
}
```

## Styling

The component uses:

- **Background**: `bg-gray-100` (light gray)
- **Border Radius**: `rounded-full` (pill-shaped)
- **Padding**: `px-4 py-3` (16px horizontal, 12px vertical)
- **Text Color**: Uses `INPUT_COLORS.text` from theme
- **Icon Color**: Uses `INPUT_COLORS.icon` from theme
- **Placeholder Color**: Uses `INPUT_COLORS.placeholder` from theme

## Behavior

### Auto Clear

When the clear icon is tapped:

1. Input value is cleared
2. `onClear` callback is triggered (if provided)
3. Input automatically receives focus for continued typing

### Clear Icon Visibility

The clear icon only appears when:

- `clearable={true}` (default)
- `showClearIcon={true}` (default)
- `value.length > 0` (has content)

### Ref Usage

```tsx
// Focus the input
searchInputRef.current?.focus();

// Get the current value
const currentValue = searchInputRef.current?.getValue();
```

## Use Cases

1. **Search in Lists** - Filter arrays of items
2. **Modal Search** - Search within Select/Picker modals (used in Select component)
3. **Product Search** - Search products in explore/catalog features
4. **User Search** - Find users, stores, or profiles
5. **Filter Inputs** - Any searchable/filterable content areas

## Integration with Other Components

### Used in Select Component

The SearchInput is used internally by the Select component for filtering options:

```tsx
<Select
  label="District"
  searchable={true} // Enables search in modal
  options={districtOptions}
  // ... other props
/>
```

### Combine with Input Component

Can be paired with other form inputs for a complete search interface:

```tsx
<View className="gap-4">
  <SearchInput
    value={search}
    onChangeText={setSearch}
    placeholder="Quick search..."
  />
  <Input label="Advanced Filters" placeholder="More options..." />
</View>
```

## Accessibility

- Proper TextInput platform defaults for keyboard
- Hit slop on clear button for easier touch targets
- Auto-focus after clearing for continuous interaction
- Semantic placeholder text

## Performance Notes

- Uses forwardRef for ref access without re-renders
- Minimal re-renders on text input change
- Efficient icon rendering (conditional)
- Icon reuse with small sizes (18px)

## Theme Integration

Colors are pulled from `INPUT_COLORS` constant:

```typescript
export const INPUT_COLORS = {
  label: "#3B3030",
  border: "#3b303033",
  borderFocus: "#3B3030",
  placeholder: "#3b303066",
  text: "#3B3030",
  icon: "#3b303099",
};
```

For custom styling, pass additional props or override with `style` prop (from TextInputProps).
