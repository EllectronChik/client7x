import React from "react";
import classes from "./Button7x.module.scss";

interface Button7xProps {
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  children?: React.ReactNode;
  onClick?: () => void;
}

const Button7x: React.FC<Button7xProps> = ({
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
