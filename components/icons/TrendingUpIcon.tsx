import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface TrendingUpIconProps extends SvgProps {
  size?: number;
}

const TrendingUpIcon: React.FC<TrendingUpIconProps> = ({ size, ...props }) => (
  <Svg
    width={size || (props.width as number) || 24}
    height={size || (props.height as number) || 24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M3 17l6-6 4 4 8-8"
      stroke={props.color || "#000000"}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 7h7v7"
      stroke={props.color || "#000000"}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default TrendingUpIcon;
