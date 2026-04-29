import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const SendIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} fill="none" {...props}>
    <Path fill={props.color || "#000000"} d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
  </Svg>
);
export default SendIcon;
