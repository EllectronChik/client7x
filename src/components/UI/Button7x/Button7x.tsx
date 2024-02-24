import { FC, ReactNode } from "react";
import classes from "./Button7x.module.scss";

interface Button7xProps {
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  children?: ReactNode;
  onClick?: () => void;
}

/**
 * Button7x Component
 * @description A customizable button component with version 7x styling.
 * @param {string} [className] - Additional class name(s) for custom styling.
 * @param {"button" | "submit" | "reset" | undefined} [type] - The type of button. Defaults to "button".
 * @param {React.ReactNode} [children] - The content to be displayed inside the button.
 * @param {() => void} [onClick] - Function to be executed when the button is clicked.
 */
const Button7x: FC<Button7xProps> = ({
  type,
  children,
  className,
  onClick,
}) => {
  return (
    <button className={className} type={type} onClick={onClick}>
      <div className={`${classes.button} ${classes.v8}`}>
        <span className={classes.label}>{children}</span>
        <span className={classes.icon}>
          <span></span>
        </span>
      </div>
    </button>
  );
};

export default Button7x;
