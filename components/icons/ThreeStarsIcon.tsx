import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const ThreeStarsIcon = (props: SvgProps) => (
  <Svg width={props.width || 24} height={props.height || 24} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color || "#000000"}
      d="m18 8-1.25-2.75L14 4l2.75-1.25L18 0l1.25 2.75L22 4l-2.75 1.25L18 8Zm0 14-1.25-2.75L14 18l2.75-1.25L18 14l1.25 2.75L22 18l-2.75 1.25L18 22ZM8 19l-2.5-5.5L0 11l5.5-2.5L8 3l2.5 5.5L16 11l-5.5 2.5L8 19Zm0-4.85L9 12l2.15-1L9 10 8 7.85 7 10l-2.15 1L7 12l1 2.15Z"
    />
  </Svg>
);
export default ThreeStarsIcon;
