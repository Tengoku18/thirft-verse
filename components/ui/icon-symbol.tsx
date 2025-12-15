// Fallback for using Ionicons on Android and web (iOS-style icons).

import Ionicons from "@expo/vector-icons/Ionicons";
import { SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type ViewStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof Ionicons>["name"]>;

/**
 * SF Symbols to Ionicons mappings.
 * Ionicons provide iOS-style icons that look consistent across platforms.
 * - see Ionicons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  // Navigation
  "house.fill": "home",
  "chevron.left": "chevron-back",
  "chevron.right": "chevron-forward",
  "chevron.down": "chevron-down",
  "chevron.up": "chevron-up",
  "chevron.left.forwardslash.chevron.right": "code-slash",

  // Actions
  xmark: "close",
  "xmark.circle.fill": "close-circle",
  checkmark: "checkmark",
  "checkmark.circle.fill": "checkmark-circle",
  plus: "add",
  "plus.circle.fill": "add-circle",
  pencil: "create",
  "square.and.pencil": "create",
  "slider.horizontal.3": "options-outline",
  trash: "trash",
  "trash.fill": "trash",
  "paperplane.fill": "send",
  "square.and.arrow.up": "share-outline",
  link: "link",
  eye: "eye",
  globe: "globe",
  "rectangle.portrait.and.arrow.right.fill": "log-out",
  "arrow.uturn.left.circle.fill": "arrow-undo-circle",
  "arrow.uturn.backward.circle.fill": "refresh-circle",

  // Media
  photo: "image",
  "photo.stack": "images",
  "photo.on.rectangle": "images-outline",
  camera: "camera",
  "camera.fill": "camera",

  // Commerce
  bag: "bag-outline",
  "bag.fill": "bag",
  "shippingbox.fill": "cube",
  "storefront.fill": "storefront",
  "tag.fill": "pricetag",
  "cube.box.fill": "cube",
  "indianrupeesign.circle.fill": "cash",
  "creditcard.fill": "card",

  // Status
  "clock.fill": "time",
  calendar: "calendar",
  "exclamationmark.triangle": "warning-outline",
  "exclamationmark.triangle.fill": "warning",
  "exclamationmark.circle": "alert-circle-outline",
  "exclamationmark.circle.fill": "alert-circle",
  "info.circle.fill": "information-circle",
  "questionmark.circle": "help-circle-outline",
  "questionmark.circle.fill": "help-circle",
  "checkmark.circle": "checkmark-circle-outline",
  "bell.fill": "notifications",

  // User
  "person.fill": "person",
  "person.crop.circle.badge.exclamationmark": "person-circle-outline",
  "gearshape.fill": "settings",
  "lock.fill": "lock-closed",
  qrcode: "qr-code",

  // Contact
  "envelope.fill": "mail",
  "phone.fill": "call",

  // Documents
  "doc.text.fill": "document-text",
  "doc.plaintext.fill": "document",
  number: "text",

  // Analytics
  "chart.bar.fill": "bar-chart",
  "arrow.up.right": "trending-up",
  "arrow.down.right": "trending-down",
  "arrow.triangle.2.circlepath": "sync",

  // Search
  magnifyingglass: "search",
};

/**
 * An icon component that uses native SF Symbols on iOS, and Ionicons on Android and web.
 * Ionicons provide iOS-style icons for a consistent look across platforms.
 * Icon `name`s are based on SF Symbols and require manual mapping to Ionicons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  const ionIconName = MAPPING[name] || "help-circle-outline";
  return (
    <Ionicons color={color} size={size} name={ionIconName} style={style} />
  );
}
