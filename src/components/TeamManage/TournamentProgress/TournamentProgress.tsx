import moment from 'moment';
import React, { useEffect, useRef } from 'react'
import { useCookies } from 'react-cookie';
import { IMatch } from '../../../models/IMatch';
import { ClanApi } from 'services/ClanService';
import classes from './TournamentProgress.module.scss';
import { Tooltip } from 'react-tooltip';
import { PlayerApi } from 'services/PlayerService';
import { ITournamentApiResponse } from 'models/ITournamentApiResponse';
import Button7x from 'components/UI/Button7x/Button7x';
import Loader7x from 'components/UI/Loader7x/Loader7x';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { FormattedMessage, useIntl } from 'react-intl';
import {  selectMatches,
          setMatches,
          selectMapNames,
          setMapNames,
          selectMatchShowed,
          setMatchShowed,
          selectTournamentsData,
          setTournamentsData,
          selectUnstartedTournaments,
          setUnstartedTournaments,
          deleteUnstartedTournament
          } from 'store/reducers/TournamentsSlice';


const TournamentProgress: React.FC = () => {
  const [cookies,] = useCookies(['token', 'userId']); 
  const {data: myTeam} = ClanApi.useFetchClanByManagerQuery(cookies.userId);
  const {data: regPlayers} = PlayerApi.useGetRegForSeasonPlayersQuery({token: cookies.token});
  const matchesWebSocketsRef = useRef<{[key: number]: WebSocket}>({});
  const tournamentsWebSocketRef = useRef<WebSocket>();
  const matches = useAppSelector(selectMatches);
  const mapNames = useAppSelector(selectMapNames);
  const matchShowed = useAppSelector(selectMatchShowed);
  const tournamentsData = useAppSelector(selectTournamentsData);
  const unstartedTournaments = useAppSelector(selectUnstartedTournaments);
  const dispatch = useAppDispatch();
  let mapSendTimeout: NodeJS.Timeout;
  const intl = useIntl();


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

  const tournamentsWebSocketFunc = () => {
    const tournamentsWebSocket = new WebSocket(`${import.meta.env.VITE_SERVER_WS_URL}tournament_status/`);
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
      dispatch(setTournamentsData(message[0]));
    }

    tournamentsWebSocket.onclose = () => {
      setTimeout(() => {
          if (tournamentsWebSocketRef.current) {
            tournamentsWebSocketFunc();
        }
        }, 2000);
    }
  }

  useEffect(() => {
    if (tournamentsData) {
      tournamentsData.forEach((tournament) => {     
        if (tournament.isFinished === true) {
          dispatch(setMatchShowed({
            tournamentId: tournament.id,
            showed: false
          }))
        }
        else {
          if (unstartedTournaments.indexOf(tournament.id) === -1) dispatch(setUnstartedTournaments(tournament.id))
        }
      })
    }
  }, [tournamentsData])


  useEffect(() => {    
    const interval = setInterval(() => {
      if (tournamentsData) {
        tournamentsData.forEach((tournament) => {
          if (moment(tournament.startTime).isBefore(new Date()) && tournament.isFinished === false && unstartedTournaments.indexOf(tournament.id) !== -1) {
            dispatch(deleteUnstartedTournament(tournament.id));
            matchesWebSocketFunc(tournament);
          }
        })
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [tournamentsData, unstartedTournaments])

  useEffect(() => {
    document.title = intl.formatMessage({id: 'tournamentProgressTitle'})
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


  return (
    <div className={classes.tournamentProgressBlock}>
      {tournamentsData && tournamentsData.findIndex((tournamet) => tournamet.isFinished === false) === -1 && 
        tournamentsData.findIndex((tournament) => tournament.tournamentInGroup === false) === -1 && 
        <h3><FormattedMessage id="groupStageCompleteMessage" /></h3>}
      {tournamentsData && tournamentsData.length > 0 && matches && Object.keys(matches).length > 0 && <div className={classes.tournamentProgress}>
        <h2><FormattedMessage id="currentTournamentsTitle" /></h2>
      {matches && Object.keys(matches).length === 0 && <Loader7x />}
      {matches && Object.keys(matches).map((key) => {
        const tournament = tournamentsData?.find((tournament) => tournament.id === parseInt(key));        
        if (tournament?.isFinished) {
          return null
        }
        return <div className={classes.tournament} key={key}>
          {tournament?.teamInTournament === 1 ? 
            <div className={classes.tournamentHeader}>
              <h2 className={classes.HeaderText}>{myTeam?.team_name}</h2>
              <h2 className={classes.HeaderScore}>{tournament.teamOneWins + ' : ' + tournament.teamTwoWins}</h2>
              <h2 className={classes.HeaderText}>{tournament?.opponent.name}</h2>
              <Tooltip  id={key} 
                        border='1px solid red'>
                          <h3>Add a new match</h3>
                        </Tooltip>
              <button data-tooltip-id={key} className={classes.button}
              onClick={() => {
                matchesWebSocketsRef.current[parseInt(key)].send(JSON.stringify({
                  action: 'create',
                }));
              }}>+</button>
            </div>
          : <div className={classes.tournamentHeader}>
            <h2 className={classes.HeaderText}>{tournament?.opponent.name}</h2>
            <h2 className={classes.HeaderScore}>{tournament?.teamOneWins + ' : ' + tournament?.teamTwoWins}</h2>
            <h2 className={classes.HeaderText}>{myTeam?.team_name}</h2>
            <Tooltip  id={key}
                      border='1px solid red'>
                        <h3><FormattedMessage id='addMatch' /></h3>
                      </Tooltip>
            <button data-tooltip-id={key} className={classes.button}
            onClick={() => {
              matchesWebSocketsRef.current[parseInt(key)].send(JSON.stringify({
                action: 'create',
              }));
            }}>+</button>
          </div>
          }
          <div className={classes.tourBlock}>
            {Object.keys(matches[parseInt(key)]).map((key2) => {
              return <div className={classes.match} key={key2}>
                <div className={classes.matchLineTop}>
                  <select className={classes.select} value={matches[parseInt(key)][parseInt(key2)].player_one === null 
                          ? '0' : matches[parseInt(key)][parseInt(key2)].player_one}
                          onChange={
                            (event) => {                              
                              matchesWebSocketsRef.current[parseInt(key)].send(JSON.stringify({
                                action: 'update',
                                updated_field: matches[parseInt(key)][parseInt(key2)].id,
                                updated_column: 'player_one',
                                updated_value: event.target.value
                              }));
                            }
                          }>
                    <option value='0' disabled><FormattedMessage id='selectPlayerLabel' /></option>
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
                            matchesWebSocketsRef.current[parseInt(key)].send(JSON.stringify({
                              action: 'update',
                              updated_field: matches[parseInt(key)][parseInt(key2)].id,
                              updated_column: 'player_two',
                              updated_value: event.target.value
                            }));
                          }
                        }>
                    <option value='0' disabled><FormattedMessage id='selectPlayerLabel' /></option>
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
                  <input  type="text" className={classes.input} placeholder={intl.formatMessage({id: 'mapLabel'})} value={mapNames[parseInt(key2)]}
                          onChange={
                            (event) => {
                              if (mapSendTimeout) {
                                clearTimeout(mapSendTimeout);
                              }
                              dispatch(setMapNames({
                                matchId: parseInt(key2),
                                mapNames: event.target.value,
                              }))
                              mapSendTimeout = setTimeout(() => {
                                matchesWebSocketsRef.current[parseInt(key)].send(JSON.stringify({
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
                              matchesWebSocketsRef.current[parseInt(key)].send(JSON.stringify({
                                action: 'update',
                                updated_field: matches[parseInt(key)][parseInt(key2)].id,
                                updated_column: 'winner',
                                updated_value: event.target.value
                              }));
                            }
                          }>
                        <option value="0" disabled><FormattedMessage id="selectWinnerLabel" /></option>
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
            <div className={classes.buttonBlock}>
              {tournament?.askForFinished && !tournament?.askedTeam && 
              <h3 className={classes.finishTournamentsMessages}>
                <FormattedMessage id="opponentFinishConfirmationMessage" />
                </h3>}
              {tournament?.askForFinished && tournament?.askedTeam && 
              <h3 className={classes.finishTournamentsMessages}>
                <FormattedMessage id="yourFinishConfirmationMessage" />
                </h3>}
              <Button7x className={classes.button} onClick={() => {
                tournamentsWebSocketRef.current && tournamentsWebSocketRef.current.send(JSON.stringify({
                  action: 'finish',
                  id: tournament?.id
                }))
              }}><FormattedMessage id="finish" /></Button7x>
            </div>
          </div>
        </div>
      })}
    </div>}
      <div className={classes.notRunning}>
        <div className={classes.notRunningBlock}>
          {tournamentsData && tournamentsData.length > 0 && tournamentsData.findIndex((tournament) => tournament.isFinished === true) !== -1 && 
          <h2 className={classes.finishedTournamentsTitle}>
            <FormattedMessage id="finishedTournamentsTitle" /></h2>}
          {tournamentsData && tournamentsData.map((tournament) => {
            if (tournament.isFinished === true) {              
              return (<div className={classes.finishedTournament} key={tournament.id}>
                {tournament.teamInTournament === 1 && <div className={classes.finishedTournamentHeader} style={tournament.matches !== undefined && tournament.matches.length === 0 ? {borderRadius: '20px'} : {} }>
                  <h3 className={`${tournament.winner !== undefined && tournament.winner === myTeam?.team_id
                                    ? classes.winner : classes.participant} ${classes.leftTeam}`}>{myTeam?.team_name}</h3>
                  <h3>
                    {tournament.teamTwoWins !== undefined && (tournament.teamTwoWins !== 0 || tournament.teamOneWins !== 0) ? tournament.teamTwoWins : null}
                    {tournament.teamTwoWins !== undefined && (tournament.teamTwoWins === 0 && tournament.teamOneWins === 0) && tournament.winner && tournament.winner === myTeam?.team_id ? 'TW' : null}
                    {tournament.teamTwoWins !== undefined && (tournament.teamTwoWins === 0 && tournament.teamOneWins === 0) && tournament.winner && tournament.winner === tournament.opponent.id ? 'TL' : null}
                    : 
                    {tournament.teamOneWins !== undefined && (tournament.teamOneWins !== 0 || tournament.teamTwoWins !== 0) ? tournament.teamOneWins : null} 
                    {tournament.teamOneWins !== undefined && (tournament.teamOneWins === 0 && tournament.teamTwoWins === 0) && tournament.winner && tournament.winner === tournament.opponent.id ? 'TW' : null}
                    {tournament.teamOneWins !== undefined && (tournament.teamOneWins === 0 && tournament.teamTwoWins === 0) && tournament.winner && tournament.winner === myTeam?.team_id ? 'TL' : null}
                    </h3>
                  <h3 className={`${tournament.winner !== undefined && tournament.winner === tournament.opponent.id
                                    ? classes.winner : classes.participant}`}>{tournament.opponent.name}</h3>
                  </div>}
                  {tournament.teamInTournament === 2 && <div className={classes.finishedTournamentHeader} style={tournament.matches !== undefined && tournament.matches.length === 0 ? {borderRadius: '20px'} : {} }>
                  <h3 className={`${tournament.winner !== undefined && tournament.winner === tournament.opponent.id
                                    ? classes.winner : classes.participant} ${classes.leftTeam}`}>{tournament.opponent.name}</h3>
                  <h3>
                    {tournament.teamOneWins !== undefined && (tournament.teamOneWins !== 0 || tournament.teamTwoWins !== 0) ? tournament.teamOneWins : null} 
                    {tournament.teamOneWins !== undefined && (tournament.teamOneWins === 0 && tournament.teamTwoWins === 0) && tournament.winner && tournament.winner === tournament.opponent.id ? 'TW' : null}
                    {tournament.teamOneWins !== undefined && (tournament.teamOneWins === 0 && tournament.teamTwoWins === 0) && tournament.winner && tournament.winner === myTeam?.team_id ? 'TL' : null}
                    : 
                    {tournament.teamTwoWins !== undefined && (tournament.teamTwoWins !== 0 || tournament.teamOneWins !== 0) ? tournament.teamTwoWins : null}
                    {tournament.teamTwoWins !== undefined && (tournament.teamTwoWins === 0 && tournament.teamOneWins === 0) && tournament.winner && tournament.winner === myTeam?.team_id ? 'TW' : null}
                    {tournament.teamTwoWins !== undefined && (tournament.teamTwoWins === 0 && tournament.teamOneWins === 0) && tournament.winner && tournament.winner === tournament.opponent.id ? 'TL' : null}
                    </h3>
                  <h3 className={`${tournament.winner !== undefined && tournament.winner === myTeam?.team_id
                                    ? classes.winner : classes.participant}`}>{myTeam?.team_name}</h3>
                  </div>}
                  {tournament.matches && tournament.matches.length > 0 && 
                    <div className={classes.finishedTournamentMatchesContainer}>
                      <button className={`${classes.matchesResults} ${matchShowed[tournament.id] ? classes.show : ''}`}
                              onClick={() => {
                                dispatch(setMatchShowed({
                                  tournamentId: tournament.id,
                                  showed: !matchShowed[tournament.id]
                                }))
                              }}>
                        <h3 className={classes.matchesResultsTitle}><FormattedMessage id="matchResultsTitle" /> </h3><div className={`${classes.arrow} ${matchShowed[tournament.id] ? classes.rotate : ''}`}> 	&gt; </div>
                      </button>
                      <div className={`${classes.finishedTournamentMatches} ${matchShowed[tournament.id] ? '' : classes.hide}`}>
                        {tournament.matches && tournament.matches.map((match) => {
                          return (<div key={match.id} className={`${classes.finishedTournamentMatchContainer} ${matchShowed[tournament.id] ?  '' : classes.hiden}`}>
                            <div className={classes.finishedTournamentMatch}>
                              <h3 className={`${match.winner === match.player_one ? classes.winner : classes.participant} ${classes.player} ${classes.playerOne}`}>
                                {myTeam?.players.find((player) => player.id === match.player_one)?.username 
                                  || 
                                  tournament.opponent.players.find((player) => player.id === match.player_one)?.username}</h3>
                              <h3>VS</h3>
                              <h3 className={`${match.winner === match.player_two ? classes.winner : classes.participant} ${classes.player}`}>
                                {myTeam?.players.find((player) => player.id === match.player_two)?.username 
                                  || 
                                  tournament.opponent.players.find((player) => player.id === match.player_two)?.username} </h3>
                            </div>
                                  <h3 className={classes.map}>{match.map}</h3>
                          </div>)
                        })}
                      </div>
                    </div>
                  }
              </div>)
            } else {
              return null
            }
          })}
        </div>
        <div className={classes.notRunningBlock}>
          {tournamentsData && tournamentsData.length > 0 && 
          tournamentsData.findIndex((tournament) => moment(tournament.startTime) > moment() && tournament.isFinished !== true) !== -1 
          && <h2 className={classes.finishedTournamentsTitle}><FormattedMessage id='upcomingTournamentsTitle' /></h2>}
          {tournamentsData && tournamentsData.map((tournament) => {
            if (moment(tournament.startTime) > moment() && tournament.isFinished !== true) {             
              return (<div className={classes.upcomingTournament} key={tournament.id}>
                <div className={classes.upcomingTournamentHeader}>
                  <h3><FormattedMessage id='opponentLabel' />: {tournament.opponent.name}</h3>
                </div>
                  <h3><FormattedMessage id='startTimeLabel' />: {moment(tournament.startTime).format('DD.MM.YYYY HH:mm')}</h3>
                  <Button7x className={classes.button} onClick={() => {
                    tournamentsWebSocketRef.current && tournamentsWebSocketRef.current.send(JSON.stringify({
                      action: 'start_now',
                      id: tournament?.id
                    }))
                  }}><FormattedMessage id='startEarlyLabel' /></Button7x>
              </div>)}})}
        </div>
      </div>
  </div>
  )
}

export default TournamentProgress