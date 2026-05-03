import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const BookFillIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} fill="none" {...props}>
    <Path
      fill={props.color || "#000000"}
      d="M18 2h-2v7l-2.5-1.5L11 9V2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
    />
  </Svg>
);
export default BookFillIcon;
