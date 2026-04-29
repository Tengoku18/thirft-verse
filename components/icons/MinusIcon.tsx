import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const MinusIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} fill="none" {...props}>
    <Path fill={props.color || "#000000"} d="M19 13H5v-2h14v2z" />
  </Svg>
);
export default MinusIcon;
