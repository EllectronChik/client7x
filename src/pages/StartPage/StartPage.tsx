import { FC, useEffect, useRef } from "react";
import classes from "./StartPage.module.scss";
import { FormattedMessage } from "react-intl";
import { useCookies } from "react-cookie";
import Loader7x from "components/UI/Loader7x/Loader7x";
import SeasonInfo from "components/SeasonInfo/SeasonInfo";
import diamond from "@assets/images/leagueMarks/5.webp";
import master from "@assets/images/leagueMarks/6.webp";
import grandmaster from "@assets/images/leagueMarks/7.webp";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import {
  selectSeasonState,
  selectTours,
  selectSeasonNumber,
  selectGridRow,
  selectPreviusSeasons,
  selectLeaguesCnt,
  setSeasonState,
  setTours,
  setSeasonNumber,
  setGridRow,
  setPreviusSeasons,
  setLeaguesCnt,
} from "store/reducers/StartPageSlice";
import Link7x from "components/UI/Link7x/Link7x";

interface IPrevSeasons {
  [key: string]: {
    tournamentsCount: number;
    winner: string | null;
  };
}

interface ILeagueCnt {
  [key: string]: number;
}

interface IInfo {
  state: number;
  season?: number;
  startedSeason?: IInfoTours;
  previusSeasons: IPrevSeasons;
  playersByLeague: ILeagueCnt;
}

