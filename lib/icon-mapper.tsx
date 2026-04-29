/**
 * SF Symbol to SVG Icon Component Mapper
 * Provides a centralized mapping from SF Symbol names to SVG icon components
 */

import {
  ArrowDownRightIcon,
  ArrowUpCircleFillIcon,
  ArrowUpRightIcon,
  BackIcon,
  BagIcon,
  BellFillIcon,
  BellSlashFillIcon,
  BookFillIcon,
  CalendarIcon,
  ChartBarFillIcon,
  CheckIcon,
  CheckMarkCircleIcon,
  CheckmarkSealFillIcon,
  ChevronRightIcon,
  ClockArrowIcon,
  ClockIcon,
  CreditCardFillIcon,
  CreditCardIcon,
  CrownFillIcon,
  CubeBoxIcon,
  CubeIcon,
  DoorInIcon,
  EyeCloseIcon,
  EyeIcon,
  FlameFillIcon,
  GearIcon,
  GlobeIcon,
  HeartIcon,
  HelpIcon,
  LayersIcon,
  LightbulbFillIcon,
  LinkIcon,
  LocationIcon,
  LockIcon,
  MailIcon,
  MinusIcon,
  NotificationIcon,
  PencilIcon,
  PhoneFillIcon,
  PhotoStackIcon,
  PlusIcon,
  QRCodeIcon,
  QuestionMarkCircleIcon,
  ReceiptIcon,
  RefreshIcon,
  RefundIcon,
  RightArrowIcon,
  SearchIcon,
  SendIcon,
  ShareIcon,
  ShippingBoxIcon,
  ShopIcon,
  SparklesIcon,
  SquarePencilIcon,
  StarIcon,
  TagFillIcon,
  TrashIcon,
  TrendingUpIcon,
  UserIcon,
  WarningFillIcon,
  WarningIcon,
  WifiSlashIcon,
  XCircleFillIcon,
  XIcon,
} from "@/components/icons";
import React from "react";

type SFSymbolName = string;

