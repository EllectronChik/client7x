import React from "react";
import classes from "./DoubleText.module.scss";

interface DoubleTextProps {
  className?: string;
  text: string;
}

const DoubleText: React.FC<DoubleTextProps> = ({ text, className }) => {
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
