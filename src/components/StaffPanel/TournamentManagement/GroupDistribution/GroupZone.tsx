import { FC, HTMLProps } from "react";
import classes from "./GroupDistribution.module.scss";
import { IGroup } from "models/IGroup";
import { FormattedMessage } from "react-intl";
import { IClan } from "models/IClan";
import DraggableTeam from "./DraggableTeam";
import { useDrop } from "react-dnd";
import { useAppDispatch } from "hooks/reduxHooks";
import { updateGroupTeams } from "store/reducers/GroupsSlice";
import { GroupApi } from "services/GroupService";
import { useCookies } from "react-cookie";

interface IProps extends HTMLProps<HTMLDivElement> {
  group: IGroup;
}

/**
 * GroupZone Component
 * 
 * This component represents a group zone where teams can be dropped into. It displays a group header
 * with a group mark and lists the teams within the group. Teams can be dragged and dropped into this 
 * zone.
 * 
 * @param props - HTMLProps props for the div element representing the group zone
 * @param props.group - The group object containing information about the group
 */
const GroupZone: FC<IProps> = ({ ...props }) => {
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(["token"]);
  const [postTeamToGroup] = GroupApi.usePostTeamToGroupMutation();
  const [{}, dropRef] = useDrop({
    accept: "team",
    drop: (item: { team: IClan }) => {
      if (item.team) {
        dispatch(
          updateGroupTeams({
            groupId: props.group.id || 0,
            team: item.team,
          })
        );
        postTeamToGroup({
          token: cookies.token,
          groupStageMark: props.group.groupMark,
          teamId: item.team.id || 0,
        });
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });
  return (
    <div className={classes.group} key={props.group.id} ref={dropRef}>
      <h3>
        <FormattedMessage id="group" /> {props.group.groupMark}
      </h3>
      <div className={classes.groupTeams}>
        {props.group.teams.map((team: IClan) => (
          <DraggableTeam key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
};

export default GroupZone;
