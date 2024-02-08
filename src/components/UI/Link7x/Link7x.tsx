import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import classes from "./Link7x.module.scss";

interface Button7xProps {
  to: string;
  children?: ReactNode;
}

const Link7x: FC<Button7xProps> = ({ to, children }) => {
  return (
    <Link to={to}>
      <div className={`${classes.button} ${classes.v8}`}>
        <span className={classes.label}>{children}</span>
        <span className={classes.icon}>
          <span></span>
        </span>
      </div>
    </Link>
  );
};

export default Link7x;
