import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const SvgComponent = (props: SvgProps) => (
  <Svg width={10} height={12} fill="none" {...props}>
    <Path
      fill="#fff"
      d="M3.5 9.333c-.32 0-.595-.114-.824-.342a1.123 1.123 0 0 1-.343-.824v-7c0-.321.115-.596.343-.824C2.905.114 3.179 0 3.5 0h5.25c.32 0 .595.114.824.343.228.228.343.503.343.824v7c0 .32-.115.595-.343.824a1.123 1.123 0 0 1-.824.342H3.5m0-1.166h5.25v-7H3.5v7m-2.333 3.5c-.321 0-.596-.115-.824-.343A1.124 1.124 0 0 1 0 10.5V2.333h1.167V10.5h6.416v1.167H1.167m2.333-3.5v-7 7"
    />
  </Svg>
);
export default SvgComponent;
