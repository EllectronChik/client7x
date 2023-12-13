import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { GroupApi } from 'services/GroupService'
import classes from './GroupDistribution.module.scss'
import { IClan } from 'models/IClan';
import { IGroup } from 'models/IGroup';
import { FormattedMessage, FormattedPlural } from 'react-intl';
import Button7x from 'components/UI/Button7x/Button7x';
import Loader7x from 'components/UI/Loader7x/Loader7x';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { setGroups, addGroup, updateGroupTeams, selectGroups, setUndistributedTeams, selectUndistributedTeams } from 'store/reducers/GroupsSlice';
import { selectIsInitialLoad, setIsInitialLoadThird } from 'store/reducers/AccountSlice';

const GroupDistribution: React.FC = () => {
  const [cookies] = useCookies(['token']);
  const {data: registredTeams, isLoading: registredTeamsLoading} = GroupApi.useFetchRegistredTeamsQuery(cookies.token);
  const {data: fetchedGroups, isLoading: fetchedGroupsLoading} = GroupApi.useFetchGroupsQuery(cookies.token);
  const [ postTeamToGroup ] = GroupApi.usePostTeamToGroupMutation();
  const [ randomizeGroups, {data: randomizeGroupsData, isLoading: randomizeGroupsLoading} ] = GroupApi.useRandmizeGroupsMutation();
  const [ draggedTeam, setDraggedTeam ] = useState<IClan | null>(null);
  const [ groupsCnt, setGroupsCnt ] = useState<number>(0);
  const cntInputRef = React.useRef<HTMLInputElement>(null);
  const groups = useAppSelector(selectGroups);
  const undistributedTeams = useAppSelector(selectUndistributedTeams);
  const isInitialLoad = useAppSelector(selectIsInitialLoad);
  const dispatch = useAppDispatch();

  const getTextWidth = (text: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context!.font = window.getComputedStyle(cntInputRef.current!).font;
    const width = context!.measureText(text).width + 30;
    return width;
}

  useEffect(() => {
    if(fetchedGroups && isInitialLoad[2]) {      
      dispatch(setGroups(fetchedGroups));
      dispatch(setIsInitialLoadThird(false));
    }
  }, [fetchedGroups, isInitialLoad])


  useEffect(() => {
    if (registredTeams) {
      setGroupsCnt(Math.ceil(registredTeams.length / 5));
    }
  }, [registredTeams])

  useEffect(() => {
    if (groups && registredTeams) {
      const teamsInGroups: number[] = [];
      groups.forEach((group: IGroup) => {
        group.teams.forEach((clan: IClan) => {
          teamsInGroups.push(clan.id || 0);
        })
      })
      dispatch(setUndistributedTeams(registredTeams.filter((team: IClan) => {
        return !teamsInGroups.includes(team.id || 0)
      })))
    }
  }, [groups, registredTeams])

  useEffect(() => {
    if (randomizeGroupsData) {
      dispatch(setGroups(randomizeGroupsData));
    }
  }, [randomizeGroupsData])

  useEffect(() => {
    if (groupsCnt && cntInputRef.current) {
      cntInputRef.current.style.width = `${getTextWidth(groupsCnt.toString())}px`;
      
    }
  }, [groupsCnt])


  return (
    <div className={classes.groupDistribution}>
      <h2><FormattedMessage id='groupStageDistribution' /></h2>
      <div className={classes.randomizeBlock}>
        <h2>
          <FormattedMessage id='randomizeMessage' values={{count: groupsCnt, groups: <FormattedPlural value={groupsCnt} one={<FormattedMessage id='groupSingle' />} other={<FormattedMessage id='groupPlural' />} />}} />
        </h2>
        <div>
          <FormattedMessage id='groupsCount' />:
          <input ref={cntInputRef} className={classes.input} type="number" value={groupsCnt} min={1} onChange={(e) => setGroupsCnt(Number(e.target.value))} />
        </div>
      <Button7x className={`${classes.randomizeButton}`} onClick={() => {
        randomizeGroups({token: cookies.token, groupCnt: groupsCnt});
        }}><FormattedMessage id='randomizeGroups' /></Button7x>
      </div>
      <div className={classes.groupsList}>
        {undistributedTeams.length > 0 && <div className={classes.group}>
          <h3><FormattedMessage id='undistributedTeams' /></h3>
          {undistributedTeams.map((team: IClan) => {
            return <div className={classes.team} 
                        draggable={true}
                        onDragStart={() => {
                          setDraggedTeam(team);
                        }}
                        onDragEnd={() => {
                          setDraggedTeam(null);
                        }}
            key={team.id}>
              <img draggable={false} className={classes.teamLogo} src={`${import.meta.env.VITE_SERVER_URL}/${team.logo}`} alt="" />
              <div>
                <h3 className={classes.teamName}>{team.name}</h3>
                <h4 className={classes.teamTag}>&lt;{team.tag}&gt;</h4>
              </div>
            </div>
          })}
        </div>}
        {registredTeamsLoading && <Loader7x />}
        {fetchedGroupsLoading && <Loader7x />}
        {randomizeGroupsLoading && <Loader7x />}
          {groups && !registredTeamsLoading && !fetchedGroupsLoading && !randomizeGroupsLoading && groups.map((group: IGroup) => {
            return <div className={classes.group} key={group.id}
                        onDragOver={(e) => {
                          e.preventDefault();
                        }}
                        onDrop={() => {
                            if (draggedTeam) {
                              dispatch(updateGroupTeams({groupId: group.id || 0, team: draggedTeam}));
                              postTeamToGroup({
                                token: cookies.token,
                                groupStageMark: group.groupMark,
                                teamId: draggedTeam.id || 0
                              })
                            }
                        }}>
              <h3><FormattedMessage id='group' /> {group.groupMark}</h3>
              <div className={classes.groupTeams}>
                {group.teams.map((team: IClan) => {
                  return <div className={classes.team}
                              draggable={true}
                              onDragStart={() => {
                                setDraggedTeam(team);
                              }}
                              onDragEnd={() => {
                                setDraggedTeam(null);
                              }}
                          key={team.id}>
                    <img draggable={false} className={classes.teamLogo} src={`${import.meta.env.VITE_SERVER_URL}/${team.logo}`} alt="" />
                    <div>
                      <h3 className={classes.teamName}>{team.name}</h3>
                      <h4 className={classes.teamTag}>&lt;{team.tag}&gt;</h4>
                    </div>
                  </div>
                })}
              </div>
            </div>
          })}
        </div>
        <Button7x className={`${classes.button} ${classes.addGroupButton}`} onClick={() => {
          dispatch(addGroup());
        }}><FormattedMessage id='addGroup' /></Button7x>
      </div>
  )
}

export default GroupDistribution