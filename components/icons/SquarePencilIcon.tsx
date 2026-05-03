import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const SquarePencilIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} fill="none" {...props}>
    <Path
      fill={props.color || "#000000"}
      d="M19 19H5V5h10l2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7l-2 2v5z"
    />
    <Path
      fill={props.color || "#000000"}
      d="M20.71 4.04a.996.996 0 0 0 0-1.41l-1.34-1.34a.996.996 0 0 0-1.41 0L13.84 5.5l2.75 2.75 4.12-4.21zM3 17.25V20h2.75l8.1-8.1-2.75-2.75L3 17.25z"
    />
  </Svg>
);
export default SquarePencilIcon;
