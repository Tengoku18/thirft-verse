import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const ArrowUpRightIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} fill="none" {...props}>
    <Path
      fill={props.color || "#000000"}
      d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5H9z"
    />
  </Svg>
);
export default ArrowUpRightIcon;
