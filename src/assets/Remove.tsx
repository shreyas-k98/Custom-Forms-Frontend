import { MouseEventHandler } from "react";
import { noop } from "../Helpers/helper";

interface Props {
  style?: Object;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export const RemoveIcon = (props: Props): JSX.Element => {
  const { className = "", style = {}, onClick = noop } = props;
  return (
    <div className={className} style={style} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20px"
        height="20px"
        fill="currentColor"
        className="bi bi-x"
        viewBox="0 0 16 16"
      >
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
      </svg>
    </div>
  );
};
