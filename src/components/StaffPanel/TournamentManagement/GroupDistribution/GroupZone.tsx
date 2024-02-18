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
