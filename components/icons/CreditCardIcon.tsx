import React from "react";
import Svg, { Path, Rect, SvgProps } from "react-native-svg";

const CreditCardIcon: React.FC<SvgProps> = (props) => (
  <Svg
    width={props.width || 24}
    height={props.height || 24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Rect
      x="2"
      y="5"
      width="20"
      height="14"
      rx="2"
      fill={props.color || "#000000"}
      opacity="0.1"
    />
    <Rect
      x="2"
      y="5"
      width="20"
      height="4"
      rx="2"
      fill={props.color || "#000000"}
    />
    <Path
      d="M6 14H6.01"
      stroke={props.color || "#000000"}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export default CreditCardIcon;
