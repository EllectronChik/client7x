import { useEffect, useState, FC, useRef } from "react";
import { useCookies } from "react-cookie";
import { GroupApi } from "services/GroupService";
import classes from "./GroupDistribution.module.scss";
import { IClan } from "models/IClan";
import { IGroup } from "models/IGroup";
import { FormattedMessage, FormattedPlural } from "react-intl";
import Button7x from "components/UI/Button7x/Button7x";
import Loader7x from "components/UI/Loader7x/Loader7x";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import {
  setGroups,
  addGroup,
  selectGroups,
  setUndistributedTeams,
  selectUndistributedTeams,
} from "store/reducers/GroupsSlice";
import { setInputValues, setSelectedTeams } from "store/reducers/MatchesSlice";
import {
  selectIsInitialLoad,
  setIsInitialLoadThird,
} from "store/reducers/AccountSlice";
import { SeasonApi } from "services/SeasonService";
import DraggableTeam from "./DraggableTeam";
import GroupZone from "./GroupZone";

/**
 * GroupDistribution component
 *
 * This component handles the distribution of teams into groups for a tournament's group stage.
 * It allows randomizing groups, adding groups, and managing undistributed teams.
 */
const GroupDistribution: FC = () => {
  const [cookies] = useCookies(["token"]);
  const { data: registredTeams, isLoading: registredTeamsLoading } =
    GroupApi.useFetchRegistredTeamsQuery(cookies.token);
  const { data: fetchedGroups, isLoading: fetchedGroupsLoading } =
    GroupApi.useFetchGroupsQuery(cookies.token);
  const { data: currentSeason } = SeasonApi.useFetchCurrentSeasonQuery();
  const [
    randomizeGroups,
    { data: randomizeGroupsData, isLoading: randomizeGroupsLoading },
  ] = GroupApi.useRandmizeGroupsMutation();
  const [groupsCnt, setGroupsCnt] = useState<number>(0);
  const cntInputRef = useRef<HTMLInputElement>(null);
  const groups = useAppSelector(selectGroups);
  const undistributedTeams = useAppSelector(selectUndistributedTeams);
  const isInitialLoad = useAppSelector(selectIsInitialLoad);
  const dispatch = useAppDispatch();

  const getTextWidth = (text: string) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context!.font = window.getComputedStyle(cntInputRef.current!).font;
    const width = context!.measureText(text).width + 30;
    return width;
  };

  useEffect(() => {
    if (fetchedGroups && isInitialLoad[2]) {
      dispatch(setGroups(fetchedGroups));
      dispatch(setIsInitialLoadThird(false));
    }
  }, [fetchedGroups, isInitialLoad]);

  useEffect(() => {
    if (registredTeams) {
      setGroupsCnt(Math.ceil(registredTeams.length / 5));
    }
  }, [registredTeams]);

  useEffect(() => {
    if (groups && registredTeams) {
      const teamsInGroups: number[] = [];
      groups.forEach((group: IGroup) => {
        group.teams.forEach((clan: IClan) => {
          teamsInGroups.push(clan.id || 0);
        });
      });
      dispatch(
        setUndistributedTeams(
          registredTeams.filter((team: IClan) => {
            return !teamsInGroups.includes(team.id || 0);
          })
        )
      );
    }
  }, [groups, registredTeams]);

  useEffect(() => {
    if (randomizeGroupsData) {
      dispatch(setGroups(randomizeGroupsData));
    }
  }, [randomizeGroupsData]);

  useEffect(() => {
    if (groupsCnt && cntInputRef.current) {
      cntInputRef.current.style.width = `${getTextWidth(
        groupsCnt.toString()
      )}px`;
    }
  }, [groupsCnt]);

  return (
    <div className={classes.groupDistribution}>
      <h2>
        <FormattedMessage id="groupStageDistribution" />
      </h2>
      {currentSeason && (
        <div className={classes.randomizeContainer}>
          <div className={classes.randomizeBlock}>
            <h2>
              <FormattedMessage
                id="randomizeMessage"
                values={{
                  count: groupsCnt,
                  groups: (
                    <FormattedPlural
                      value={groupsCnt}
                      one={<FormattedMessage id="groupSingle" />}
                      other={<FormattedMessage id="groupPlural" />}
                    />
                  ),
                }}
              />
            </h2>
            <div>
              <FormattedMessage id="groupsCount" />:
              <input
                ref={cntInputRef}
                className={classes.input}
                type="number"
                value={groupsCnt}
                min={1}
                onChange={(e) => setGroupsCnt(Number(e.target.value))}
              />
            </div>
            <div>
              <Button7x
                className={`${classes.randomizeButton}`}
                onClick={() => {
                  randomizeGroups({
                    token: cookies.token,
                    groupCnt: groupsCnt,
                  });
                  dispatch(setInputValues([]));
                  dispatch(setSelectedTeams([]));
                }}
              >
                <FormattedMessage id="randomizeGroups" />
              </Button7x>
              <Button7x
                className={classes.addGroupButton}
                onClick={() => {
                  dispatch(addGroup());
                }}
              >
                <FormattedMessage id="addGroup" />
              </Button7x>
            </div>
          </div>
          <div className={classes.groupsList}>
            {undistributedTeams.length > 0 && (
              <div className={classes.group}>
                <h3>
                  <FormattedMessage id="undistributedTeams" />
                </h3>
                <div className={classes.groupTeams}>
                  {undistributedTeams.map((team: IClan) => (
                    <DraggableTeam key={team.id} team={team} />
                  ))}
                </div>
              </div>
            )}
            {(registredTeamsLoading ||
              fetchedGroupsLoading ||
              randomizeGroupsLoading) && <Loader7x />}
            {groups &&
              !registredTeamsLoading &&
              !fetchedGroupsLoading &&
              !randomizeGroupsLoading &&
              groups.map((group: IGroup) => (
                <GroupZone key={group.id} group={group} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDistribution;