// Mapping from SF Symbol names to SVG icon components
const SF_SYMBOL_TO_COMPONENT: Record<SFSymbolName, React.ComponentType<any>> = {
  // Navigation
  "house.fill": ShopIcon,
  "chevron.left": BackIcon,
  "chevron.right": ChevronRightIcon,
  "chevron.up": ChevronRightIcon, // Requires rotation
  "chevron.down": ChevronRightIcon, // Requires rotation
  "arrow.left": BackIcon,
  "arrow.right": RightArrowIcon,

  // Actions
  xmark: XIcon,
  "xmark.circle.fill": XCircleFillIcon,
  checkmark: CheckIcon,
  "checkmark.circle.fill": CheckMarkCircleIcon,
  "checkmark.seal.fill": CheckmarkSealFillIcon,
  plus: PlusIcon,
  "plus.circle": PlusIcon,
  pencil: PencilIcon,
  "square.and.pencil": SquarePencilIcon,
  trash: TrashIcon,
  "paperplane.fill": SendIcon,
  "square.and.arrow.up": ShareIcon,
  link: LinkIcon,
  eye: EyeIcon,
  "eye.fill": EyeIcon,
  "eye.slash": EyeCloseIcon,
  "eye.slash.fill": EyeCloseIcon,
  globe: GlobeIcon,
  "arrow.uturn.left.circle.fill": RefundIcon,
  "arrow.uturn.backward.circle.fill": RefundIcon,

  // Media
  photo: PhotoStackIcon,
  "photo.stack": PhotoStackIcon,
  camera: PhotoStackIcon,

  // Commerce
  bag: BagIcon,
  "bag.fill": BagIcon,
  "shippingbox.fill": ShippingBoxIcon,
  storefront: ShopIcon,
  "tag.fill": TagFillIcon,
  "cube.box.fill": CubeBoxIcon,
  creditcard: CreditCardIcon,
  "creditcard.fill": CreditCardFillIcon,

  // Status
  "clock.fill": ClockIcon,
  clock: ClockIcon,
  calendar: CalendarIcon,
  "exclamationmark.triangle": WarningIcon,
  "exclamationmark.triangle.fill": WarningFillIcon,
  "info.circle.fill": HelpIcon,
  "info.circle": HelpIcon,
  "questionmark.circle": QuestionMarkCircleIcon,
  "questionmark.circle.fill": QuestionMarkCircleIcon,
  "checkmark.circle": CheckMarkCircleIcon,
  "bell.fill": BellFillIcon,
  bell: BellFillIcon,
  "bell.slash.fill": BellSlashFillIcon,

  // User
  "person.fill": UserIcon,
  person: UserIcon,
  "person.crop.circle": UserIcon,
  "person.crop.circle.fill": UserIcon,
  "gearshape.fill": GearIcon,
  "lock.fill": LockIcon,
  lock: LockIcon,
  shield: LockIcon,
  "shield.fill": LockIcon,
  qrcode: QRCodeIcon,

  // Contact
  "envelope.fill": MailIcon,
  mail: MailIcon,
  "phone.fill": PhoneFillIcon,
  call: PhoneFillIcon,

  // Documents
  "doc.text": ReceiptIcon,
  "doc.text.fill": ReceiptIcon,
  "doc.plaintext.fill": ReceiptIcon,
  flag: WarningIcon,
  "flag.fill": WarningFillIcon,
  hammer: GearIcon,
  "hammer.fill": GearIcon,
  "rectangle.portrait.and.arrow.right": DoorInIcon,
  "rectangle.portrait.and.arrow.right.fill": DoorInIcon,

  // Analytics
  "chart.bar.fill": ChartBarFillIcon,
  "chart.line.uptrend.xyaxis": TrendingUpIcon,
  "arrow.up.right": ArrowUpRightIcon,
  "arrow.down.right": ArrowDownRightIcon,
  "arrow.up.circle.fill": ArrowUpCircleFillIcon,
  "arrow.right.circle.fill": ArrowUpCircleFillIcon,
  "arrow.triangle.2.circlepath": RefreshIcon,
  "arrow.clockwise": RefreshIcon,

  // Location
  "mappin.circle.fill": LocationIcon,
  location: LocationIcon,

  // Verification
  // "checkmark.seal.fill": CheckmarkSealFillIcon,

  // Finance
  "banknote.fill": CreditCardFillIcon,
  "clock.arrow.circlepath": ClockArrowIcon,

  // Search
  magnifyingglass: SearchIcon,

  // Help & Support (custom names)
  forum: NotificationIcon,
  "help-circle": HelpIcon,
  "help-circle-outline": HelpIcon,

  // Other common ones
  spark: SparklesIcon,
  sparkles: SparklesIcon,
  "flame.fill": FlameFillIcon,
  flame: FlameFillIcon,
  heart: HeartIcon,
  star: StarIcon,
  "star.fill": StarIcon,
  crown: CrownFillIcon,
  "crown.fill": CrownFillIcon,
  book: BookFillIcon,
  "book.fill": BookFillIcon,
  cube: CubeIcon,
  layers: LayersIcon,
  lightbulb: LightbulbFillIcon,
  "lightbulb.fill": LightbulbFillIcon,
  minus: MinusIcon,
  "wifi.slash": WifiSlashIcon,
};

/**
 * Get an SVG icon component for a given SF Symbol name
 * @param symbolName - SF Symbol name (e.g., "checkmark.circle.fill")
 * @param fallback - Fallback icon if not found
 * @returns SVG icon component or fallback
 */
export function getSFSymbolIcon(
  symbolName: string,
  fallback = HelpIcon,
): React.ComponentType<any> {
  return SF_SYMBOL_TO_COMPONENT[symbolName] || fallback;
}

/**
 * Render an SF Symbol icon with props
 * @param symbolName - SF Symbol name
 * @param props - Icon props (size, color, etc.)
 * @returns React element
 */
export function renderSFSymbolIcon(
  symbolName: string,
  props?: { size?: number; color?: string; [key: string]: any },
): React.ReactNode {
  const IconComponent = getSFSymbolIcon(symbolName);
  return <IconComponent width={props?.size} height={props?.size} {...props} />;
}

export default SF_SYMBOL_TO_COMPONENT;
