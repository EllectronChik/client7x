import { IGroup } from 'models/IGroup';
import { FC, useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie';
import { GroupApi } from 'services/GroupService';
import classes from './GridDistribution.module.scss';
import { IClan } from 'models/IClan';
import {  selectTournamentsData } from 'store/reducers/TournamentsAdminSlice';
import { useAppSelector } from 'hooks/reduxHooks';


interface IWins {
  [key: number]: {
    [key: number]: number
  }
}

interface ITeamDict {
  [key: number]: IClan,
  
}

interface IProps {
  tournamentsWebSocketRef: React.MutableRefObject<WebSocket | undefined>
}

interface ILevelsTournaments {
  [key: number]: {
    teamOne: number,
    teamTwo: number,
    winner: number,
    id: number | null
  }[]
}

const GridDistribution: FC<IProps> = ({tournamentsWebSocketRef}) => {
  const [cookies] = useCookies(['token', 'userId']);
  const {data: groups} = GroupApi.useFetchGroupsQuery(cookies.token);
  const [wins, setWins] = useState<IWins>({});
  const [teamDict, setTeamDict] = useState<ITeamDict>({});
  const [sortedGroups, setSortedGroups] = useState<IGroup[]>([]);
  const [gridRow, setGridRow] = useState<number>(0);
  const [maxGridRow, setMaxGridRow] = useState<number>(0);
  const [minGridRow, setMinGridRow] = useState<number>(1);
  const [lvlsTournaments, setLvlsTournaments] = useState<ILevelsTournaments>({});
  const groupsWebSocketRef = useRef<WebSocket>();
  const tournamentsData = useAppSelector(selectTournamentsData);

  const groupsWebSocketFunc = () => {
    const groupsWebSocket = new WebSocket(`${import.meta.env.VITE_SERVER_WS_URL}groups/`);
    groupsWebSocketRef.current = groupsWebSocket;

    groupsWebSocket.onopen = () => {
      groupsWebSocket.send(JSON.stringify({
        token: cookies.token,
        action: 'subscribe',
        group: cookies.userId
      }));
    }

    groupsWebSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setWins(message);
    }

    groupsWebSocket.onclose = () => {
      setTimeout(() => {
          if (groupsWebSocketRef.current) {
            groupsWebSocketFunc();
        }
        }, 2000);
    }
  }

  const handleSelectFirstTeam = (event: React.ChangeEvent<HTMLSelectElement>, col: number) => {
    const selectedTeam = Number(event.target.value);
    setLvlsTournaments((prev) => {
      const allStageTournaments = prev[1] || [];
      allStageTournaments[col] = {
        teamOne: selectedTeam,
        teamTwo: allStageTournaments[col] ? allStageTournaments[col].teamTwo : 0,
        winner: -1,
        id: allStageTournaments[col] && allStageTournaments[col].id ? allStageTournaments[col].id : null
      }
      if (allStageTournaments[col].teamTwo !== 0 && allStageTournaments[col].id === null) {
        tournamentsWebSocketRef.current?.send(JSON.stringify({
          action: "create_tournament",
          match_start_time: "2024-01-29T00:00:00Z",
          team_one: selectedTeam,
          team_two: allStageTournaments[col].teamTwo,
          stage: 1
        }))
      } else if (allStageTournaments[col].teamTwo !== 0) {
        tournamentsWebSocketRef.current?.send(JSON.stringify({
          action: "update",
          tournament_id: allStageTournaments[col].id,
          field: 'team_one',
          value: selectedTeam
        }))
      }
      
      return {
        ...prev,
        [1]: allStageTournaments
      }
    })
  }

  const handleSelectSecondTeam = (event: React.ChangeEvent<HTMLSelectElement>, col: number) => {
    const selectedTeam = Number(event.target.value);
    setLvlsTournaments((prev) => {      
      const allStageTournaments = prev[1] || [];
      allStageTournaments[col] = {
        teamOne: allStageTournaments[col] ? allStageTournaments[col].teamOne : 0,
        teamTwo: selectedTeam,
        winner: -1,
        id: allStageTournaments[col] && allStageTournaments[col].id ? allStageTournaments[col].id : null
      }

      if (allStageTournaments[col].teamOne !== 0 && allStageTournaments[col].id === null) {
        tournamentsWebSocketRef.current?.send(JSON.stringify({
          action: "create_tournament",
          match_start_time: "2024-01-29T00:00:00Z",
          team_one: allStageTournaments[col].teamOne,
          team_two: selectedTeam,
          stage: 1
        }))
      } else if (allStageTournaments[col].teamOne !== 0) {
        tournamentsWebSocketRef.current?.send(JSON.stringify({
          action: "update",
          tournament_id: allStageTournaments[col].id,
          field: "team_two",
          value: selectedTeam
        }))
      }

      return {
        ...prev,
        [1]: allStageTournaments
      }
    })
  }

  useEffect(() => {
    if (tournamentsData) {
      const locLvllsTournaments: ILevelsTournaments = {};
      tournamentsData.filter((tournament) => tournament.group === null).forEach((tournament) => {

        locLvllsTournaments[tournament.stage ? tournament.stage : 0] = locLvllsTournaments[tournament.stage ? tournament.stage : 0] || [];
        locLvllsTournaments[tournament.stage ? tournament.stage : 0].push({
          teamOne: tournament.teamOne,
          teamTwo: tournament.teamTwo,
          winner: tournament.winner ? tournament.winner : -1,
          id: tournament.id
        })
        setLvlsTournaments(locLvllsTournaments);
        
      })
    }
  }, [tournamentsData])

  useEffect(() => {
    if (lvlsTournaments) {      
      setMinGridRow(lvlsTournaments[1] ? lvlsTournaments[1].length : 1);
      
    }
  }, [lvlsTournaments])

  useEffect(() => {
    groupsWebSocketFunc();

    return () => {
      if (groupsWebSocketRef.current) {
        groupsWebSocketRef.current.close();
        groupsWebSocketRef.current = undefined;
      }
    }
  }, [])

  useEffect(() => {
    if (groups && Object.keys(wins).length > 0) {
      const sortedGroupsData = groups.map((group) => {
        const sortedTeams = group.teams.slice().sort((a, b) => {
          const winA = wins[group.id ? group.id : 0] && wins[group.id ? group.id : 0][a.id ? a.id : 0];
          const winB = wins[group.id ? group.id : 0] && wins[group.id ? group.id : 0][b.id ? b.id : 0];
          return winB - winA
        })
        return {
          ...group,
          teams: sortedTeams
        }
      })

      const teams: ITeamDict = {};
      sortedGroupsData.forEach((group) => {
        group.teams.forEach((team) => {
          teams[team.id ? team.id : 0] = team;
        })
      })
      setTeamDict(teams);
      setSortedGroups(sortedGroupsData);
      setMaxGridRow(Math.ceil(Math.log2(Object.keys(teams).length)));
    }
  }, [groups, wins])

  useEffect(() => {
    if (maxGridRow > 0) {
      setGridRow(Math.ceil(maxGridRow / 2));
    }
  }, [maxGridRow])


  return (
    <div className={classes.container}> 
      <div className={classes.groups}>
        {sortedGroups && sortedGroups.map((group) => (
          <div className={classes.group} key={group.id}>
            <h3>
              Group 
              {group.groupMark}
            </h3>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th className={classes.team}>
                    <h3>
                      Team
                    </h3>
                  </th>
                  <th className={classes.wins}>
                    <h3>
                      Wins
                    </h3>
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.teams.map((team) => (
                <tr key={team.id}>
                  <th className={classes.team}>
                    <h4>
                      {team.name}
                    </h4>
                  </th>
                  <th className={classes.wins}>
                    <h4>
                      {wins[group.id ? group.id : 0] && wins[group.id ? group.id : 0][team.id ? team.id : 0]}
                    </h4>
                  </th>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <div className={classes.grid}>
        <input  type="range" min={1} max={maxGridRow} value={gridRow} 
                onChange={(e) => {
                  if (Number(e.target.value) >= minGridRow) {
                    setGridRow(Number(e.target.value));
                  }
                }} />
        {Array.from(Array(gridRow).keys()).map((row) => (
          <div className={classes.row} key={row}>
            {Array.from(Array(2 ** (row)).keys()).map((col) => (
              <div key={col}>
                {row + 1 == gridRow && <div className={classes.col}>
                  <select 
                    value={lvlsTournaments[1] && lvlsTournaments[1][col] ? lvlsTournaments[1][col].teamOne : 0}
                    onChange={(e) => handleSelectFirstTeam(e, col)}>
                    <option value="0" disabled>Select player</option>
                    {teamDict && Object.values(teamDict).map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  <select 
                    value={lvlsTournaments[1] && lvlsTournaments[1][col] ? lvlsTournaments[1][col].teamTwo : 0}
                    onChange={(e) => handleSelectSecondTeam(e, col)}>
                    <option value="0" disabled>Select player</option>
                    {teamDict && Object.values(teamDict).map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
                }
                {row + 1 != gridRow && lvlsTournaments[gridRow - row] === undefined && <div className={classes.col}>
                  <p>{teamDict && 
                      lvlsTournaments && 
                      lvlsTournaments[gridRow - row - 1] && 
                      lvlsTournaments[gridRow - row - 1][Math.floor(col * 2)] && 
                      teamDict[lvlsTournaments[gridRow - row - 1][Math.floor(col * 2)]?.winner]?.name}</p>
                  {teamDict &&
                    !(lvlsTournaments && 
                      lvlsTournaments[gridRow - row - 1] && 
                      lvlsTournaments[gridRow - row - 1][Math.floor(col * 2)]?.winner !== -1) &&
                      <p>Waiting...</p>
                  }
                  <p>{teamDict &&
                      lvlsTournaments &&
                      lvlsTournaments[gridRow - row - 1] &&
                      lvlsTournaments[gridRow - row - 1][Math.floor(col * 2)] &&
                      teamDict[lvlsTournaments[gridRow - row - 1][Math.floor(col * 2) + 1]?.winner]?.name}</p>
                  {teamDict &&
                    !(lvlsTournaments && 
                      lvlsTournaments[gridRow - row - 1] && 
                      lvlsTournaments[gridRow - row - 1][Math.floor(col * 2) + 1]?.winner &&
                      lvlsTournaments[gridRow - row - 1][Math.floor(col * 2) + 1]?.winner !== -1) &&
                      <p>Waiting...</p>}
                  </div>}
                {row + 1 != gridRow && lvlsTournaments[gridRow - row] !== undefined && <div className={classes.col}>
                  <div>{lvlsTournaments[gridRow - row][col] ? <p>{teamDict[lvlsTournaments[gridRow - row][col].teamOne].name}</p> : 0}</div>
                  <div>{lvlsTournaments[gridRow - row][col] ? <p>{teamDict[lvlsTournaments[gridRow - row][col].teamTwo].name}</p> : 0}</div>
                  </div>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GridDistribution