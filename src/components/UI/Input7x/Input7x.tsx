import { ChangeEvent, FC, HTMLProps } from "react";
import classes from "./Input7x.module.scss";

interface Input7xProps extends HTMLProps<HTMLInputElement> {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input7x: FC<Input7xProps> = ({ ...props }) => {
  const inputClassName = props.className
    ? `${props.className} ${classes.input}`
    : classes.input;
  return <input {...props} className={inputClassName} />;
};

export default Input7x;
