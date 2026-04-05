import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface BagIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const BagIcon: React.FC<BagIconProps> = ({
  size = 16,
  color = "#D4A373",
  ...props
}) => (
  <Svg
    width={size}
    height={size * 1.375}
    fill="none"
    viewBox="0 0 16 22"
    {...props}
  >
    <Path
      fill={color}
      d="M2 20c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 0 18V6c0-.55.196-1.02.588-1.412A1.926 1.926 0 0 1 2 4h2c0-1.1.392-2.042 1.175-2.825C5.958.392 6.9 0 8 0s2.042.392 2.825 1.175C11.608 1.958 12 2.9 12 4h2c.55 0 1.02.196 1.412.588.392.391.588.862.588 1.412v12c0 .55-.196 1.02-.588 1.413A1.926 1.926 0 0 1 14 20H2Zm0-2h12V6h-2v2c0 .283-.096.52-.287.713A.968.968 0 0 1 11 9a.968.968 0 0 1-.713-.287A.967.967 0 0 1 10 8V6H6v2c0 .283-.096.52-.287.713A.968.968 0 0 1 5 9a.968.968 0 0 1-.713-.287A.968.968 0 0 1 4 8V6H2v12ZM6 4h4c0-.55-.196-1.02-.588-1.413A1.926 1.926 0 0 0 8 2c-.55 0-1.02.196-1.412.587A1.926 1.926 0 0 0 6 4ZM2 18V6v12Z"
    />
  </Svg>
);

export default BagIcon;
