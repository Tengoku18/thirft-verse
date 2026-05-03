import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const QuestionMarkCircleIcon: React.FC<SvgProps> = (props) => (
  <Svg
    width={props.width || 24}
    height={props.height || 24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      fill={props.color || "#000000"}
      fillRule="evenodd"
      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm10-7a3.5 3.5 0 0 0-3.344 4.953 1 1 0 0 1-1.896.447A5.5 5.5 0 1 1 17 12a1 1 0 0 1-2 0 3.5 3.5 0 0 0-3.5-3.5Zm0 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
      clipRule="evenodd"
    />
  </Svg>
);

export default QuestionMarkCircleIcon;
