import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const ChartBarFillIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} fill="none" {...props}>
    <Path fill={props.color || "#000000"} d="M5 9.2h3V19H5V9.2z" />
    <Path fill={props.color || "#000000"} d="M10.6 5h2.8v14h-2.8V5z" />
    <Path fill={props.color || "#000000"} d="M16.2 13h2.8v6h-2.8v-6z" />
  </Svg>
);
export default ChartBarFillIcon;
