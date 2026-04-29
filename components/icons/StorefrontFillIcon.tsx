import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const StorefrontFillIcon: React.FC<SvgProps> = (props) => (
  <Svg
    width={props.width || 24}
    height={props.height || 24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      fill={props.color || "#000000"}
      d="M3 6v13c0 1.105.895 2 2 2h14c1.105 0 2-.895 2-2V6H3Zm4 0l-2 8h14l-2-8H7Zm0 0h10V2H7v4Z"
    />
  </Svg>
);

export default StorefrontFillIcon;
