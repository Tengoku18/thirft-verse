import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const ArrowUpCircleFillIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} fill="none" {...props}>
    <Path
      fill={props.color || "#000000"}
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14v-4H7l5-5 5 5h-4v4h-2z"
    />
  </Svg>
);
export default ArrowUpCircleFillIcon;
