import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const WarningIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} fill="none" {...props}>
    <Path
      stroke={props.color || "#000000"}
      strokeWidth={2}
      d="M12 3 2 21h20L12 3z"
    />
    <Path
      fill={props.color || "#000000"}
      d="M11 10h2v5h-2zm0 7h2v2h-2z"
    />
  </Svg>
);
export default WarningIcon;
