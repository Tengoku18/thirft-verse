import * as React from "react";
import Svg, { G, Path, SvgProps } from "react-native-svg";
const LockIcon = (props: SvgProps) => {
  const { width = 24, height = 24, ...restProps } = props;

  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 24 24"
      {...restProps}
    >
      <G fill="#000">
        <Path d="M13 14a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z" />
        <Path
          fillRule="evenodd"
          d="M7 8.12c-1.684.412-3 1.84-3 3.65v5.538C4 19.973 6.315 22 9 22h6c2.685 0 5-2.027 5-4.692v-5.539c0-1.81-1.316-3.237-3-3.649V7A5 5 0 0 0 7 7v1.12ZM15 7v1H9V7a2.995 2.995 0 0 1 3-3 3.001 3.001 0 0 1 3 3Zm-9 4.77c0-.904.819-1.77 2-1.77h8c1.181 0 2 .866 2 1.77v5.538C18 18.72 16.734 20 15 20H9c-1.734 0-3-1.28-3-2.692v-5.539Z"
          clipRule="evenodd"
        />
      </G>
    </Svg>
  );
};
export default LockIcon;
