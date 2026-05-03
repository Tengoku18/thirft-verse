import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface HomeIconProps extends SvgProps {
  size?: number;
}

const HomeIcon: React.FC<HomeIconProps> = ({ size, ...props }) => (
  <Svg
    width={size || (props.width as number) || 24}
    height={size || (props.height as number) || 24}
    fill="none"
    viewBox="0 0 16 18"
    {...props}
  >
    <Path
      fill={props.color || "#000000"}
      d="M2 16h3v-6h6v6h3V7L8 2.5 2 7v9m-2 2V6l8-6 8 6v12H9v-6H7v6H0m8-8.75"
    />
  </Svg>
);

export default HomeIcon;
