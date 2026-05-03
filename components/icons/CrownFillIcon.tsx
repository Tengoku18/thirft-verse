import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const CrownFillIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} fill="none" {...props}>
    <Path fill={props.color || "#000000"} d="M5 16 3 5l5.5 5L12 2l3.5 8L21 5l-2 11H5z" />
    <Path fill={props.color || "#000000"} d="M5 17h14v2c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-2z" />
  </Svg>
);
export default CrownFillIcon;
