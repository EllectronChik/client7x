import { FC, useEffect, useRef, useState } from 'react';
import classes from './StartPage.module.scss';
import { FormattedMessage } from 'react-intl';
import { useCookies } from 'react-cookie';
import Loader7x from 'components/UI/Loader7x/Loader7x';

interface ITours {
  groups: {
    [key: string]: {
      [key: string]: number
    }
  },
  playoff: {
    [key: number]: {
      [key: number]: {
        teamOne: string,
        teamTwo: string,
        teamOneWins: number,
        teamTwoWins: number,
        winner: string | null
      }
    }
  },
}

interface IInfo {
  state: number,
  season?: number
  startedSeason?: ITours
}

const StartPage: FC = () => {
  const infoWebSocketRef = useRef<WebSocket | null>();
  const [seasonState, setSeasonState] = useState<number>(-1);
  const [cookies, ] = useCookies(['userId', 'have_account']);
  const [tours, setTours] = useState<ITours>({} as ITours);
  const [seasonNumber, setSeasonNumber] = useState<number>(0);
  const [gridRow, setGridRow] = useState<number>(0);

  const infoWebSocketFunc = () => {
    const infoWebSocket = new WebSocket(`${import.meta.env.VITE_SERVER_WS_URL}information/`);
    infoWebSocketRef.current = infoWebSocket;

    infoWebSocket.onmessage = (event) => {
      const message: IInfo = JSON.parse(event.data);
      console.log(message);
      if (message.state === 9) {
        if (infoWebSocketRef.current) {
          infoWebSocketRef.current.close();
          infoWebSocketRef.current = null;
          infoWebSocketFunc();
        }
      } else if (message.state === 0) {
        setSeasonState(0);
      } else if (message.state === 1) {
        setSeasonState(1);
        setSeasonNumber(message.season ? message.season : 0);
      } else if (message.state === 2) {
        setSeasonState(2);
        setTours(message.startedSeason ? message.startedSeason : {} as ITours);
        setSeasonNumber(message.season ? message.season : 0);
        if (message.startedSeason && Object.keys(message.startedSeason.playoff).length > 0) {
          const maxKey = Math.max(...Object.keys(message.startedSeason.playoff[1]).map((key) => parseInt(key)));
          setGridRow(Math.ceil(Math.log2(maxKey + 1) + 1));
        }
      }
      
    }

    infoWebSocket.onclose = () => {
      setTimeout(() => {
        if (infoWebSocketRef.current) {
          infoWebSocketFunc();
        }
        }, 2000);
    }
  }

  useEffect(() => {
    infoWebSocketFunc();

    return () => {
      if (infoWebSocketRef.current) {
        infoWebSocketRef.current.close();
        infoWebSocketRef.current = null;
      }
    }
  }, [])


  return (
    <div className={classes.container}>
      {seasonState === -1 && <Loader7x/>}
      {seasonState === 0 && <h1>Турнир еще не начался</h1>}
      {seasonState === 1 && <h1>Турнир {seasonNumber} начался, регистрация открыта</h1>}
      {seasonState === 2 && <div className={classes.season}>
        <h1>Season {seasonNumber} is now underway</h1>
        <div className={classes.seasonContent}>
          <div className={classes.groups}>
            {tours.groups && Object.keys(tours.groups).map((key) => 
            <div className={classes.group} key={key}>
              <div className={classes.groupName}>
                <h3>
                  <FormattedMessage id="group"/> 
                </h3>
                <h3>
                  {key}
                </h3>
              </div>
              <table className={classes.table}>
                <thead>
                  <tr>
                    <th className={classes.team}>
                      <h3>
                        <FormattedMessage id="team" />
                      </h3>
                    </th>
                    <th className={classes.wins}>
                      <h3>
                        <FormattedMessage id="wins" />
                      </h3>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(Object.keys(tours.groups[key])).map((key2) => (
                  <tr key={key2}>
                    <th className={classes.team}>
                      <h4>
                        {key2}
                      </h4>
                    </th>
                    <th className={classes.wins}>
                      <h4>
                        {tours.groups[key][key2]}
                      </h4>
                    </th>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>)}
          </div>
          <div className={classes.gridBox}>
            <h3 className={classes.playOffLabel}><FormattedMessage id="playoff" />:</h3>
            <div className={classes.grid}>
              {Array.from(Array(gridRow).keys()).map((row) => (
                <div key={row} className={classes.row}>
                  {Array.from(Array(2 ** (row)).keys()).map((col) => (
                    <div key={col} style={{width: `${(200 * 2 ** (gridRow - 1)) / Array(2 ** (row)).length + 20 * (gridRow - row - 1)}px`}} className={classes.col}>
                      {row === 0 && <h3 className={classes.team}><FormattedMessage id="final" /></h3>}
                      {tours.playoff && tours.playoff[gridRow - row] && tours.playoff[gridRow - row][col] && 
                        <div className={classes.teamBox}>
                          <h3 className={`${classes.team} ${tours.playoff[gridRow - row][col].winner === tours.playoff[gridRow - row][col].teamOne ? classes.winner : ''}`}>
                            {tours.playoff[gridRow - row][col].teamOne}
                          </h3>
                          <h3 className={`${classes.score} ${tours.playoff[gridRow - row][col].winner === tours.playoff[gridRow - row][col].teamOne ? classes.winner : ''}`}>
                            {tours.playoff[gridRow - row][col].teamOneWins}
                          </h3>
                        </div>}
                      {tours.playoff && tours.playoff[gridRow - row] && tours.playoff[gridRow - row][col] && 
                        <div className={classes.teamBox}>
                          <h3 className={`${classes.team} ${tours.playoff[gridRow - row][col].winner === tours.playoff[gridRow - row][col].teamTwo ? classes.winner : ''}`}>
                            {tours.playoff[gridRow - row][col].teamTwo}
                          </h3>
                          <h3 className={`${classes.score} ${tours.playoff[gridRow - row][col].winner === tours.playoff[gridRow - row][col].teamTwo ? classes.winner : ''}`}>
                            {tours.playoff[gridRow - row][col].teamTwoWins}
                          </h3>
                        </div>}
                      {(!tours.playoff[gridRow - row] || !tours.playoff[gridRow - row][col]) && <div>
                        {tours.playoff[gridRow - row - 1] && 
                            tours.playoff[gridRow - row - 1][col * 2] && tours.playoff[gridRow - row - 1][col * 2]?.winner !== null ?
                            <div className={classes.teamBox}>
                              <h3 className={classes.team}>
                                {tours.playoff[gridRow - row - 1][col * 2]?.winner}
                              </h3>
                              <h3 className={classes.score}>
                                0
                              </h3>
                            </div> 
                          : <div className={classes.teamBox}>
                              <h3 className={classes.team}>
                              </h3>
                              <h3 className={classes.score}>
                                0
                              </h3>
                            </div>}
                            {tours.playoff[gridRow - row - 1] &&
                            tours.playoff[gridRow - row - 1][col * 2 + 1] && tours.playoff[gridRow - row - 1][col * 2 + 1]?.winner !== null ? 
                            <div className={classes.teamBox}>
                              <h3 className={classes.team}>
                                {tours.playoff[gridRow - row - 1][col * 2 + 1]?.winner}
                              </h3>
                              <h3 className={classes.score}>
                                0
                              </h3>
                            </div>
                            : <div className={classes.teamBox}>
                                <h3 className={classes.team}>
                                </h3>
                                <h3 className={classes.score}>
                                  0
                                </h3>
                              </div>}
                      </div>}
                      {row + 1 !== gridRow && <div>
                        <div className={classes.line_1}>
                          <div className={classes.col_1} style={{width: `${100 * 2 ** (gridRow - row - 2) + 20}px`}}></div>
                          <div className={classes.col_2} style={{width: `${100 * 2 ** (gridRow - row - 2) + 20}px`}}></div>
                        </div>
                        <div className={classes.line_2} style={{width: `${200 * 2 ** (gridRow - row - 2) + 40}px`}}></div>
                      </div>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div></div>
          </div>
        </div>
        </div>}
        {!cookies.userId &&
        <div>
          Register your team and participate in the upcoming tournaments!
        </div>}
    </div>
  )
}

export default StartPage