import { FC, HTMLProps } from "react";
import classes from "./Loader7x.module.scss";

interface Loader7xProps extends HTMLProps<HTMLDivElement> {}

const Loader7x: FC<Loader7xProps> = ({ className }) => {
  return <div className={`${classes.loader} ${className}`}></div>;
};

export default Loader7x;
