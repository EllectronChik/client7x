import Button7x from "components/UI/Button7x/Button7x";
import moment from "moment";
import React, { useEffect, useState } from "react";
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
} from "store/reducers/AccountSlice";
import {
  setDroppedPlayer,
  selectDroppedPlayer,
  selectDragPlayer,
  setDraggable,
  deleteDroppedPlayer,
} from "store/reducers/DragPlayerSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import Timer from "components/Timer/Timer";
import { SeasonApi } from "services/SeasonService";
import playerDefault from "@assets/images/player/default.svg";
import { PlayerApi } from "services/PlayerService";
import { IPlayer } from "models/IPlayer";
import { TournamentApi } from "services/TournamentService";
import TournamentCard from "./TournamentCard/TournamentCard";

const Participate: React.FC<React.HTMLProps<HTMLDivElement>> = ({
  ...props
}) => {
  const intl = useIntl();
  const [cookies] = useCookies(["token", "userId", "locale"]);
  const canRegister = useAppSelector(selectCanRegister);
  const [parsedDate, setParsedDate] = useState<String | null>(null);
  const [parsedTime, setParsedTime] = useState<String | null>(null);
  const [dragZoneText, setDragZoneText] = useState<React.JSX.Element>();
  const [dragZonePlayers, setDragZonePlayers] = useState<React.JSX.Element[]>(
    []
  );
  const [deletePlayer, setDeletePlayer] = useState<number>(-1);
  const [participate, {}] = ClanApi.useParticipateInSeasonMutation();
  const dispatch = useAppDispatch();
  const initLoadSum = useAppSelector(selectInitLoadSum);
  const isInitialLoad = useAppSelector(selectIsInitialLoad);
  const teamRegistred = useAppSelector(selectTeamRegistred);
  const dragPlayer = useAppSelector(selectDragPlayer);
  const droppedPlayer = useAppSelector(selectDroppedPlayer);
  const globalTime = useAppSelector(selectGlobalTime);
  const { data: currentTournament } = SeasonApi.useFetchCurrentSeasonQuery();
  const { data: myTeam } = ClanApi.useFetchClanByManagerQuery(cookies.userId);
  const [setPlayerToSeason, {}] = PlayerApi.usePostPlayerToSeasonMutation();
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
            navigator.language === "ru" ||
            navigator.language === "uk" ||
            navigator.language === "ru-UA" ||
            navigator.language === "ru-RU" ||
            navigator.language === "uk-UA"
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
          if (cookies.locale === "ru" || cookies.locale === "uk") {
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
    if (dragZonePlayers.length > 0) {
      setDragZoneText(
        <FormattedMessage id="onDragPlayerNotEmpty" values={{ br: <br /> }} />
      );
    } else {
      setDragZoneText(<FormattedMessage id="dropZoneMessage" />);
    }
  }, [dragZonePlayers]);

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
      if (myTeam.is_reg_to_current_season !== undefined) {
        dispatch(setTeamRegistred(myTeam.is_reg_to_current_season));
        dispatch(setInitLoadSum(initLoadSum + 1));
      }
    }
  }, [myTeam, isInitialLoad]);

  useEffect(() => {
    if (initLoadSum === 2) {
      dispatch(setIsInitialLoadSecond(false));
    }
  }, [initLoadSum]);

  useEffect(() => {
    if (droppedPlayer) {
      setDragZonePlayers(() => {
        const newDragZonePlayers: React.JSX.Element[] = [];
        droppedPlayer.map((player) => {
          if (player) {
            const index = dragZonePlayers.findIndex(
              (item) => item.key === String(player.id)
            );
            if (index !== -1) {
              return;
            }
            newDragZonePlayers.push(
              <div
                draggable={false}
                onDragOver={() => {
                  setDragZoneText(<FormattedMessage id="onDragPlayerOver" />);
                }}
                onClick={() => {
                  deletePlayerFromSeason({
                    player_id: player.id,
                    token: cookies.token,
                  });
                  setDeletePlayer(player.id);
                  dispatch(setDraggable([player.id, true]));
                  dispatch(deleteDroppedPlayer(player.id));
                }}
                className={`${classes.playerInfo} alreadyRegistered`}
                key={player.id}
              >
                <div className={classes.playerInfoBox}>
                  <div className={classes.infoImages}>
                    <div>{player.league}</div>
                    <div>{player.race}</div>
                  </div>
                  <img
                    draggable={false}
                    src={playerDefault}
                    alt={player.username}
                    className={classes.playerLogo}
                    onLoad={(e) => {
                      if (!e.currentTarget.classList.contains("error")) {
                        player.avatar
                          ? (e.currentTarget.src = player.avatar)
                          : (e.currentTarget.src = playerDefault);
                      }
                    }}
                    onError={(e) => {
                      if (!e.currentTarget.classList.contains("error")) {
                        e.currentTarget.classList.add("error");
                        e.currentTarget.src = playerDefault;
                      }
                    }}
                  />
                  <div>
                    <h2 className={classes.playerName}>{player.username}</h2>
                    <h3 className={classes.playerMMR}>MMR: {player.mmr}</h3>
                  </div>
                </div>
                <div className={classes.playerStats}>
                  <div className={classes.playerStat}>
                    <h4>
                      <FormattedMessage id="totalGames" />:{" "}
                    </h4>
                    <h4 className={classes.playerWins}>{player.total_games}</h4>
                  </div>
                  <div className={classes.playerStat}>
                    <h4>
                      <FormattedMessage id="wins" />:{" "}
                    </h4>
                    <h4 className={classes.playerWins}>{player.wins}</h4>
                  </div>
                </div>
              </div>
            );
          }
        });
        newDragZonePlayers.push(...dragZonePlayers);
        return newDragZonePlayers;
      });
    }
  }, [droppedPlayer]);

  useEffect(() => {
    if (playerToSeason && myTeam) {
      const newPlayers: IPlayer[] = [];
      playerToSeason.map((player) => {
        const newPlayer = myTeam.players.find((p) => p.id === player.player);
        if (newPlayer) {
          if (droppedPlayer.some((player) => player?.id === newPlayer.id)) {
            return;
          }
          newPlayers.push(newPlayer);
        }
      });
      dispatch(setDroppedPlayer(newPlayers));
    }
  }, [playerToSeason, myTeam]);

  useEffect(() => {
    if (deletePlayer !== -1) {
      setDragZonePlayers((oldDragZonePlayers) => {
        const newDragZonePlayers = oldDragZonePlayers.filter(
          (player) => player.key !== String(deletePlayer)
        );
        return newDragZonePlayers;
      });
      setDeletePlayer(-1);
    }
  }, [deletePlayer]);

  return (
    <div className={props.className}>
      {currentTournament &&
        myTeam &&
        canRegister &&
        teamRegistred === false && (
          <div className={classes.team_manage}>
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
                    team: myTeam.team_id,
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
          <div
            className={classes.dropZone}
            onDragEnter={(e) => {
              e.preventDefault();
              if (dragPlayer === null) {
                return;
              }
              if (dragZonePlayers.length > 0) {
                setDragZoneText(
                  <FormattedMessage
                    id="onDragPlayerNotEmpty"
                    values={{ br: <br /> }}
                  />
                );
              } else {
                setDragZoneText(<FormattedMessage id="onDragPlayerOver" />);
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragZoneText(<FormattedMessage id="dropZoneMessage" />);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (droppedPlayer.length > 0 && dragPlayer) {
                if (
                  droppedPlayer.some((player) => player?.id === dragPlayer.id)
                ) {
                  return;
                }
              }
              dispatch(setDroppedPlayer([dragPlayer]));
              if (dragPlayer && dragPlayer.id) {
                setPlayerToSeason({
                  player_id: dragPlayer?.id,
                  token: cookies.token,
                  season: currentTournament.number,
                });
                dispatch(setDraggable([dragPlayer.id, false]));
              }
              if (dragZonePlayers.length > 0) {
                setDragZoneText(
                  <FormattedMessage
                    id="onDragPlayerNotEmpty"
                    values={{ br: <br /> }}
                  />
                );
              } else {
                setDragZoneText(<FormattedMessage id="dropZoneMessage" />);
              }
            }}
          >
            {dragZoneText}
            {dragZonePlayers.map((player) => player)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Participate;
