import React, { useEffect, useRef } from 'react'
import { useCookies } from 'react-cookie';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import classes from './TournamentAdminProgress.module.scss';
import {
  selectMatches,
  setMatches,
  selectMapNames,
  setMapNames,
  selectTournamentsData,
  setTournamentsData,
  selectLocalTimes,
  setLocalTimes,
  selectMatchEdit,
  setWins,
  setMatchEdit,
  setPlayersInTeams,
  selectPlayersInTeams
         } from 'store/reducers/TournamentsAdminSlice';
import { IMatch } from 'models/IMatch';
import { ITournamentAdmin } from 'models/ITournamentAdmin';
import axios from 'axios';
import moment from 'moment';
import editWhite from 'assets/images/techImages/edit_white.svg';
import editBlack from 'assets/images/techImages/edit.svg';
import deleteBlack from 'assets/images/techImages/delete.svg';
import deleteWhite from 'assets/images/techImages/delete_white.svg';
import { Tooltip } from 'react-tooltip';



const TournamentAdminProgress: React.FC = () => {
  const [cookies] = useCookies(['token', 'userId']);
  const matches = useAppSelector(selectMatches);
  const tournamentsData = useAppSelector(selectTournamentsData);
  const mapNames = useAppSelector(selectMapNames);
  const localTimes = useAppSelector(selectLocalTimes);
  const matchEdit = useAppSelector(selectMatchEdit);
  const playersInTeams = useAppSelector(selectPlayersInTeams);
  const dispatch = useAppDispatch();
  const matchesWebSocketsRef = useRef<{[key: number]: WebSocket}>({});
  const tournamentsWebSocketRef = useRef<WebSocket>();
  const [unloadedMatches, setUnloadedMatches] = React.useState<number[]>([]);
  const [deletedMatches, setDeletedMatches] = React.useState<number[]>([]);
  const [addingMatch, setAddingMatch] = React.useState<number[]>([]);

  const tournamentsWebSocketFunc = () => {
    const tournamentsWebSocket = new WebSocket(`${import.meta.env.VITE_SERVER_WS_URL}tournaments_admin/`);
    tournamentsWebSocketRef.current = tournamentsWebSocket;

    tournamentsWebSocket.onopen = () => {
      tournamentsWebSocket.send(JSON.stringify({
        token: cookies.token,
        action: 'subscribe',
        group: cookies.userId
      }));
    }

    tournamentsWebSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      dispatch(setTournamentsData(message));
    }

    tournamentsWebSocket.onclose = () => {
      setTimeout(() => {
          if (tournamentsWebSocketRef.current) {
            tournamentsWebSocketFunc();
        }
        }, 2000);
    }
  }

  const matchesWebSocketFunc = (tournament: ITournamentAdmin) => {
    const matchesWebSocket = new WebSocket(`${import.meta.env.VITE_SERVER_WS_URL}match/`);
    matchesWebSocketsRef.current[tournament.id] = matchesWebSocket;
      matchesWebSocket.onopen = () => {
        matchesWebSocket.send(JSON.stringify({
          token: cookies.token,
          action: 'subscribe',
          group: tournament.id
        }));
    }

    matchesWebSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
                  
      dispatch(setMatches({
        tournamentId: tournament.id,
        matches: message
      }));
      message.forEach((match: IMatch) => {
        if (match.map !== null) {
          dispatch(setMapNames({
            matchId: match.id,
            mapNames: match.map
          }))
        } else {
          dispatch(setMapNames({
            matchId: match.id,
            mapNames: ''
          }))
        }
      })
    }

    matchesWebSocket.onclose = () => {
      setTimeout(() => {
        if (matchesWebSocketsRef.current[tournament.id]) {          
          matchesWebSocketFunc(tournament);
        }
      }, 2000);
    }

    matchesWebSocketsRef.current[tournament.id] = matchesWebSocket;
  }

  const loadPlayersInTeams = async (teams: number[]) => {
    const players = await axios.get(`${import.meta.env.VITE_API_URL}getPlayersByTeam/?teams=[${teams.join(',')}]`, {
      headers: {
        Authorization: `Token ${cookies.token}`
      }
    });        
    dispatch(setPlayersInTeams(players.data));
  }


  useEffect(() => {
    tournamentsWebSocketFunc();
    return () => {
      if (tournamentsWebSocketRef.current) {
        tournamentsWebSocketRef.current.close();
        tournamentsWebSocketRef.current = undefined;
      }

      if (matchesWebSocketsRef.current) {
        Object.values(matchesWebSocketsRef.current).forEach((webSocket) => {
          webSocket.close();
        })
        matchesWebSocketsRef.current = {};
      }
    }
  }, [])

  useEffect(() => {
    if (tournamentsData.length > 0) {
      tournamentsData.forEach((tournament) => {        
        dispatch(setWins({
          teamId: tournament.teamOne,
          wins: 0
        }));
        dispatch(setWins({
          teamId: tournament.teamTwo,
          wins: 0
        }));
        dispatch(setLocalTimes({
          tournamentId: tournament.id,
          localTime: moment(tournament.startTime).format('YYYY-MM-DD HH:mm:ss')
        }));
        if (!matchesWebSocketsRef.current[tournament.id]) {
          setUnloadedMatches((prev) => {
            if (prev.includes(tournament.id)) {
              return prev;
            }
            return [...prev, tournament.id];
          });
        }
      })
      
    }
  }, [tournamentsData])

  useEffect(() => {
    console.log(matchesWebSocketsRef.current);
    
  }, [matchesWebSocketsRef.current])

  useEffect(() => {
    if (unloadedMatches.length > 0) {
      const teams: number[] = []
      tournamentsData.forEach((tournament) => {
        if (unloadedMatches.includes(tournament.id) && tournament.matchesExists) {
          if (!teams.includes(tournament.teamOne)) {
            teams.push(tournament.teamOne);
          }
          if (!teams.includes(tournament.teamTwo)) {
            teams.push(tournament.teamTwo);
          }
          matchesWebSocketFunc(tournament);
          setUnloadedMatches((prev) => {
            return prev.filter((id) => id !== tournament.id)
          })
        }
      })
      if (teams.length > 0 && Object.keys(playersInTeams).length === 0) loadPlayersInTeams(teams);
    }
  }, [unloadedMatches])

  useEffect(() => {
    if (Object.keys(matches).length > 0) {
      Object.values(matches).forEach((tourMatches: IMatch[]) => {
        Object.keys(tourMatches).forEach((match) => {
          if (tourMatches[parseInt(match)].player_one === null || tourMatches[parseInt(match)].player_two === null) {
            dispatch(setMatchEdit({
              matchId: tourMatches[parseInt(match)].id,
              edit: true
            }))
          }
        })
      })
    }    
  }, [matches])


  return (
    <div className={classes.tournamentsAdminProgressContainer}>
      {tournamentsData.length > 0 && <div className={classes.tournamentsAdminProgressInfo}>
      <h3> Admin panel features:
          </h3>
        <ul className={classes.tournamentsAdminProgressInfoList}>
          <li>By clicking on a team name, you will set the "Completed" status for the tournament and give the specified team a winner status.</li>
          <li>By clicking on a player's name you will give him the status of the winner of the match.</li>
          <li>By clicking on the "Completed" checkbox you will end the game and also give the winner status to the team with the most points. <br /> If the score is zero, the winner must be selected manually. </li>
          <li>By clicking on the <img className={classes.editIcon} src={editBlack} alt="edit" /> symbol you will go to the match editing mode and you will be able to change the players and the map name.</li>
          <li>By clicking on the <img className={classes.deleteIcon} src={deleteBlack} alt="delete" /> symbol you will delete the match.</li>
        </ul>
        </div>}
      <div className={classes.tournamentsAdminProgress}>
        {tournamentsData.length > 0 && tournamentsData.map((tournament) => {
          return <div className={classes.tournament} key={tournament.id}>
            <div className={classes.tournamentInfo}>
              <h3 className={`${tournament.winner === tournament.teamOne ? classes.winner : ''} ${classes.team}`}
                  onClick={() => {
                    if (tournament.winner !== tournament.teamOne && tournamentsWebSocketRef.current) {
                      tournamentsWebSocketRef.current.send(JSON.stringify({
                        action: 'update',
                        tournament_id: tournament.id,
                        field: 'winner',
                        value: tournament.teamOne
                      }))
                    }
                  }}>{tournament.teamOneName}</h3>
              <h3>{tournament.teamOneWins}</h3>
              <h3>:</h3>
              <h3>{tournament.teamTwoWins}</h3>
              <h3 className={`${tournament.winner === tournament.teamTwo ? classes.winner : ''} ${classes.team}`}
                  onClick={() => {
                    if (tournament.winner !== tournament.teamTwo && tournamentsWebSocketRef.current) {
                      tournamentsWebSocketRef.current.send(JSON.stringify({
                        action: 'update',
                        tournament_id: tournament.id,
                        field: 'winner',
                        value: tournament.teamTwo
                      }))
                    }
                  }}>{tournament.teamTwoName}</h3>
            </div>
            <div className={classes.techInputContainer}>
              {localTimes[tournament.id] && <input className={classes.dateInput} type="datetime-local" value={localTimes[tournament.id]} onChange={(event) => {
                dispatch(setLocalTimes({
                  tournamentId: tournament.id,
                  localTime: event.target.value
                }))
                if (tournamentsWebSocketRef.current) {
                  tournamentsWebSocketRef.current.send(JSON.stringify({
                    action: 'update',
                    tournament_id: tournament.id,
                    field: 'match_start_time',
                    value: new Date(event.target.value).toISOString()
                  }))
                }
              }}/>}
              <Tooltip  id='addMatch'
                        border='1px solid red'><h3>Add Match</h3></Tooltip>
                <button data-tooltip-id='addMatch' className={classes.addMatch} onClick={() => {
                  if (!matchesWebSocketsRef.current[tournament.id]) {
                    matchesWebSocketFunc(tournament);
                    setTimeout(() => {
                      matchesWebSocketsRef.current[tournament.id].send(JSON.stringify({
                        action: 'create'
                      }))
                    }, 1000);
                  } else {
                    matchesWebSocketsRef.current[tournament.id].send(JSON.stringify({
                      action: 'create'
                    }))
                  }
                }}>
                  +
                </button>
            </div>
            {matches[tournament.id] && Object.keys(playersInTeams).length > 0 && Object.values(matches[tournament.id]).map((match: IMatch) => {
              return <div key={match.id}>
                {!matchEdit[match.id] && <div className={classes.matchContainer}>
                    <div className={classes.match}>
                    <h3 className={`${classes.player} ${classes.playerOne} ${match.winner === match.player_one ? classes.winner : ''}`}
                        onClick={() => {
                          if (match.winner !== match.player_one) {
                            matchesWebSocketsRef.current[tournament.id].send(JSON.stringify({
                              action: 'update',
                              updated_field: match.id,
                              updated_column: 'winner',
                              updated_value: match.player_one
                            }));
                          }
                        }}>
                      {playersInTeams[tournament.teamOne] && playersInTeams[tournament.teamOne][match.player_one]}
                      </h3>
                    <h3>VS</h3>
                    <h3 className={`${classes.player} ${match.winner === match.player_two ? classes.winner : ''}`}
                        onClick={() => {
                          if (match.winner !== match.player_two) {
                            matchesWebSocketsRef.current[tournament.id].send(JSON.stringify({
                              action: 'update',
                              updated_field: match.id,
                              updated_column: 'winner',
                              updated_value: match.player_two
                            }));
                          }
                        }}>
                      {playersInTeams[tournament.teamTwo] && playersInTeams[tournament.teamTwo][match.player_two]}
                    </h3>
                  </div>
                  <div className={classes.matchInfo}>
                      <h3 className={classes.map}>{match.map !== null ? (match.map !== '' ? match.map : 'Map unspecified') : 'Map unspecified'}</h3>
                      <button className={classes.editButton} 
                              onClick={() => {
                                dispatch(setMatchEdit({
                                  matchId: match.id,
                                  edit: true
                                }))
                              }
                      }>
                        <img className={classes.edit} src={editWhite} alt="edit" />
                      </button>
                      {!deletedMatches.includes(match.id) && <button className={classes.deleteButton} onClick={() => {
                        setDeletedMatches([...deletedMatches, match.id]);
                        console.log(deletedMatches);
                        matchesWebSocketsRef.current[tournament.id].send(JSON.stringify({
                          action: 'delete',
                          match_pk: match.id
                        }));
                      }}>
                        <img className={classes.delete} src={deleteWhite} alt="delete" />
                      </button>}
                      {deletedMatches.includes(match.id) && <span className={classes.loader}></span>}
                  </div>
                </div>}
                {matchEdit[match.id] && <div className={classes.matchContainer}>
                  <div className={classes.match}>
                    <select className={classes.select} value={match.player_one !== null ? match.player_one : 0} onChange={(event) => {
                      matchesWebSocketsRef.current[tournament.id].send(JSON.stringify({
                        action: 'update',
                        updated_field: match.id,
                        updated_column: 'player_one',
                        updated_value: event.target.value
                      }))
                    }}>
                      <option className={classes.option} value="0" disabled>Select player</option>
                      {playersInTeams[tournament.teamOne] && Object.keys(playersInTeams[tournament.teamOne]).map((playerId) => {
                        return <option className={classes.option} key={playerId} value={playerId}>{playersInTeams[tournament.teamOne][parseInt(playerId)]}</option>
                      })}
                    </select>
                    <h3>VS</h3>
                    <select className={classes.select} value={match.player_two !== null ? match.player_two : 0} onChange={(event) => {
                      matchesWebSocketsRef.current[tournament.id].send(JSON.stringify({
                        action: 'update',
                        updated_field: match.id,
                        updated_column: 'player_two',
                        updated_value: event.target.value
                      }));
                    }}>
                      <option className={classes.option} value="0" disabled>Select player</option>
                      {playersInTeams[tournament.teamTwo] && Object.keys(playersInTeams[tournament.teamTwo]).map((playerId) => {
                        return <option className={classes.option} key={playerId} value={playerId}>{playersInTeams[tournament.teamTwo][parseInt(playerId)]}</option>
                      })}
                    </select>
                  </div>
                  <div className={classes.matchInfo}>
                    <input placeholder='MAP' className={classes.mapNames} type="text" value={mapNames[match.id]} onChange={(event) => {
                      dispatch(setMapNames({
                        matchId: match.id,
                        mapNames: event.target.value
                      }))
                      matchesWebSocketsRef.current[tournament.id].send(JSON.stringify({
                        action: 'update',
                        updated_field: match.id,
                        updated_column: 'map',
                        updated_value: event.target.value
                      }));
                    }} />
                    <button className={classes.editButton} 
                            onClick={() => {
                              dispatch(setMatchEdit({
                                matchId: match.id,
                                edit: false
                              }))
                            }
                      }>
                        <img className={classes.edit} src={editWhite} alt="edit" />
                      </button>
                      {!deletedMatches.includes(match.id) && <button className={classes.deleteButton} onClick={() => {
                        setDeletedMatches([...deletedMatches, match.id]);
                        console.log(deletedMatches);
                        matchesWebSocketsRef.current[tournament.id].send(JSON.stringify({
                          action: 'delete',
                          match_pk: match.id
                        }));
                      }}>
                        <img className={classes.delete} src={deleteWhite} alt="delete" />
                      </button>}
                      {deletedMatches.includes(match.id) && <span className={classes.loader}></span>}
                  </div>
                </div>}
              </div>
            })}
            <div className={classes.isFinished}>
              <label htmlFor={`isFinished_${tournament.id}`} className={classes.isFinishedLabel}>Completed</label>
              <input id={`isFinished_${tournament.id}`} type="checkbox" checked={tournament.isFinished} onChange={() => {
                tournamentsWebSocketRef.current?.send(JSON.stringify({
                  action: "update",
                  tournament_id: tournament.id,
                  field: "is_finished",
                  value: !tournament.isFinished
                }))
              }}/>
            </div>
          </div>
        })}
        
      </div>
    </div>
  )
}

export default TournamentAdminProgress