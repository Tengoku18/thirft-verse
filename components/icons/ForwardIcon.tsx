import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const ForwardIcon = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} {...props}>
    <Path
      fill={props.color || "#000000"}
      d="M19.219 11.25l-7 7L14 20l10-10-10-10-1.781 1.75 7 7H4v2.5h15.219Z"
    />
  </Svg>
);

export default ForwardIcon;
