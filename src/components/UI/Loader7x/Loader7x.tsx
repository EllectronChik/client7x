import React from 'react';
import classes from './Loader7x.module.scss';

interface Loader7xProps extends React.HTMLProps<HTMLDivElement> {}

const Loader7x: React.FC<Loader7xProps> = ({className}) => {
  return (
    <div className={`${classes.loader} ${className}`}></div>
  )
}

export default Loader7x