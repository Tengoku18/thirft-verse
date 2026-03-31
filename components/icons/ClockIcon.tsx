import * as React from "react";
import Svg, { Circle, Path, SvgProps } from "react-native-svg";

const ClockIcon = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" width={20} height={20} {...props}>
    <Circle cx="12" cy="12" r="10" stroke="#64748B" strokeWidth="2" />
    <Path
      d="M12 6v6l4 2"
      stroke="#64748B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ClockIcon;
