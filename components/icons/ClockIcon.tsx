import * as React from "react";
import Svg, { Circle, Path, SvgProps } from "react-native-svg";

interface ClockIconProps extends SvgProps {
  size?: number;
}

const ClockIcon: React.FC<ClockIconProps> = ({ size, ...props }) => (
  <Svg
    fill="none"
    viewBox="0 0 24 24"
    width={size || (props.width as number) || 24}
    height={size || (props.height as number) || 24}
    {...props}
  >
    <Circle cx="12" cy="12" r="10" stroke={props.color || "#000000"} strokeWidth="2" />
    <Path
      d="M12 6v6l4 2"
      stroke={props.color || "#000000"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ClockIcon;
