import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const SparklesIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} fill="none" {...props}>
    <Path fill={props.color || "#000000"} d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25z" />
    <Path fill={props.color || "#000000"} d="m19 15-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25z" />
    <Path fill={props.color || "#000000"} d="M11.5 9.5 9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5z" />
  </Svg>
);
export default SparklesIcon;
