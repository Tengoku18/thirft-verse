import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const DoorInIcon = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    <Path
      fill="#fff"
      d="M6.75 13.5V12H12V1.5H6.75V0H12c.412 0 .766.147 1.06.44.293.294.44.647.44 1.06V12c0 .412-.147.766-.44 1.06-.294.293-.648.44-1.06.44H6.75Zm-1.5-3L4.219 9.412 6.13 7.5H0V6h6.131L4.22 4.088 5.25 3 9 6.75 5.25 10.5Z"
    />
  </Svg>
);
export default DoorInIcon;
