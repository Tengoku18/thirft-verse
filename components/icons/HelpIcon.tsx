import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const HelpIcon: React.FC<SvgProps> = (props) => (
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
      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9-5a1.5 1.5 0 0 0-1.5 1.5c0 .823.663 1.5 1.5 1.5S12 9.823 12 9 11.337 7 10.5 7Zm0 6a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0v-3a1 1 0 0 0-1-1Z"
      clipRule="evenodd"
    />
  </Svg>
);

export default HelpIcon;
