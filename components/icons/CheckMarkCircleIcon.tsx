import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface CheckmarkIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const CheckMarkCircleIcon: React.FC<CheckmarkIconProps> = ({
  size = 24,
  color = "#22C55E",
  ...props
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path fill="#fff" d="M0 0h24v24H0z" />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-2.707a1 1 0 0 1 0 1.414l-3.683 3.683a1.449 1.449 0 0 1-2.048 0l-1.683-1.683a1 1 0 1 1 1.414-1.414L11 12.586l3.293-3.293a1 1 0 0 1 1.414 0Z"
        clipRule="evenodd"
      />
    </Svg>
  );
};

export default CheckMarkCircleIcon;
