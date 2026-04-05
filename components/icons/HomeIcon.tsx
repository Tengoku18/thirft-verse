import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface HomeIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const HomeIcon: React.FC<HomeIconProps> = ({
  size = 16,
  color = "#3B3030",
  ...props
}) => (
  <Svg
    width={size}
    height={size * 1.125}
    fill="none"
    viewBox="0 0 16 18"
    {...props}
  >
    <Path
      fill={color}
      d="M2 16h3v-6h6v6h3V7L8 2.5 2 7v9m-2 2V6l8-6 8 6v12H9v-6H7v6H0m8-8.75"
    />
  </Svg>
);

export default HomeIcon;
