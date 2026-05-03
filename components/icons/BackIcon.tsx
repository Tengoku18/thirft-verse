import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const BackIcon = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} {...props}>
    <Path
      fill={props.color || "#000000"}
      d="m4.781 11.25 7 7L10 20 0 10 10 0l1.781 1.75-7 7H20v2.5H4.781Z"
    />
  </Svg>
);
export default BackIcon;
