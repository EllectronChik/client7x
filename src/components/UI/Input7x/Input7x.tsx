import React from 'react'
import classes from './Input7x.module.scss'

interface Input7xProps extends React.HTMLProps<HTMLInputElement> {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input7x: React.FC<Input7xProps> = ({...props}) => {
  const inputClassName = props.className ? `${props.className} ${classes.input}` : classes.input
  return (
    <input {...props} className={inputClassName} />
  )
}

export default Input7x