import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const CubeBoxIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} fill="none" {...props}>
    <Path fill={props.color || "#000000"} d="M3 5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v2H3V5z" />
    <Path
      fill={props.color || "#000000"}
      d="M3 9h18v10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V9zm5.5 2v2h7v-2h-7z"
    />
  </Svg>
);
export default CubeBoxIcon;
