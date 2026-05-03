import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const RocketIcon: React.FC<SvgProps> = (props) => (
  <Svg
    width={props.width || 24}
    height={props.height || 24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      fill={props.color || "#000000"}
      d="M12 2L4 8v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V8l-8-6Zm0 2.9L18.9 8H5.1l6.9-3.1Zm0 10.1c-1.1 0-2-0.9-2-2s0.9-2 2-2 2 0.9 2 2-0.9 2-2 2Z"
    />
  </Svg>
);

export default RocketIcon;