const StartPage: FC = () => {
  const infoWebSocketRef = useRef<WebSocket | null>();
  const [cookies] = useCookies(["userId", "have_account"]);
  const seasonState = useAppSelector(selectSeasonState);
  const tours = useAppSelector(selectTours);
  const seasonNumber = useAppSelector(selectSeasonNumber);
  const gridRow = useAppSelector(selectGridRow);
  const previusSeasons = useAppSelector(selectPreviusSeasons);
  const leaguesCnt = useAppSelector(selectLeaguesCnt);
  const dispatch = useAppDispatch();
  const leagueImgs: { [key: number]: { src: string; alt: string } } = {
    5: {
      src: diamond,
      alt: "diamond",
    },
    6: {
      src: master,
      alt: "master",
    },
    7: {
      src: grandmaster,
      alt: "grandmaster",
    },
  };

  const infoWebSocketFunc = () => {
    const infoWebSocket = new WebSocket(
      `${import.meta.env.VITE_SERVER_WS_URL}information/`
    );
    infoWebSocketRef.current = infoWebSocket;

    infoWebSocket.onmessage = (event) => {
      const message: IInfo = JSON.parse(event.data);
      if (message.state === 9) {
        if (infoWebSocketRef.current) {
          infoWebSocketRef.current.close();
          infoWebSocketRef.current = null;
          infoWebSocketFunc();
        }
      } else if (message.state === 0) {
        dispatch(setSeasonState(0));
        dispatch(setSeasonNumber(0));
        dispatch(setGridRow(0));
        dispatch(setTours({} as IInfoTours));
      } else if (message.state === 1) {
        dispatch(setSeasonState(1));
        dispatch(setGridRow(0));
        dispatch(setTours({} as IInfoTours));
        if (message.season) dispatch(setSeasonNumber(message.season));
      } else if (message.state === 2) {
        dispatch(setSeasonState(2));
        if (message.startedSeason) dispatch(setTours(message.startedSeason));
        if (message.season) dispatch(setSeasonNumber(message.season));
        if (
          message.startedSeason &&
          Object.keys(message.startedSeason.playoff).length > 0
        ) {
          const maxKey = Math.max(
            ...Object.keys(message.startedSeason.playoff[1]).map((key) =>
              parseInt(key)
            )
          );
          dispatch(setGridRow(Math.ceil(Math.log2(maxKey + 1) + 1)));
        }
      }
      if (message.previusSeasons)
        dispatch(setPreviusSeasons(message.previusSeasons));
      if (message.playersByLeague) {
        dispatch(setLeaguesCnt(message.playersByLeague));
      }
    };

    infoWebSocket.onclose = () => {
      setTimeout(() => {
        if (infoWebSocketRef.current) {
          infoWebSocketFunc();
        }
      }, 2000);
    };
  };

  useEffect(() => {
    infoWebSocketFunc();
    document.title = "7x league";

    return () => {
      if (infoWebSocketRef.current) {
        infoWebSocketRef.current.close();
        infoWebSocketRef.current = null;
      }
    };
  }, []);

  return (
    <div className={classes.container}>
      {seasonState === -1 && <Loader7x className={classes.loader} />}
      {seasonState === 0 && (
        <div className={classes.noSeason}>
          <h1>
            <FormattedMessage id="noTournaments" />
          </h1>
        </div>
      )}
      {seasonState === 1 && (
        <div className={classes.seasonReg}>
          <h1>
            <FormattedMessage
              id="registrationOpen"
              values={{ season: seasonNumber }}
            />
          </h1>
          {cookies.userId && (
            <Link to="/account">
              <h3 className={classes.switch}>
                &rarr;
                <FormattedMessage id="switchToParticipate" />
                &larr;
              </h3>
            </Link>
          )}
          {!cookies.userId && cookies.have_account && (
            <Link to="/login">
              <h3 className={classes.switch}>
                &rarr;
                <FormattedMessage id="signinToParticipate" />
                &larr;
              </h3>
            </Link>
          )}
          {!cookies.userId && !cookies.have_account && (
            <Link to="/login">
              <h3 className={classes.switch}>
                &rarr;
                <FormattedMessage id="signupToParticipate" />
                &larr;
              </h3>
            </Link>
          )}
        </div>
      )}
      {seasonState === 2 && (
        <div className={classes.season}>
          <h1>
            <FormattedMessage
              id="seasonIsNowUnderway"
              values={{ num: seasonNumber }}
            />
          </h1>
          <SeasonInfo tours={tours} gridRow={gridRow} />
        </div>
      )}
      <div className={classes.infoBox}>
        {Object.keys(previusSeasons).length > 0 && (
          <div className={classes.prevSeasons}>
            <div className={classes.prevSeasonsContent}>
              <h2>
                <FormattedMessage id="previousSeasons" />
              </h2>
              {Object.keys(previusSeasons).map((key) => (
                <div className={classes.prevSeason} key={key}>
                  <div>
                    <h3>
                      <FormattedMessage
                        id="manageStartedSeason"
                        values={{ season: key }}
                      />
                    </h3>
                    <p>
                      <FormattedMessage id="games" />:{" "}
                      {previusSeasons[key].tournamentsCount}
                    </p>
                  </div>
                  <h3>
                    <FormattedMessage id="winner" />:{" "}
                    {previusSeasons[key].winner
                      ? previusSeasons[key].winner
                      : "None"}
                  </h3>
                </div>
              ))}
            </div>
            <div className={classes.showMoreBox}>
              <h3>
                <Link className={classes.showMore} to="/arhive">
                  &rarr;
                  <FormattedMessage id="showMore" />
                  &larr;
                </Link>
              </h3>
            </div>
          </div>
        )}
        {Object.keys(leaguesCnt).length > 0 && (
          <div className={classes.leaguesCnt}>
            <h2>
              <FormattedMessage id="statistic" />
            </h2>
            <div className={classes.leaguesCntContent}>
              {Object.keys(leaguesCnt).map((key) => (
                <div className={classes.leagueCnt} key={key}>
                  <img
                    src={leagueImgs[Number(key)].src}
                    alt={leagueImgs[Number(key)].alt}
                    className={classes.leagueImg}
                  />
                  <p>
                    <FormattedMessage id="players" />: {leaguesCnt[key]}
                  </p>
                </div>
              ))}
            </div>
            <h3 className={classes.showMoreBox}>
              <Link className={classes.showMore} to="/statistics">
                &rarr;
                <FormattedMessage id="showMore" />
                &larr;
              </Link>
            </h3>
          </div>
        )}
      </div>
      {!cookies.userId && seasonState !== -1 && (
        <div className={classes.participateBox}>
          <h3>
            <FormattedMessage id="registerTeam" />
          </h3>
          <Link7x to="/login">
            <h3>
              <FormattedMessage id="login" />
            </h3>
          </Link7x>
        </div>
      )}
    </div>
  );
};

export default StartPage;
