import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const BellFillIcon: React.FC<SvgProps> = (props) => (
  <Svg
    width={props.width || 24}
    height={props.height || 24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      fill={props.color || "#000000"}
      d="M12 2c-1.104 0-2 .896-2 2v1c-3.313 0-6 2.687-6 6v5l-2 3v1h16v-1l-2-3v-5c0-3.313-2.687-6-6-6V4c0-1.104-.896-2-2-2Zm0 16c1.104 0 2 .896 2 2H10c0-1.104.896-2 2-2Z"
    />
  </Svg>
);

export default BellFillIcon;
