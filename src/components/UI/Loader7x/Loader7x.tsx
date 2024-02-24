import { FC, HTMLProps } from "react";
import classes from "./Loader7x.module.scss";

interface Loader7xProps extends HTMLProps<HTMLDivElement> {}


/**
 * Loader component for the 7x application.
 * Displays a loading indicator.
 *
 * @param {HTMLProps<HTMLDivElement>} props - Props for the Loader7x component.
 */
const Loader7x: FC<Loader7xProps> = ({ className }) => {
  return <div className={`${classes.loader} ${className}`}></div>;
};

export default Loader7x;
