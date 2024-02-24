import { FC, HTMLProps } from "react";
import classes from "./GroupDistribution.module.scss";
import { IClan } from "models/IClan";
import { useDrag } from "react-dnd";

interface IProps extends HTMLProps<HTMLDivElement> {
  team: IClan;
}

/**
 * DraggableTeam component
 * 
 * This component represents a draggable team element. It displays the team's logo, name, and tag.
 * 
 * @param props - HTMLProps props for the div element representing the draggable team
 * @param props.team - The team data containing information such as name, logo, and tag
 */
const DraggableTeam: FC<IProps> = ({ ...props }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: "team",
    item: {
      team: props.team,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return (
    <div
      className={`${classes.team} ${isDragging ? classes.dragging : ""}`}
      ref={dragRef}
    >
      <img
        draggable={false}
        className={classes.teamLogo}
        src={`${import.meta.env.VITE_SERVER_URL}${props.team.logo}`}
        alt=""
      />
      <div className={classes.teamInfo}>
        <h3 className={classes.teamName}>{props.team.name}</h3>
        <h4 className={classes.teamTag}>&lt;{props.team.tag}&gt;</h4>
      </div>
    </div>
  );
};

export default DraggableTeam;
