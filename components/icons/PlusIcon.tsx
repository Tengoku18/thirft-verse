import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface PlusIconProps extends SvgProps {
  size?: number;
}

const PlusIcon: React.FC<PlusIconProps> = ({ size, ...props }) => (
  <Svg
    width={size || (props.width as number) || 24}
    height={size || (props.height as number) || 24}
    fill="none"
    viewBox="0 0 18 18"
    {...props}
  >
    <Path fill={props.color || "#000000"} d="M7.5 10H0V7.5h7.5V0H10v7.5h7.5V10H10v7.5H7.5V10" />
  </Svg>
);

export default PlusIcon;
