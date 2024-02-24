import { ChangeEvent, FC, HTMLProps } from "react";
import classes from "./Input7x.module.scss";

interface Input7xProps extends HTMLProps<HTMLInputElement> {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Input component for the 7x application.
 * This component extends the functionality of the HTML input element and provides custom styling.
 * 
 * @param {Input7xProps} props - Props for the Input7x component.
 * @param {string} [props.className] - Additional CSS classes to be applied to the input element.
 * @param {(e: ChangeEvent<HTMLInputElement>) => void} [props.onChange] - Event handler for input change events.
 */
const Input7x: FC<Input7xProps> = ({ ...props }) => {
  const inputClassName = props.className
    ? `${props.className} ${classes.input}`
    : classes.input;
  return <input {...props} className={inputClassName} />;
};

export default Input7x;
