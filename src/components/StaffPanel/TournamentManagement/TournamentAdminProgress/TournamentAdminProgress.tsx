import React, { useEffect, useRef, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import classes from './TournamentAdminProgress.module.scss';
import {
  selectMatches,
  setMatches,
  setMapNames,
  selectTournamentsData,
  setTournamentsData,
  setLocalTimes,
  setMatchEdit
         } from 'store/reducers/TournamentsAdminSlice';
import { IMatch } from 'models/IMatch';
import { ITournamentAdmin } from 'models/ITournamentAdmin';
import moment from 'moment';
import editBlack from 'assets/images/techImages/edit.svg';
import deleteBlack from 'assets/images/techImages/delete.svg';
import GameAProgress from './GameAProgress';
import GridDistribution from '../GridDistribution/GridDistribution';



const TournamentAdminProgress: React.FC = () => {
  const [cookies] = useCookies(['token', 'userId']);
  const matches = useAppSelector(selectMatches);
  const tournamentsData = useAppSelector(selectTournamentsData);
  const dispatch = useAppDispatch();
  const matchesWebSocketsRef = useRef<{[key: number]: WebSocket}>({});
  const tournamentsWebSocketRef = useRef<WebSocket>();
  const [unloadedMatches, setUnloadedMatches] = useState<number[]>([]);
  const [deletedMatches, setDeletedMatches] = useState<number[]>([]);


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
          <li>By clicking on the <img className={classes.editIcon} src={editBlack} alt="edit" draggable="false"/> symbol you will go to the match editing mode and you will be able to change the players and the map name.</li>
          <li>By clicking on the <img className={classes.deleteIcon} src={deleteBlack} alt="delete" draggable="false"/> symbol you will delete the match.</li>
        </ul>
        </div>}
      {tournamentsData.find((tournament) => tournament.group !== null) && <h2>Group Stage</h2>}
      <div className={classes.tournamentsAdminProgress}>
        {tournamentsData.length > 0 && tournamentsData.map((tournament) => {
          if (tournament.group !== null) 
          return <GameAProgress 
            key={tournament.id} 
            tournament={tournament} 
            tournamentsWebSocketRef={tournamentsWebSocketRef} 
            matchesWebSocketsRef={matchesWebSocketsRef} 
            matchesWebSocketFunc={matchesWebSocketFunc}
            deletedMatches={deletedMatches}
            setDeletedMatches={setDeletedMatches} />
        })}
      </div>
      <h2>Grid</h2>
      <GridDistribution
        tournamentsWebSocketRef={tournamentsWebSocketRef} />
      {tournamentsData.find((tournament) => tournament.group === null) && <h2>Play-Off</h2>}
      <div className={classes.tournamentsAdminProgress}>
        {tournamentsData.length > 0 && tournamentsData.map((tournament) => {
          if (tournament.group === null) 
          return <GameAProgress 
            key={tournament.id} 
            tournament={tournament} 
            tournamentsWebSocketRef={tournamentsWebSocketRef} 
            matchesWebSocketsRef={matchesWebSocketsRef} 
            matchesWebSocketFunc={matchesWebSocketFunc}
            deletedMatches={deletedMatches}
            setDeletedMatches={setDeletedMatches} />
        })}
      </div>
    </div>
  )
}

export default TournamentAdminProgress