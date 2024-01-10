import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { TournamentApi } from 'services/TournamentService';
import { IMatch } from '../../../models/IMatch';
import { ClanApi } from 'services/ClanService';
import classes from './TournamentProgress.module.scss';
import { Tooltip } from 'react-tooltip';
import { PlayerApi } from 'services/PlayerService';

interface ITournamentScore {
  [key: number]: {
    team_one_wins: number,
    team_two_wins: number
  }
}

interface IMatches {
  [key: number]: {
    [key: number]: IMatch
  }
}

interface IMapNames {
  [key: number]: string
}

const TournamentProgress: React.FC = () => {
  const [cookies,] = useCookies(['token', 'userId']); 
  const {data: tournaments} = TournamentApi.useFetchTournamentsByManagerQuery(cookies.token);
  const {data: myTeam} = ClanApi.useFetchClanByManagerQuery(cookies.userId);
  const {data: regPlayers} = PlayerApi.useGetRegForSeasonPlayersQuery({token: cookies.token});
  const [tournamentsScores, setTournamentsScores] = useState<ITournamentScore>({});
  const [matches, setMatches] = useState<IMatches>({});
  const [matchesWebSockets, setMatchesWebSockets] = useState<{[key: number]: WebSocket}>({});
  const [mapNames, setMapNames] = useState<IMapNames>({});
  let mapSendTimeout: NodeJS.Timeout;


  useEffect(() => {
    if (tournaments) {
      tournaments.forEach((tournament) => {        
        if (moment(tournament.startTime).isBefore(new Date()) && tournament.isFinished === false) {
          
          
          const scoreWebSocketFunc = () => {
            const scoreWebSocket = new WebSocket(`${import.meta.env.VITE_SERVER_WS_URL}tournament_score/`);
            scoreWebSocket.onopen = () => {
              scoreWebSocket.send(JSON.stringify({
                token: cookies.token,
                action: 'subscribe',
                group: tournament.id
              }));
            }
  
            scoreWebSocket.onmessage = (event) => {
              const message = JSON.parse(event.data);
              console.log(message);
              setTournamentsScores((prev) => {
                return {
                  ...prev,
                  [tournament.id]: message
                }
              });
            }
  
            scoreWebSocket.onclose = () => {
              setTimeout(() => {
                scoreWebSocketFunc();
              }, 2000);
            }
          }

        const matchesWebSocketFunc = () => {
          const matchesWebSocket = new WebSocket(`${import.meta.env.VITE_SERVER_WS_URL}match/`);
            matchesWebSocket.onopen = () => {
              matchesWebSocket.send(JSON.stringify({
                token: cookies.token,
                action: 'subscribe',
                group: tournament.id
              }));
          }

          matchesWebSocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            
            setMatches((prev) => {
              if (message.length > 0) {
                message.forEach((match: IMatch) => {    
                  setMapNames((prev) => {
                    if (match.map !== null) {
                      return {
                        ...prev,
                        [match.id]: match.map
                      }
                    } else {
                      return {
                        ...prev,
                        [match.id]: ''
                      }
                    }
                  })
                                
                  if (!prev[match.tournament]) {
                    prev[match.tournament] = {};
                  }
                  prev[match.tournament][match.id] = match;                  
                })
              } else {
                prev[tournament.id] = {};
              }
              return prev
            });
          }

          matchesWebSocket.onclose = () => {
            setTimeout(() => {
              matchesWebSocketFunc();
            }, 2000);
          }

          setMatchesWebSockets((prev) => {
            return {
              ...prev,
              [tournament.id]: matchesWebSocket
            }
          })
        }
        scoreWebSocketFunc();
        matchesWebSocketFunc();
        }
      })
    }
    
  }, [tournaments])


  return (
    <div>
      {tournaments && tournamentsScores && <div className={classes.tournamentProgress}>
        <h2>Current Tournaments</h2>
      {matches && Object.keys(matches).map((key) => {
        const tournament = tournaments?.find((tournament) => tournament.id === parseInt(key));
        
        return <div className={classes.tournament} key={key}>
          {tournament?.teamInTournament === 1 ? 
            <div className={classes.tournamentHeader}>
              <h2 className={classes.HeaderText}>{myTeam?.team_name}</h2>
              <h2 className={classes.HeaderScore}>{tournamentsScores[parseInt(key)].team_one_wins + ' : ' + tournamentsScores[parseInt(key)].team_two_wins}</h2>
              <h2 className={classes.HeaderText}>{tournament?.opponent.name}</h2>
              <Tooltip  id={key} 
                        border='1px solid red'>
                          <h3>Add a new match</h3>
                        </Tooltip>
              <button data-tooltip-id={key} className={classes.button}
              onClick={() => {
                matchesWebSockets[parseInt(key)].send(JSON.stringify({
                  action: 'create',
                }));
              }}>+</button>
            </div>
          : <div className={classes.tournamentHeader}>
            <h2 className={classes.HeaderText}>{tournament?.opponent.name}</h2>
            <h2 className={classes.HeaderScore}>{tournamentsScores[parseInt(key)].team_one_wins + ' : ' + tournamentsScores[parseInt(key)].team_two_wins}</h2>
            <h2 className={classes.HeaderText}>{myTeam?.team_name}</h2>
            <Tooltip  id={key}
                      border='1px solid red'>
                        <h3>Add a new match</h3>
                      </Tooltip>
            <button data-tooltip-id={key} className={classes.button}
            onClick={() => {
              matchesWebSockets[parseInt(key)].send(JSON.stringify({
                action: 'create',
              }));
            }}>+</button>
          </div>
          }
          <div>
            {Object.keys(matches[parseInt(key)]).map((key2) => {
              return <div className={classes.match} key={key2}>
                <div className={classes.matchLineTop}>
                  <select className={classes.select} value={matches[parseInt(key)][parseInt(key2)].player_one === null 
                          ? '0' : matches[parseInt(key)][parseInt(key2)].player_one}
                          onChange={
                            (event) => {                              
                              matchesWebSockets[parseInt(key)].send(JSON.stringify({
                                action: 'update',
                                updated_field: matches[parseInt(key)][parseInt(key2)].id,
                                updated_column: 'player_one',
                                updated_value: event.target.value
                              }));
                            }
                          }>
                    <option value='0' disabled>Select player</option>
                    {tournament?.teamInTournament === 1 && regPlayers?.map((player) => {
                      return <option key={player.player} value={player.player}>
                        {myTeam?.players.find((teamPlayer) => teamPlayer.id === player.player)?.username}
                        </option>
                    })}
                    {tournament?.teamInTournament === 2 && tournament?.opponent.players.map((player) => {
                      return <option key={player.id} value={player.id}>{player.username}</option>
                    })}
                  </select>
                  <h3 className={classes.vs}>vs</h3>
                  <select className={classes.select} value={matches[parseInt(key)][parseInt(key2)].player_two === null
                        ? '0' : matches[parseInt(key)][parseInt(key2)].player_two}
                        onChange={
                          (event) => {
                            matchesWebSockets[parseInt(key)].send(JSON.stringify({
                              action: 'update',
                              updated_field: matches[parseInt(key)][parseInt(key2)].id,
                              updated_column: 'player_two',
                              updated_value: event.target.value
                            }));
                          }
                        }>
                    <option value='0' disabled>Select player</option>
                    {tournament?.teamInTournament === 2 && regPlayers?.map((player) => {
                      return <option key={player.player} value={player.player}>
                        {myTeam?.players.find((teamPlayer) => teamPlayer.id === player.player)?.username}
                        </option>
                    })}
                    {tournament?.teamInTournament === 1 && tournament?.opponent.players.map((player) => {
                      return <option key={player.id} value={player.id}>{player.username}</option>
                    })}
                  </select>
                  <span className={classes.plug}></span>
                </div>
                <div className={classes.matchLineBottom}>
                  <input  type="text" className={classes.input} placeholder="Map" value={mapNames[parseInt(key2)]}
                          onChange={
                            (event) => {
                              if (mapSendTimeout) {
                                clearTimeout(mapSendTimeout);
                              }
                              setMapNames((prev) => {
                                return {
                                  ...prev,
                                  [key2]: event.target.value
                                }
                              })
                              mapSendTimeout = setTimeout(() => {
                                matchesWebSockets[parseInt(key)].send(JSON.stringify({
                                  action: 'update',
                                  updated_field: matches[parseInt(key)][parseInt(key2)].id,
                                  updated_column: 'map',
                                  updated_value: event.target.value
                                }));
                              }, 1000);
                            }
                          } />
                  <span className={classes.plug1}></span>
                  <select className={classes.select} 
                          value={matches[parseInt(key)][parseInt(key2)].winner === null 
                            ? '0' : matches[parseInt(key)][parseInt(key2)].winner}
                          onChange={
                            (event) => {
                              matchesWebSockets[parseInt(key)].send(JSON.stringify({
                                action: 'update',
                                updated_field: matches[parseInt(key)][parseInt(key2)].id,
                                updated_column: 'winner',
                                updated_value: event.target.value
                              }));
                            }
                          }>
                        <option value="0" disabled>Select winner</option>
                        {tournament?.teamInTournament === 1 && 
                          <option value={matches[parseInt(key)][parseInt(key2)].player_one}>
                            {myTeam?.players.find((teamPlayer) => teamPlayer.id === matches[parseInt(key)][parseInt(key2)].player_one)?.username}
                            </option>}
                        {tournament?.teamInTournament === 1 && <option value={matches[parseInt(key)][parseInt(key2)].player_two}>
                            {tournament?.opponent.players.find((player) => player.id === matches[parseInt(key)][parseInt(key2)].player_two)?.username}
                            </option>
                          }
                        {tournament?.teamInTournament === 2 && <option value={matches[parseInt(key)][parseInt(key2)].player_one}>
                            {tournament?.opponent.players.find((player) => player.id === matches[parseInt(key)][parseInt(key2)].player_one)?.username}
                            </option>}
                        {tournament?.teamInTournament === 2 && <option value={matches[parseInt(key)][parseInt(key2)].player_two}>
                            {myTeam?.players.find((teamPlayer) => teamPlayer.id === matches[parseInt(key)][parseInt(key2)].player_two)?.username}
                            </option>}
                  </select>
                  <span className={classes.plug2}></span>
                </div>
              </div>
            })}
          </div>
        </div>
      })}
      </div>}
    </div>
  )
}

export default TournamentProgress