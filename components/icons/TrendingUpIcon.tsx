import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface TrendingUpIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const TrendingUpIcon: React.FC<TrendingUpIconProps> = ({
  size = 14,
  color = "#D4A373",
  ...props
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M3 17l6-6 4 4 8-8"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 7h7v7"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default TrendingUpIcon;
