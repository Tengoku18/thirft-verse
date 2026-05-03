import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface RightArrowIconProps extends SvgProps {
  size?: number;
}

const RightArrowIcon: React.FC<RightArrowIconProps> = ({ size, ...props }) => (
  <Svg
    fill="none"
    viewBox="0 0 24 24"
    width={size || (props.width as number) || 24}
    height={size || (props.height as number) || 24}
    {...props}
  >
    <Path
      stroke={props.color || "#000000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="m10 7 5 5-5 5"
    />
  </Svg>
);

export default RightArrowIcon;
