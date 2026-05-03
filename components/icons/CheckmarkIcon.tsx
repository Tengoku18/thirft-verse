import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface CheckmarkIconProps extends SvgProps {
  size?: number;
}

const CheckmarkIcon: React.FC<CheckmarkIconProps> = ({ size, ...props }) => (
  <Svg
    width={size || (props.width as number) || 24}
    height={size || (props.height as number) || 24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      stroke={props.color || "#000000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M20 6 9 17l-5-5"
    />
  </Svg>
);

export default CheckmarkIcon;
