import Button7x from "components/UI/Button7x/Button7x";
import moment from "moment";
import { useEffect, useState, HTMLProps, FC } from "react";
import { useCookies } from "react-cookie";
import { FormattedMessage, useIntl } from "react-intl";
import { ClanApi } from "services/ClanService";
import classes from "./Participate.module.scss";
import {
  selectIsInitialLoad,
  selectInitLoadSum,
  selectTeamRegistred,
  selectCanRegister,
  selectGlobalTime,
  setCanRegister,
  setTeamRegistred,
  setInitLoadSum,
  setIsInitialLoadSecond,
  setGlobalTime,
  addRegPlayer,
  setRegPlayers,
  selectRegPlayers,
  removeRegPlayer,
} from "store/reducers/AccountSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import Timer from "components/Timer/Timer";
import { SeasonApi } from "services/SeasonService";
import { PlayerApi } from "services/PlayerService";
import { TournamentApi } from "services/TournamentService";
import TournamentCard from "./TournamentCard/TournamentCard";
import InClanPlayerBox from "components/InClanPlayerBox/InClanPlayerBox";

const Participate: FC<HTMLProps<HTMLDivElement>> = ({ ...props }) => {
  const intl = useIntl();
  const [cookies] = useCookies(["token", "userId", "locale"]);
  const canRegister = useAppSelector(selectCanRegister);
  const [parsedDate, setParsedDate] = useState<String | null>(null);
  const [parsedTime, setParsedTime] = useState<String | null>(null);
  const [participate, {}] = ClanApi.useParticipateInSeasonMutation();
  const dispatch = useAppDispatch();
  const regPlayers = useAppSelector(selectRegPlayers);
  const initLoadSum = useAppSelector(selectInitLoadSum);
  const isInitialLoad = useAppSelector(selectIsInitialLoad);
  const teamRegistred = useAppSelector(selectTeamRegistred);
  const globalTime = useAppSelector(selectGlobalTime);
  const { data: currentTournament } = SeasonApi.useFetchCurrentSeasonQuery();
  const { data: myTeam } = ClanApi.useFetchClanByManagerQuery(cookies.userId);
  const [deletePlayerFromSeason, {}] =
    PlayerApi.useDeletePlayerFromSeasonMutation();
  const { data: playerToSeason } = PlayerApi.useGetRegForSeasonPlayersQuery({
    token: cookies.token,
  });
  const { data: tournamets } = TournamentApi.useFetchTournamentsByManagerQuery(
    cookies.token
  );

  const handleChangeDateFormat = () => {
    if (currentTournament) {
      if (currentTournament.start_datetime) {
        if (!cookies.locale) {
          if (
            navigator.language.indexOf("ru") !== -1 ||
            navigator.language.indexOf("uk") !== -1
          ) {
            setParsedDate(
              moment(currentTournament.start_datetime).format("DD.MM.YYYY")
            );
            setParsedTime(
              moment(currentTournament.start_datetime).format("HH:mm")
            );
          } else {
            setParsedDate(
              moment(currentTournament.start_datetime).locale("en").format("LL")
            );
            setParsedTime(
              moment(currentTournament.start_datetime).locale("en").format("LT")
            );
          }
        } else {
          if (
            cookies.locale.indexOf("ru") !== -1 ||
            cookies.locale.indexOf("uk") !== -1
          ) {
            setParsedDate(
              moment(currentTournament.start_datetime).format("DD.MM.YYYY")
            );
            setParsedTime(
              moment(currentTournament.start_datetime).format("HH:mm")
            );
          } else {
            setParsedDate(
              moment(currentTournament.start_datetime).locale("en").format("LL")
            );
            setParsedTime(
              moment(currentTournament.start_datetime).locale("en").format("LT")
            );
          }
        }
      }
    }
  };

  useEffect(() => {
    handleChangeDateFormat();
  }, [intl]);

  useEffect(() => {
    if (playerToSeason) {
      dispatch(setRegPlayers([]));
      myTeam?.players.filter(
        (player) =>
          playerToSeason.findIndex((p) => p.player === player.id) !== -1 &&
          dispatch(addRegPlayer(player))
      );
    }
  }, [playerToSeason]);

  useEffect(() => {
    if (currentTournament && isInitialLoad[1] === true) {
      if (currentTournament.can_register) {
        dispatch(setCanRegister(currentTournament.can_register));
      }
      if (currentTournament.start_datetime) {
        dispatch(setGlobalTime(currentTournament.start_datetime));
      }
      dispatch(setInitLoadSum(initLoadSum + 1));
    }
    handleChangeDateFormat();
  }, [currentTournament, isInitialLoad]);

  useEffect(() => {
    if (myTeam && isInitialLoad[1] === true) {
      if (myTeam.isRegToCurrentSeason !== undefined) {
        dispatch(setTeamRegistred(myTeam.isRegToCurrentSeason));
        dispatch(setInitLoadSum(initLoadSum + 1));
      }
    }
  }, [myTeam, isInitialLoad]);

  useEffect(() => {
    if (initLoadSum === 2) {
      dispatch(setIsInitialLoadSecond(false));
    }
  }, [initLoadSum]);

  return (
    <div className={props.className}>
      {currentTournament &&
        myTeam &&
        canRegister &&
        teamRegistred === false && (
          <div className={classes.teamManage}>
            <h2>
              <FormattedMessage
                id="tournamentStartMessage"
                values={{
                  number: currentTournament.number,
                  date: parsedDate,
                  time: parsedTime,
                }}
              />
            </h2>
            <Button7x
              className={classes.button}
              onClick={() => {
                if (currentTournament && myTeam) {
                  participate({
                    token: cookies.token,
                    user: cookies.userId,
                    season: currentTournament.number,
                    team: myTeam.teamId,
                  });
                  dispatch(setTeamRegistred(true));
                }
              }}
            >
              <FormattedMessage id="participate" />
            </Button7x>
          </div>
        )}
      {currentTournament && myTeam && teamRegistred === true && (
        <div>
          {globalTime && tournamets && tournamets.length === 0 && (
            <div className={classes.timerBlock}>
              <div className={classes.timer}>
                <FormattedMessage
                  id="tourStartMessage"
                  values={{
                    time: <Timer datetime={globalTime} />,
                    season: currentTournament.number,
                  }}
                />
              </div>
            </div>
          )}
          {tournamets && tournamets.length > 0 && (
            <div className={classes.nextMatches}>
              {tournamets.map((tournament, index) => {
                if (tournament.isFinished === false) {
                  return (
                    <div className={classes.tournamentCard} key={index}>
                      <TournamentCard tournament={tournament} />
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          )}
          {teamRegistred && (
            <div className={classes.dropZone}>
              {regPlayers.length === 0 && (
                <h3 className={classes.dropZoneText}>
                  <FormattedMessage id="clickOnPlayerToTournament" />
                </h3>
              )}
              {regPlayers.length > 0 && (
                <h3 className={classes.dropZoneText}>
                  <FormattedMessage id="clickOnPlayerToRemove" />
                </h3>
              )}
              {regPlayers &&
                regPlayers.map((player, index) => {
                  return (
                    <InClanPlayerBox
                      className={classes.inClanPlayerBox}
                      player={player}
                      key={index}
                      onClick={() => {
                        if (player) {
                          dispatch(removeRegPlayer(player.id));
                          deletePlayerFromSeason({
                            player_id: player.id,
                            token: cookies.token,
                          });
                        }
                      }}
                    />
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Participate;
