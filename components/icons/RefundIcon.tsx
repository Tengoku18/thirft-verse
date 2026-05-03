import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const RefundIcon: React.FC<SvgProps> = (props) => (
  <Svg
    width={props.width || 24}
    height={props.height || 24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      fill={props.color || "#000000"}
      fillRule="evenodd"
      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11.293-4.293a1 1 0 1 0-1.414 1.414L11.586 9H8a1 1 0 0 0 0 2h4a1 1 0 0 0 1-1V8l1.293 1.293Z"
      clipRule="evenodd"
    />
  </Svg>
);

export default RefundIcon;
