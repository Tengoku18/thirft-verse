import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const PhotoStackIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} fill="none" {...props}>
    <Path
      fill={props.color || "#000000"}
      d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4 2.03 2.71L16 11l4 5H8l3-4z"
    />
    <Path fill={props.color || "#000000"} d="M2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
  </Svg>
);
export default PhotoStackIcon;
