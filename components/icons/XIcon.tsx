import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const XIcon = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} {...props}>
    <Path
      fill={props.color || "#000000"}
      d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z"
    />
  </Svg>
);
export default XIcon;
