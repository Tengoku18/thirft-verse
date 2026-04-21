import * as React from "react";
import Svg, { Circle, Path, SvgProps } from "react-native-svg";

interface ClockIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const ClockIcon: React.FC<ClockIconProps> = ({
  size = 20,
  color = "#64748B",
  ...props
}) => (
  <Svg fill="none" viewBox="0 0 24 24" width={size} height={size} {...props}>
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path
      d="M12 6v6l4 2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ClockIcon;
