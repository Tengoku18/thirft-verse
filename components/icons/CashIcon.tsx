import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface CashIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const CashIcon: React.FC<CashIconProps> = ({
  size = 22,
  color = "#3B3030",
  ...props
}) => (
  <Svg
    width={size}
    height={size * (16 / 22)}
    fill="none"
    viewBox="0 0 22 16"
    {...props}
  >
    <Path
      fill={color}
      d="M13 9a2.893 2.893 0 0 1-2.125-.875A2.893 2.893 0 0 1 10 6c0-.833.292-1.542.875-2.125A2.893 2.893 0 0 1 13 3c.833 0 1.542.292 2.125.875S16 5.167 16 6s-.292 1.542-.875 2.125A2.893 2.893 0 0 1 13 9Zm-7 3c-.55 0-1.02-.196-1.412-.588A1.926 1.926 0 0 1 4 10V2c0-.55.196-1.02.588-1.413A1.926 1.926 0 0 1 6 0h14c.55 0 1.02.196 1.413.588C21.803.979 22 1.45 22 2v8c0 .55-.196 1.02-.587 1.412A1.926 1.926 0 0 1 20 12H6Zm2-2h10c0-.55.196-1.02.587-1.412A1.926 1.926 0 0 1 20 8V4c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 18 2H8c0 .55-.196 1.02-.588 1.413A1.926 1.926 0 0 1 6 4v4c.55 0 1.02.196 1.412.588C7.804 8.979 8 9.45 8 10Zm11 6H2c-.55 0-1.02-.196-1.413-.588A1.926 1.926 0 0 1 0 14V3h2v11h17v2Z"
    />
  </Svg>
);

export default CashIcon;
