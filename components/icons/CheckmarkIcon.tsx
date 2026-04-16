import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface CheckmarkIconProps extends SvgProps {
  size?: number;
  color?: string;
}

/**
 * Simple checkmark icon (without circle background)
 * Useful for list items, checklists, and benefit indicators
 */
const CheckmarkIcon: React.FC<CheckmarkIconProps> = ({
  size = 24,
  color = "#22C55E",
  ...props
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M20 6L9 17l-5-5"
      />
    </Svg>
  );
};

export default CheckmarkIcon;
