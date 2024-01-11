import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { TournamentApi } from 'services/TournamentService';
import { IMatch } from '../../../models/IMatch';
import { ClanApi } from 'services/ClanService';
import classes from './TournamentProgress.module.scss';
import { Tooltip } from 'react-tooltip';
import { PlayerApi } from 'services/PlayerService';
import { ITournamentApiResponse } from 'models/ITournamentApiResponse';

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
  const [matchShowed, setMatchShowed] = useState<{[key: number]: boolean}>({});
  const [tournamentsData, setTournamentsData] = useState<ITournamentApiResponse[]>([]);
  const [unstartedTournaments, setUnstartedTournaments] = useState<number[]>([]);
  let mapSendTimeout: NodeJS.Timeout;

  const scoreWebSocketFunc = (tournament: ITournamentApiResponse) => {
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
      setTournamentsScores((prev) => {
        return {
          ...prev,
          [tournament.id]: message
        }
      });
    }

    scoreWebSocket.onclose = () => {
      setTimeout(() => {
        scoreWebSocketFunc(tournament);
      }, 2000);
    }
  }

  const matchesWebSocketFunc = (tournament: ITournamentApiResponse) => {
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
        matchesWebSocketFunc(tournament);
      }, 2000);
    }

    setMatchesWebSockets((prev) => {
      return {
        ...prev,
        [tournament.id]: matchesWebSocket
      }
    })
  }

  useEffect(() => {
    if (tournaments) {
      setTournamentsData(tournaments);
    }
    
  }, [tournaments])

  useEffect(() => {
    if (tournamentsData) {
      console.log(tournamentsData);
      
      tournamentsData.forEach((tournament) => {        
        if (moment(tournament.startTime).isBefore(new Date()) && tournament.isFinished === false) {
        scoreWebSocketFunc(tournament);
        matchesWebSocketFunc(tournament);
        }
        else if (tournament.isFinished === true) {
          setMatchShowed((prev) => {
            return {
              ...prev,
              [tournament.id]: false
            }
          })
        }
        else {
          setUnstartedTournaments((prev) => {
            return [
              ...prev,
              tournament.id
            ]
          })
        }
      })
    }
  }, [tournamentsData])

  useEffect(() => {
    console.log('here');
    
    const interval = setInterval(() => {
      if (tournamentsData) {
        tournamentsData.forEach((tournament) => {          
          if (moment(tournament.startTime).isBefore(new Date()) && tournament.isFinished === false && unstartedTournaments.indexOf(tournament.id) !== -1) {
            
            setUnstartedTournaments((prev) => {
              return prev.filter((id) => id !== tournament.id)
            })
            scoreWebSocketFunc(tournament);
            matchesWebSocketFunc(tournament);
          }
        })
      }
        
    }, 1000)
    return () => clearInterval(interval)
  }, [tournamentsData, unstartedTournaments])


  return (
    <div className={classes.tournamentProgressBlock}>
      {tournamentsData && tournamentsData.findIndex((tournament) => tournament.isFinished === true) !== -1 && <h2 className={classes.finishedTournamentsTitle}>Finished tournaments</h2>}
      {tournamentsData && tournamentsData.map((tournament) => {
        if (tournament.isFinished === true) {
          return (<div className={classes.finishedTournament} key={tournament.id}>
            {tournament.teamInTournament === 1 && <div className={classes.finishedTournamentHeader}>
              <h3 className={`${tournament.team_one_wins 
                                && tournament.team_two_wins 
                                && tournament.team_one_wins > tournament.team_two_wins 
                                ? classes.winner : classes.participant} ${classes.leftTeam}`}>{myTeam?.team_name}</h3>
              <h3>
                {tournament.team_one_wins ? tournament.team_one_wins : 0} 
                : 
                {tournament.team_two_wins ? tournament.team_two_wins : 0}</h3>
              <h3 className={`${tournament.team_one_wins 
                                && tournament.team_two_wins 
                                && tournament.team_one_wins < tournament.team_two_wins 
                                ? classes.winner : classes.participant}`}>{tournament.opponent.name}</h3>
              </div>}
              {tournament.teamInTournament === 2 && <div className={classes.finishedTournamentHeader}>
              <h3>{tournament.opponent.name}</h3>
              <h3>
                {tournament.team_one_wins ? tournament.team_one_wins : 0} 
                : 
                {tournament.team_two_wins ? tournament.team_two_wins : 0}</h3>
              <h3>{myTeam?.team_name}</h3>
              </div>}
              <button className={`${classes.matchesResults} ${matchShowed[tournament.id] ? classes.show : ''}`}
                      onClick={() => {
                        setMatchShowed((prev) => {
                          return {
                            ...prev,
                            [tournament.id]: !prev[tournament.id]
                          }
                        })
                      }}>
                <h3 className={classes.matchesResultsTitle}>Match results </h3><div className={`${classes.arrow} ${matchShowed[tournament.id] ? classes.rotate : ''}`}> 	&gt; </div>
              </button>
              <div className={`${classes.finishedTournamentMatches} ${matchShowed[tournament.id] ? classes.show : ''}`}>
                {tournament.matches && tournament.matches.map((match) => {
                  return (<div key={match.id} className={`${classes.finishedTournamentMatchContainer} ${matchShowed[tournament.id] ?  '' : classes.hiden}`}>
                    <div className={classes.finishedTournamentMatch}>
                      <h3 className={`${match.winner === match.player_one ? classes.winner : classes.participant} ${classes.player} ${classes.playerOne}`}>{myTeam?.players.find((player) => player.id === match.player_one)?.username 
                          || 
                          tournament.opponent.players.find((player) => player.id === match.player_one)?.username}</h3>
                      <h3>VS</h3>
                      <h3 className={`${match.winner === match.player_two ? classes.winner : classes.participant} ${classes.player}`}>{myTeam?.players.find((player) => player.id === match.player_two)?.username 
                          || 
                          tournament.opponent.players.find((player) => player.id === match.player_two)?.username} </h3>
                    </div>
                          <h3 className={classes.map}>{match.map}</h3>
                  </div>)
                })}
              </div>
          </div>)
        } else {
          return null
        }
      })}
      {tournamentsData && tournamentsScores && <div className={classes.tournamentProgress}>
        <h2>Current Tournaments</h2>
      {matches && Object.keys(matches).map((key) => {
        const tournament = tournamentsData?.find((tournament) => tournament.id === parseInt(key));
        
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