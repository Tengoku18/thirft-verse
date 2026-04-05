import * as React from "react";
import Svg, { G, Path, SvgProps } from "react-native-svg";
const LocationIcon = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 24 24" width={24} height={24} {...props}>
    <G
      stroke={props.color || "#3B3030"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    >
      <Path d="M12 21c3.5-3.6 7-6.824 7-10.8C19 6.224 15.866 3 12 3s-7 3.224-7 7.2 3.5 7.2 7 10.8Z" />
      <Path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </G>
  </Svg>
);
export default LocationIcon;
