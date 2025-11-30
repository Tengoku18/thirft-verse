import { typography } from "@/constants/theme";
import React from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";

interface TypographyProps extends TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

// ============================================
// HEADING COMPONENTS - Folito Font
// ============================================

export function HeadingLightText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.headingLightText, style]} {...props}>
      {children}
    </Text>
  );
}

export function HeadingRegularText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.headingRegularText, style]} {...props}>
      {children}
    </Text>
  );
}

export function HeadingMediumText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.headingMediumText, style]} {...props}>
      {children}
    </Text>
  );
}

export function HeadingSemiboldText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.headingSemiboldText, style]} {...props}>
      {children}
    </Text>
  );
}

export function HeadingBoldText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.headingBoldText, style]} {...props}>
      {children}
    </Text>
  );
}

export function HeadingExtraboldText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.headingExtraboldText, style]} {...props}>
      {children}
    </Text>
  );
}

export function HeadingBlackText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.headingBlackText, style]} {...props}>
      {children}
    </Text>
  );
}

// ============================================
// BODY COMPONENTS - Nunito Sans Font
// ============================================

export function BodyExtralightText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.bodyExtralightText, style]} {...props}>
      {children}
    </Text>
  );
}

export function BodyLightText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.bodyLightText, style]} {...props}>
      {children}
    </Text>
  );
}

export function BodyRegularText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.bodyRegularText, style]} {...props}>
      {children}
    </Text>
  );
}

export function BodyMediumText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.bodyMediumText, style]} {...props}>
      {children}
    </Text>
  );
}

export function BodySemiboldText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.bodySemiboldText, style]} {...props}>
      {children}
    </Text>
  );
}

export function BodyBoldText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.bodyBoldText, style]} {...props}>
      {children}
    </Text>
  );
}

export function BodyExtraboldText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.bodyExtraboldText, style]} {...props}>
      {children}
    </Text>
  );
}

export function BodyBlackText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.bodyBlackText, style]} {...props}>
      {children}
    </Text>
  );
}

// ============================================
// SMALL TEXT VARIANTS - Nunito Sans Font
// ============================================

export function BodySmallText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.bodySmallText, style]} {...props}>
      {children}
    </Text>
  );
}

export function BodySmallSemiboldText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.bodySmallSemiboldText, style]} {...props}>
      {children}
    </Text>
  );
}

export function CaptionText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.captionText, style]} {...props}>
      {children}
    </Text>
  );
}

// ============================================
// LEGACY ALIASES (for backward compatibility)
// ============================================

export function MainRegularText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.mainRegularText, style]} {...props}>
      {children}
    </Text>
  );
}

export function MainMediumText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.mainMediumText, style]} {...props}>
      {children}
    </Text>
  );
}

export function MainSemiboldText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.mainSemiboldText, style]} {...props}>
      {children}
    </Text>
  );
}

export function MainBoldText({
  children,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text style={[typography.mainBoldText, style]} {...props}>
      {children}
    </Text>
  );
}
