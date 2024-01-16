import React, { useEffect, useRef } from 'react'
import { useCookies } from 'react-cookie';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import classes from './TournamentAdminProgress.module.scss';
import {
  selectMatches,
  setMatches,
  selectMapNames,
  setMapNames,
  selectMatchShowed,
  setMatchShowed,
  selectTournamentsData,
  setTournamentsData
         } from 'store/reducers/TournamentsAdminSlice';
import { ITournamentApiResponse } from 'models/ITournamentApiResponse';
import { IMatch } from 'models/IMatch';
import { ITournamentAdmin } from 'models/ITournamentAdmin';

const TournamentAdminProgress: React.FC = () => {
  const [cookies] = useCookies(['token', 'userId']);
  const matches = useAppSelector(selectMatches);
  const mapNames = useAppSelector(selectMapNames);
  const matchShowed = useAppSelector(selectMatchShowed);
  const tournamentsData = useAppSelector(selectTournamentsData);
  const dispatch = useAppDispatch();
  const matchesWebSocketsRef = useRef<{[key: number]: WebSocket}>({});
  const tournamentsWebSocketRef = useRef<WebSocket>();
  const [unloadedMatches, setUnloadedMatches] = React.useState<number[]>([]);

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
          console.log('ERROR' + tournament.id);
          
          matchesWebSocketFunc(tournament);
        }
      }, 2000);
    }

    matchesWebSocketsRef.current[tournament.id] = matchesWebSocket;
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
        setUnloadedMatches((prev) => {
          return [...prev, tournament.id];
        });
      })
    }
  }, [tournamentsData])

  useEffect(() => {
    if (unloadedMatches.length > 0) {
      tournamentsData.forEach((tournament) => {
        if (unloadedMatches.includes(tournament.id) && tournament.matchesExists) {
          matchesWebSocketFunc(tournament);
          setUnloadedMatches((prev) => {
            return prev.filter((id) => id !== tournament.id)
          })
        }
      })
    }
  }, [unloadedMatches])

  return (
    <div className={classes.tournamentsAdminProgress}>
      {tournamentsData.length > 0 && tournamentsData.map((tournament) => (
        <div className={classes.tournament} key={tournament.id}>
          <h2>{tournament.id}</h2>
          <div className={classes.tournamentInfo}>
            <h3>{tournament.teamOne}</h3>
            <h3>{tournament.teamOneWins}</h3>
            <h3>:</h3>
            <h3>{tournament.teamTwoWins}</h3>
            <h3>{tournament.teamTwo}</h3>
          </div>
          <p>{tournament.startTime}</p>
          <p>{tournament.matchesExists}</p>
          {matches[tournament.id] && Object.values(matches[tournament.id]).map((match: IMatch) => {
            return <div key={match.id}>
              <h3>{match.id}</h3>
              <h3>{match.player_one}</h3>
              <h3>{match.player_two}</h3>
            </div>
          })}
        </div>
      ))}
    </div>
  )
}

export default TournamentAdminProgress