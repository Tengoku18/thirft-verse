import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const ArrowDownRightIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    width={props.width || 24}
    height={props.height || 24}
    fill="none"
    {...props}
  >
    <Path
      fill={props.color || "#000000"}
      d="M15 9V5h-2v6.59L4 18.59 5.41 20 15 9.41V15h2V9h-2z"
    />
  </Svg>
);
export default ArrowDownRightIcon;
