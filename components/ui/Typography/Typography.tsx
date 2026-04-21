import React from "react";
import { Text, type TextStyle } from "react-native";
import { TYPOGRAPHY_VARIANTS } from "../../../constants/theme";
import { TYPOGRAPHY_CONFIG, type TypographyProps } from "./Typography.types";

export const Typography = React.forwardRef<Text, TypographyProps>(
  (
    {
      variation = "body",
      intent = "default",
      children,
      className = "",
      style,
      numberOfLines,
      ...rest
    },
    ref,
  ) => {
    const config = TYPOGRAPHY_CONFIG[variation];
    const intentClass = TYPOGRAPHY_VARIANTS[intent];

    const textStyle: TextStyle = {
      fontSize: config.fontSize,
      fontWeight: config.fontWeight,
      lineHeight: config.lineHeight,
    };

    // Merge intent variant with custom className
    const mergedClassName = `${intentClass} ${className}`.trim();

    return (
      <Text
        ref={ref}
        numberOfLines={numberOfLines}
        className={mergedClassName}
        style={[textStyle, style]}
        {...rest}
      >
        {children}
      </Text>
    );
  },
);

Typography.displayName = "Typography";

export default Typography;
