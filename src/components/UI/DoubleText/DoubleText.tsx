import { FC } from "react";
import classes from "./DoubleText.module.scss";

interface DoubleTextProps {
  className?: string;
  text: string;
}

/**
 * DoubleText Component: Renders each letter of the provided text twice.
 * Useful for creating visual effects or emphasizing text.
 * @param {DoubleTextProps} props - Component props.
 * @param {string} props.text - The text to render.
 * @param {string} [props.className] - Additional class name(s) for custom styling.
 */
const DoubleText: FC<DoubleTextProps> = ({ text, className }) => {
  const textArray = [...text];
  return (
    <div className={`${classes.double_text} ${className}`}>
      {textArray.map((letter, index) => (
        <span data-title={letter} key={index}>
          {letter}
        </span>
      ))}
    </div>
  );
};

export default DoubleText;
