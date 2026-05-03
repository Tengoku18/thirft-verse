import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const WarningFillIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} fill="none" {...props}>
    <Path
      fill={props.color || "#000000"}
      fillRule="evenodd"
      d="M12 2 1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"
    />
  </Svg>
);
export default WarningFillIcon;
