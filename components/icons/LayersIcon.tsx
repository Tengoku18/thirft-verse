import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const LayersIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} fill="none" {...props}>
    <Path
      fill={props.color || "#000000"}
      d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74z"
    />
    <Path
      fill={props.color || "#000000"}
      d="M12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"
    />
  </Svg>
);
export default LayersIcon;
