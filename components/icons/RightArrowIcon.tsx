import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface RightArrowIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const RightArrowIcon: React.FC<RightArrowIconProps> = ({
  size = 24,
  color = "#000",
  ...props
}) => (
  <Svg fill="none" viewBox="0 0 24 24" width={size} height={size} {...props}>
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="m10 7 5 5-5 5"
    />
  </Svg>
);

export default RightArrowIcon;
