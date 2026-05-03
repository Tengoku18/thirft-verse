import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const WifiSlashIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} fill="none" {...props}>
    <Path
      fill={props.color || "#000000"}
      d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8 3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4 2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"
    />
    <Path
      fill={props.color || "#000000"}
      d="M3.41 2 2 3.41 20.59 22l1.41-1.41L3.41 2z"
    />
  </Svg>
);
export default WifiSlashIcon;
