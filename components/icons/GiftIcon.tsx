import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface GiftIconProps extends SvgProps {
  size?: number;
}

const GiftIcon: React.FC<GiftIconProps> = ({ size, ...props }) => (
  <Svg
    width={size || (props.width as number) || 24}
    height={size || (props.height as number) || 24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      stroke={props.color || "#000000"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 17h18m-9-9-2 4m2-4 2 4m-2-4H7.5a2.5 2.5 0 1 1 0-5C11 3 12 8 12 8Zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8ZM6.2 21h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C21 19.48 21 18.92 21 17.8v-6.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C19.48 8 18.92 8 17.8 8H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C3 9.52 3 10.08 3 11.2v6.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C4.52 21 5.08 21 6.2 21Z"
    />
  </Svg>
);

export default GiftIcon;
