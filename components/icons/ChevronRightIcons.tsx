import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const ChevronRightIcon = (props: SvgProps) => (
  <Svg width={8} height={12} fill="none" {...props}>
    <Path
      fill={props.color || "#3B3030"}
      fillOpacity={0.3}
      d="M4.6 6 0 1.4 1.4 0l6 6-6 6L0 10.6 4.6 6"
    />
  </Svg>
);
export default ChevronRightIcon;
