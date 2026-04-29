import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const StarIcon = (props: SvgProps) => (
  <Svg width={props.width || 24} height={props.height || 24} viewBox="0 0 12 12" fill="none" {...props}>
    <Path
      fill={props.color || "#000000"}
      d="M3.996 8.648 5.833 7.54l1.838 1.122-.481-2.1 1.618-1.4-2.129-.19-.846-1.982-.846 1.968-2.129.19 1.62 1.415-.482 2.085ZM2.23 11.083l.948-4.098L0 4.23l4.2-.364L5.833 0l1.634 3.865 4.2.364-3.18 2.756.948 4.098L5.833 8.91l-3.602 2.173Z"
    />
  </Svg>
);
export default StarIcon;
