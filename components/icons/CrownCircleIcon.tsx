import * as React from "react";
import Svg, { Circle, Path, SvgProps } from "react-native-svg";

interface CrownCircleIconProps extends SvgProps {
  size?: number;
  circleColor?: string;
  crownColor?: string;
}

const CrownCircleIcon = ({
  size = 24,
  circleColor = "#D97706",
  crownColor = "#FFFFFF",
  ...props
}: CrownCircleIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx="12" cy="12" r="12" fill={circleColor} />
    {/* Crown spikes */}
    <Path
      fill={crownColor}
      d="M5.5 16.5 L5.5 8.5 L9 12.5 L12 6.5 L15 12.5 L18.5 8.5 L18.5 16.5 Z"
    />
    {/* Crown base bar */}
    <Path
      fill={crownColor}
      d="M5.5 17 H18.5 V18.2 Q18.5 18.8 17.8 18.8 H6.2 Q5.5 18.8 5.5 18.2 Z"
    />
  </Svg>
);

export default CrownCircleIcon;
