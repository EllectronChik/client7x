import { FC, MutableRefObject, Dispatch, SetStateAction } from "react";
import deleteWhite from "assets/images/techImages/deleteWhite.svg";
import { Tooltip } from "react-tooltip";
import editWhite from "assets/images/techImages/editWhite.svg";
import { useCookies } from "react-cookie";
import {
  selectMapNames,
  setMapNames,
  selectLocalTimes,
  setLocalTimes,
  selectMatchEdit,
  setMatchEdit,
  selectMatches,
} from "store/reducers/TournamentsAdminSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { TournamentApi } from "services/TournamentService";
import classes from "./GameAProgress.module.scss";
import { ITournamentAdmin } from "models/ITournamentAdmin";
import { IMatch } from "models/IMatch";
import { FormattedMessage, useIntl } from "react-intl";

interface IProps {
  tournament: ITournamentAdmin;
  tournamentsWebSocketRef: MutableRefObject<WebSocket | undefined>;
  matchesWebSocketsRef: MutableRefObject<{ [key: number]: WebSocket }>;
  matchesWebSocketFunc: (tournament: ITournamentAdmin) => void;
  deletedMatches: number[];
  setDeletedMatches: Dispatch<SetStateAction<number[]>>;
}

const GameAProgress: FC<IProps> = ({
  tournament,
  tournamentsWebSocketRef,
  matchesWebSocketsRef,
  matchesWebSocketFunc,
  deletedMatches,
  setDeletedMatches,
}) => {
  const [cookies] = useCookies(["token", "userId"]);
  const dispatch = useAppDispatch();
  const mapNames = useAppSelector(selectMapNames);
  const localTimes = useAppSelector(selectLocalTimes);
  const matchEdit = useAppSelector(selectMatchEdit);
  const matches = useAppSelector(selectMatches);
  const { data: playersInTeams } = TournamentApi.useFetchPlayerByTeamsQuery(
    cookies.token
  );
  const intl = useIntl();

  return (
    <div className={classes.tournament} key={tournament.id}>
      <div className={classes.tournamentInfo}>
        <h3
          className={`${
            tournament.winner === tournament.teamOne ? classes.winner : ""
          } ${classes.team}`}
          onClick={() => {
            if (
              tournament.winner !== tournament.teamOne &&
              tournamentsWebSocketRef.current
            ) {
              tournamentsWebSocketRef.current.send(
                JSON.stringify({
                  action: "update",
                  tournament_id: tournament.id,
                  field: "winner",
                  value: tournament.teamOne,
                })
              );
            }
          }}
        >
          {tournament.teamOneName}
        </h3>
        <h3>{tournament.teamOneWins}</h3>
        <h3>:</h3>
        <h3>{tournament.teamTwoWins}</h3>
        <h3
          className={`${
            tournament.winner === tournament.teamTwo ? classes.winner : ""
          } ${classes.team}`}
          onClick={() => {
            if (
              tournament.winner !== tournament.teamTwo &&
              tournamentsWebSocketRef.current
            ) {
              tournamentsWebSocketRef.current.send(
                JSON.stringify({
                  action: "update",
                  tournament_id: tournament.id,
                  field: "winner",
                  value: tournament.teamTwo,
                })
              );
            }
          }}
        >
          {tournament.teamTwoName}
        </h3>
      </div>
      <div className={classes.techInputContainer}>
        {localTimes[tournament.id] && (
          <input
            className={classes.dateInput}
            type="datetime-local"
            value={localTimes[tournament.id]}
            onChange={(event) => {
              dispatch(
                setLocalTimes({
                  tournamentId: tournament.id,
                  localTime: event.target.value,
                })
              );
              if (tournamentsWebSocketRef.current) {
                tournamentsWebSocketRef.current.send(
                  JSON.stringify({
                    action: "update",
                    tournament_id: tournament.id,
                    field: "match_start_time",
                    value: new Date(event.target.value).toISOString(),
                  })
                );
              }
            }}
          />
        )}
        <Tooltip id="addMatch" border="1px solid red">
          <h3>
            <FormattedMessage id="addMatch" />
          </h3>
        </Tooltip>
        <button
          data-tooltip-id="addMatch"
          className={classes.addMatch}
          onClick={() => {
            if (!matchesWebSocketsRef.current[tournament.id]) {
              matchesWebSocketFunc(tournament);
              setTimeout(() => {
                matchesWebSocketsRef.current[tournament.id].send(
                  JSON.stringify({
                    action: "create",
                  })
                );
              }, 1000);
            } else {
              matchesWebSocketsRef.current[tournament.id].send(
                JSON.stringify({
                  action: "create",
                })
              );
            }
          }}
        >
          +
        </button>
      </div>
      {matches[tournament.id] &&
        playersInTeams &&
        Object.keys(playersInTeams).length > 0 &&
        Object.values(matches[tournament.id]).map((match: IMatch) => {
          return (
            <div className={classes.matchContainerBox} key={match.id}>
              {!matchEdit[match.id] && (
                <div className={classes.matchContainer}>
                  <div className={classes.match}>
                    <h3
                      className={`${classes.player} ${classes.playerOne} ${
                        match.winner === match.player_one ? classes.winner : ""
                      }`}
                      onClick={() => {
                        if (match.winner !== match.player_one) {
                          matchesWebSocketsRef.current[tournament.id].send(
                            JSON.stringify({
                              action: "update",
                              updated_field: match.id,
                              updated_column: "winner",
                              updated_value: match.player_one,
                            })
                          );
                        }
                      }}
                    >
                      {playersInTeams &&
                        playersInTeams[tournament.teamOne] &&
                        playersInTeams[tournament.teamOne][match.player_one]}
                    </h3>
                    <h3>VS</h3>
                    <h3
                      className={`${classes.player} ${
                        match.winner === match.player_two ? classes.winner : ""
                      }`}
                      onClick={() => {
                        if (match.winner !== match.player_two) {
                          matchesWebSocketsRef.current[tournament.id].send(
                            JSON.stringify({
                              action: "update",
                              updated_field: match.id,
                              updated_column: "winner",
                              updated_value: match.player_two,
                            })
                          );
                        }
                      }}
                    >
                      {playersInTeams[tournament.teamTwo] &&
                        playersInTeams[tournament.teamTwo][match.player_two]}
                    </h3>
                  </div>
                  <div className={classes.matchInfo}>
                    <h3 className={classes.map}>
                      {match.map !== null
                        ? match.map !== ""
                          ? match.map
                          : intl.formatMessage({ id: "mapUnspecified" })
                        : intl.formatMessage({ id: "mapUnspecified" })}
                    </h3>
                    <button
                      className={classes.editButton}
                      onClick={() => {
                        dispatch(
                          setMatchEdit({
                            matchId: match.id,
                            edit: true,
                          })
                        );
                      }}
                    >
                      <img
                        className={classes.edit}
                        src={editWhite}
                        alt="edit"
                        draggable="false"
                      />
                    </button>
                    {!deletedMatches.includes(match.id) && (
                      <button
                        className={classes.deleteButton}
                        onClick={() => {
                          setDeletedMatches([...deletedMatches, match.id]);
                          matchesWebSocketsRef.current[tournament.id].send(
                            JSON.stringify({
                              action: "delete",
                              match_pk: match.id,
                            })
                          );
                        }}
                      >
                        <img
                          className={classes.delete}
                          src={deleteWhite}
                          alt="delete"
                          draggable="false"
                        />
                      </button>
                    )}
                    {deletedMatches.includes(match.id) && (
                      <span className={classes.loader}></span>
                    )}
                  </div>
                </div>
              )}
              {matchEdit[match.id] && (
                <div className={classes.matchContainer}>
                  <div className={classes.match}>
                    <select
                      className={classes.select}
                      value={match.player_one !== null ? match.player_one : 0}
                      onChange={(event) => {
                        matchesWebSocketsRef.current[tournament.id].send(
                          JSON.stringify({
                            action: "update",
                            updated_field: match.id,
                            updated_column: "player_one",
                            updated_value: event.target.value,
                          })
                        );
                      }}
                    >
                      <option className={classes.option} value="0" disabled>
                        <FormattedMessage id="selectPlayerLabel" />
                      </option>
                      {playersInTeams[tournament.teamOne] &&
                        Object.keys(playersInTeams[tournament.teamOne]).map(
                          (playerId) => {
                            return (
                              <option
                                className={classes.option}
                                key={playerId}
                                value={playerId}
                              >
                                {
                                  playersInTeams[tournament.teamOne][
                                    parseInt(playerId)
                                  ]
                                }
                              </option>
                            );
                          }
                        )}
                    </select>
                    <h3>VS</h3>
                    <select
                      className={classes.select}
                      value={match.player_two !== null ? match.player_two : 0}
                      onChange={(event) => {
                        matchesWebSocketsRef.current[tournament.id].send(
                          JSON.stringify({
                            action: "update",
                            updated_field: match.id,
                            updated_column: "player_two",
                            updated_value: event.target.value,
                          })
                        );
                      }}
                    >
                      <option className={classes.option} value="0" disabled>
                        <FormattedMessage id="selectPlayerLabel" />
                      </option>
                      {playersInTeams[tournament.teamTwo] &&
                        Object.keys(playersInTeams[tournament.teamTwo]).map(
                          (playerId) => {
                            return (
                              <option
                                className={classes.option}
                                key={playerId}
                                value={playerId}
                              >
                                {
                                  playersInTeams[tournament.teamTwo][
                                    parseInt(playerId)
                                  ]
                                }
                              </option>
                            );
                          }
                        )}
                    </select>
                  </div>
                  <div className={classes.matchInfo}>
                    <input
                      placeholder={intl.formatMessage({ id: "mapLabel" })}
                      className={classes.mapNames}
                      type="text"
                      value={mapNames[match.id]}
                      onChange={(event) => {
                        dispatch(
                          setMapNames({
                            matchId: match.id,
                            mapNames: event.target.value,
                          })
                        );
                        matchesWebSocketsRef.current[tournament.id].send(
                          JSON.stringify({
                            action: "update",
                            updated_field: match.id,
                            updated_column: "map",
                            updated_value: event.target.value,
                          })
                        );
                      }}
                    />
                    <button
                      className={classes.editButton}
                      onClick={() => {
                        dispatch(
                          setMatchEdit({
                            matchId: match.id,
                            edit: false,
                          })
                        );
                      }}
                    >
                      <img
                        className={classes.edit}
                        src={editWhite}
                        alt="edit"
                        draggable="false"
                      />
                    </button>
                    {!deletedMatches.includes(match.id) && (
                      <button
                        className={classes.deleteButton}
                        onClick={() => {
                          setDeletedMatches([...deletedMatches, match.id]);
                          matchesWebSocketsRef.current[tournament.id].send(
                            JSON.stringify({
                              action: "delete",
                              match_pk: match.id,
                            })
                          );
                        }}
                      >
                        <img
                          className={classes.delete}
                          src={deleteWhite}
                          alt="delete"
                          draggable="false"
                        />
                      </button>
                    )}
                    {deletedMatches.includes(match.id) && (
                      <span className={classes.loader}></span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      <div className={classes.isFinished}>
        <label
          htmlFor={`isFinished_${tournament.id}`}
          className={classes.isFinishedLabel}
        >
          <FormattedMessage id="completed" />
        </label>
        <input
          id={`isFinished_${tournament.id}`}
          type="checkbox"
          checked={tournament.isFinished}
          onChange={() => {
            tournamentsWebSocketRef.current?.send(
              JSON.stringify({
                action: "update",
                tournament_id: tournament.id,
                field: "is_finished",
                value: !tournament.isFinished,
              })
            );
          }}
        />
      </div>
    </div>
  );
};

export default GameAProgress;
