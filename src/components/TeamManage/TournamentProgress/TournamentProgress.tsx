import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { TournamentApi } from 'services/TournamentService';
import { IMatch } from '../../../models/IMatch';

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

const TournamentProgress: React.FC = () => {
  const [cookies,] = useCookies(['token']); 
  const {data: tournaments} = TournamentApi.useFetchTournamentsByManagerQuery(cookies.token);
  const [tournamentsScores, setTournamentsScores] = useState<ITournamentScore>({});
  const [matches, setMatches] = useState<IMatches>({});
  const [matchesWebSockets, setMatchesWebSockets] = useState<{[key: number]: WebSocket}>({});


  useEffect(() => {
    if (tournaments) {
      tournaments.forEach((tournament) => {        
        if (moment(tournament.startTime).isBefore(new Date()) && tournament.isFinished === false) {
          const scoreWebSocket = new WebSocket(`${import.meta.env.VITE_SERVER_WS_URL}tournament_score/`);
          const matchesWebSocket = new WebSocket(`${import.meta.env.VITE_SERVER_WS_URL}match/`);
          setMatchesWebSockets((prev) => {
            return {
              ...prev,
              [tournament.id]: matchesWebSocket
            }
          })
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
          

          matchesWebSocket.onopen = () => {
            matchesWebSocket.send(JSON.stringify({
              token: cookies.token,
              action: 'subscribe',
              group: tournament.id
            }));

            matchesWebSocket.onmessage = (event) => {
              const message = JSON.parse(event.data);
              
              setMatches((prev) => {
                message.forEach((match: IMatch) => {
                  if (!prev[match.tournament]) {
                    prev[match.tournament] = {};
                  }
                  prev[match.tournament][match.id] = match;                  
                })
                return prev
              });
            }
          }
        }
      })
    }
    
  }, [tournaments])

  // useEffect(() => {
  //   console.log(tournamentsScores);
    
  // }, [tournamentsScores])

  useEffect(() => {
    console.log(matches);
  }, [matches])


  return (
    <div>
      {matches && Object.keys(matches).map((key) => {
        return <div key={key}>
          {Object.keys(matches[parseInt(key)]).map((key2) => {
            return <div key={key2}>
              {matches[parseInt(key)][parseInt(key2)].player_one + ' vs ' + matches[parseInt(key)][parseInt(key2)].player_two}
            </div>
          })}
        </div>
      })}
    </div>
  )
}

export default TournamentProgress