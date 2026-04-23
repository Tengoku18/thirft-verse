import { TextProps } from "react-native";
import { type TextIntent } from "../../../constants/theme";

export type TypographyVariation =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "body"
  | "body-sm"
  | "body-xs"
  | "button"
  | "caption"
  | "label";

export interface TypographyProps extends TextProps {
  variation?: TypographyVariation;
  intent?: TextIntent;
  children: React.ReactNode;
}

export const TYPOGRAPHY_CONFIG = {
  h1: { fontSize: 32, fontWeight: "700" as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: "700" as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: "600" as const, lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: "600" as const, lineHeight: 26 },
  h5: { fontSize: 16, fontWeight: "600" as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
  "body-sm": { fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
  "body-xs": { fontSize: 12, fontWeight: "400" as const, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: "700" as const, lineHeight: 24 },
  caption: { fontSize: 12, fontWeight: "500" as const, lineHeight: 16 },
  label: { fontSize: 14, fontWeight: "600" as const, lineHeight: 20 },
} as const;
