import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const CheckIcon = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} {...props}>
    <Path
      stroke={props.color || "#000000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 12.611 8.923 17.5 20 6.5"
    />
  </Svg>
);
export default CheckIcon;
