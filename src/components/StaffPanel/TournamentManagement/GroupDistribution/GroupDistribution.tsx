import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { GroupApi } from 'services/GroupService'
import classes from './GroupDistribution.module.scss'
import { IClan } from 'models/IClan';


const GroupDistribution: React.FC = () => {
  const [cookies] = useCookies(['token']);
  const {data: registredTeams} = GroupApi.useFetchRegistredTeamsQuery(cookies.token);
  const {data: groups} = GroupApi.useFetchGroupsQuery(cookies.token);
  const [ undistributedTeams, setUndistributedTeams ] = useState<IClan[]>([]);
  const [ groupsTeams, setGroupsTeams ] = useState<IClan[]>([]);

  useEffect(() => {
    if (registredTeams && groups) { 
      console.log('registredTeams', registredTeams);
      console.log('groups', groups);      
      registredTeams.forEach(team => {
        groups.forEach(group => {
          group.teams.forEach(teamGroup => {
            if (teamGroup.id === team.id) {
              setGroupsTeams([...groupsTeams, teamGroup]);
            } else {
              setUndistributedTeams([...undistributedTeams, teamGroup]);
            }
          })
        })
      })
    }
  }, [groups, registredTeams])

  useEffect(() => {
    console.log('undistributedTeams', undistributedTeams);
  }, [undistributedTeams])

  useEffect(() => {
    console.log('groupsTeams', groupsTeams);
  }, [groupsTeams])

  return (
    <div>
      <div className={classes.undistributedTeams}>
        <p>NOT GROUPS</p>
      </div>
    </div>
  )
}

export default GroupDistribution