import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const ReceiptIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={props.width || 24} height={props.height || 24} fill="none" {...props}>
    <Path
      fill={props.color || "#000000"}
      d="M4 2v20h16V2H4zm14 18H6V4h12v16zm-9-3h6v2H9zm0-4h6v2H9zm0-4h6v2H9z"
    />
  </Svg>
);
export default ReceiptIcon;
