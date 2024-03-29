import { JSX, Dispatch, SetStateAction } from "react";
import { IPlayer } from "models/IPlayer";
import axios from "axios";
import { updatePlayerField } from "store/reducers/PlayerListSlice";
import classes from "./ManualPlayer.module.scss";
import { FormattedMessage, IntlShape } from "react-intl";

export const handleAddPlayerForm = (
  playerForms: JSX.Element[],
  setPlayerForms: Dispatch<SetStateAction<JSX.Element[]>>,
  manualPlayers: IPlayer[],
  setManualPlayers: Dispatch<SetStateAction<IPlayer[]>>,
  players: IPlayer[],
  dispatch: Dispatch<any>,
  cookies: any,
  intl: IntlShape
) => {
  let mmrTimeout: NodeJS.Timeout;

  if (manualPlayers) {
    const newId = playerForms.length;
    setManualPlayers((manualPlayers) => {
      const updatedPlayers = [...manualPlayers];
      if (!updatedPlayers[newId]) {
        updatedPlayers[newId] = {
          id: newId,
          username: "",
          selected: true,
          race: 0,
          league: 0,
          region: 0,
          avatar: "",
          mmr: 0,
          wins: 0,
          total_games: 0,
          realm: 0,
          team: 0,
          user: cookies.userId,
        };
      }
      return updatedPlayers;
    });
    const newPlayerForm = (
      <div className={classes.playerForm} key={newId}>
        <h2>
          <FormattedMessage id="player" /> {playerForms.length + 1}
        </h2>
        <div className={classes.playerFormBox}>
          <div className={classes.playerFormBoxElement}>
            <div>
              <label className={classes.playerFormLabel}>
                <FormattedMessage id="username" />:
              </label>
              <input
                className={classes.playerFormInput}
                placeholder={intl.formatMessage({ id: "username" })}
                type="text"
                onChange={(e) => {
                  const newUsername = e.target.value;
                  setManualPlayers((manualPlayers) => {
                    const updatedPlayers = [...manualPlayers];
                    updatedPlayers[newId].username = newUsername;
                    return updatedPlayers;
                  });
                }}
              />
            </div>

            <select
              defaultValue="0"
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                const newRace = Number(e.target.value);
                setManualPlayers((manualPlayers) => {
                  const updatedPlayers = [...manualPlayers];
                  updatedPlayers[newId].race = newRace;
                  return updatedPlayers;
                });
              }}
              className={classes.select}
              name="race"
              id={`race_${newId}`}
            >
              <option className={classes.option} value="0" disabled>
                <FormattedMessage id="selectRace" />
              </option>
              <option className={classes.option} value="1">
                <FormattedMessage id="zerg" />
              </option>
              <option className={classes.option} value="2">
                <FormattedMessage id="terran" />
              </option>
              <option className={classes.option} value="3">
                <FormattedMessage id="protoss" />
              </option>
              <option className={classes.option} value="4">
                <FormattedMessage id="random" />
              </option>
            </select>
          </div>
          <div className={classes.playerFormBoxElement}>
            <div>
              <label className={classes.playerFormLabel}>Mmr:</label>
              <input
                type="number"
                className={classes.playerFormInput}
                placeholder="Mmr"
                onChange={(e) => {
                  const newMmr = parseInt(e.target.value);
                  setManualPlayers((manualPlayers) => {
                    const updatedPlayers = [...manualPlayers];
                    updatedPlayers[newId].mmr = newMmr;
                    if (mmrTimeout) {
                      clearTimeout(mmrTimeout);
                    }
                    mmrTimeout = setTimeout(async () => {
                      let region;
                      switch (updatedPlayers[newId].region) {
                        case 1:
                          region = "US";
                          break;
                        case 2:
                          region = "EU";
                          break;
                        case 3:
                          region = "KR";
                          break;
                        default:
                          region = "EU";
                          break;
                      }
                      const league = await axios.get(
                        `${
                          import.meta.env.VITE_API_URL
                        }get_league_by_mmr/?mmr=${
                          updatedPlayers[newId].mmr
                        }&region=${region}`
                      );
                      if (league.status === 200) {
                        if (players)
                          dispatch(
                            updatePlayerField({
                              playerId:
                                updatedPlayers[newId].id + players.length,
                              field: "league",
                              value: league.data.league,
                            })
                          );
                        else
                          dispatch(
                            updatePlayerField({
                              playerId: updatedPlayers[newId].id,
                              field: "league",
                              value: league.data.league,
                            })
                          );
                      }
                    }, 1000);
                    return updatedPlayers;
                  });
                }}
              />
            </div>
            <select
              className={classes.select}
              defaultValue="0"
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                const newRegion = Number(e.target.value);
                setManualPlayers((manualPlayers) => {
                  const updatedPlayers = [...manualPlayers];
                  updatedPlayers[newId].region = newRegion;
                  return updatedPlayers;
                });
              }}
            >
              <option className={classes.option} value="0" disabled>
                <FormattedMessage id="selectAccRegion" />
              </option>
              <option className={classes.option} value="1">
                US
              </option>
              <option className={classes.option} value="2">
                EU
              </option>
              <option className={classes.option} value="3">
                KR
              </option>
            </select>
          </div>
        </div>
      </div>
    );

    setPlayerForms([...playerForms, newPlayerForm]);
  }
};
