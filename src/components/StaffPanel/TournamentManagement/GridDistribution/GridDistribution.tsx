import { IGroup } from "models/IGroup";
import {
  FC,
  useEffect,
  useRef,
  useState,
  MutableRefObject,
  ChangeEvent,
} from "react";
import { useCookies } from "react-cookie";
import { GroupApi } from "services/GroupService";
import classes from "./GridDistribution.module.scss";
import { IClan } from "models/IClan";
import { selectTournamentsData } from "store/reducers/TournamentsAdminSlice";
import { useAppSelector } from "hooks/reduxHooks";
import { FormattedMessage } from "react-intl";

interface IWins {
  [key: number]: {
    [key: number]: number;
  };
}

interface ITeamDict {
  [key: number]: IClan;
}

interface IProps {
  tournamentsWebSocketRef: MutableRefObject<WebSocket | undefined>;
}

interface ILevelsTournaments {
  [key: number]: {
    [key: number]: {
      teamOne: number;
      teamTwo: number;
      winner: number;
      id: number | null;
    };
  };
}

const GridDistribution: FC<IProps> = ({ tournamentsWebSocketRef }) => {
  const [cookies] = useCookies(["token", "userId"]);
  const { data: groups } = GroupApi.useFetchGroupsQuery(cookies.token);
  const [wins, setWins] = useState<IWins>({});
  const [teamDict, setTeamDict] = useState<ITeamDict>({});
  const [sortedGroups, setSortedGroups] = useState<IGroup[]>([]);
  const [gridRow, setGridRow] = useState<number>(0);
  const [maxGridRow, setMaxGridRow] = useState<number>(0);
  const [minGridRow, setMinGridRow] = useState<number>(1);
  const [thirdPlace, setThirdPlace] = useState<boolean>(true);
  const [lvlsTournaments, setLvlsTournaments] = useState<ILevelsTournaments>(
    {}
  );
  const groupsWebSocketRef = useRef<WebSocket>();
  const tournamentsData = useAppSelector(selectTournamentsData);

  const groupsWebSocketFunc = () => {
    const groupsWebSocket = new WebSocket(
      `${import.meta.env.VITE_SERVER_WS_URL}groups/`
    );
    groupsWebSocketRef.current = groupsWebSocket;

    groupsWebSocket.onopen = () => {
      groupsWebSocket.send(
        JSON.stringify({
          token: cookies.token,
          action: "subscribe",
          group: cookies.userId,
        })
      );
    };

    groupsWebSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setWins(message);
    };

    groupsWebSocket.onclose = () => {
      setTimeout(() => {
        if (groupsWebSocketRef.current) {
          groupsWebSocketFunc();
        }
      }, 2000);
    };
  };

  const handleSelectFirstTeam = (
    event: ChangeEvent<HTMLSelectElement>,
    col: number,
    stage: number
  ) => {
    const selectedTeam = Number(event.target.value);
    setLvlsTournaments((prev) => {
      const allStageTournaments = prev[stage] || [];
      allStageTournaments[col] = {
        teamOne: selectedTeam,
        teamTwo: allStageTournaments[col]
          ? allStageTournaments[col].teamTwo
          : 0,
        winner: -1,
        id:
          allStageTournaments[col] && allStageTournaments[col].id
            ? allStageTournaments[col].id
            : null,
      };

      if (
        allStageTournaments[col].teamTwo !== 0 &&
        allStageTournaments[col].id === null
      ) {
        tournamentsWebSocketRef.current?.send(
          JSON.stringify({
            action: "create_tournament",
            match_start_time: new Date().toISOString(),
            team_one: selectedTeam,
            team_two: allStageTournaments[col].teamTwo,
            stage: stage,
            inline_number: col,
          })
        );
      } else if (allStageTournaments[col].teamTwo !== 0) {
        tournamentsWebSocketRef.current?.send(
          JSON.stringify({
            action: "update",
            tournament_id: allStageTournaments[col].id,
            field: "team_one",
            value: selectedTeam,
          })
        );
      }

      return {
        ...prev,
        [stage]: allStageTournaments,
      };
    });
  };

  const handleSelectSecondTeam = (
    event: ChangeEvent<HTMLSelectElement>,
    col: number,
    stage: number
  ) => {
    const selectedTeam = Number(event.target.value);
    setLvlsTournaments((prev) => {
      const allStageTournaments = prev[stage] || [];
      allStageTournaments[col] = {
        teamOne: allStageTournaments[col]
          ? allStageTournaments[col].teamOne
          : 0,
        teamTwo: selectedTeam,
        winner: -1,
        id:
          allStageTournaments[col] && allStageTournaments[col].id
            ? allStageTournaments[col].id
            : null,
      };

      if (
        allStageTournaments[col].teamOne !== 0 &&
        allStageTournaments[col].id === null
      ) {
        tournamentsWebSocketRef.current?.send(
          JSON.stringify({
            action: "create_tournament",
            match_start_time: new Date().toISOString(),
            team_one: allStageTournaments[col].teamOne,
            team_two: selectedTeam,
            stage: stage,
            inline_number: col,
          })
        );
      } else if (allStageTournaments[col].teamOne !== 0) {
        tournamentsWebSocketRef.current?.send(
          JSON.stringify({
            action: "update",
            tournament_id: allStageTournaments[col].id,
            field: "team_two",
            value: selectedTeam,
          })
        );
      }

      return {
        ...prev,
        [stage]: allStageTournaments,
      };
    });
  };

  useEffect(() => {
    if (tournamentsData) {
      const locLvllsTournaments: ILevelsTournaments = {};
      let maxKey = 0;
      tournamentsData
        .filter((tournament) => tournament.group === null)
        .forEach((tournament) => {
          locLvllsTournaments[tournament.stage ? tournament.stage : 0] =
            locLvllsTournaments[tournament.stage ? tournament.stage : 0] || [];
          locLvllsTournaments[tournament.stage ? tournament.stage : 0][
            tournament.inlineNumber ? tournament.inlineNumber : 0
          ] = {
            teamOne: tournament.teamOne,
            teamTwo: tournament.teamTwo,
            winner: tournament.winner ? tournament.winner : -1,
            id: tournament.id,
          };
          maxKey = Math.max(...Object.keys(locLvllsTournaments[1]).map(Number));

          setMinGridRow(
            locLvllsTournaments[1] ? Math.ceil(Math.log2(maxKey + 1) + 1) : 1
          );
          setLvlsTournaments(locLvllsTournaments);
        });
      if (gridRow === 0) {
        locLvllsTournaments[1]
          ? setGridRow(Math.ceil(Math.log2(maxKey + 1) + 1))
          : setGridRow(
              maxGridRow / 2 + 1 <= maxGridRow ? maxGridRow / 2 + 1 : maxGridRow
            );
      }
    }
  }, [tournamentsData]);

  useEffect(() => {
    groupsWebSocketFunc();

    return () => {
      if (groupsWebSocketRef.current) {
        groupsWebSocketRef.current.close();
        groupsWebSocketRef.current = undefined;
      }
    };
  }, []);

  useEffect(() => {
    if (groups && Object.keys(wins).length > 0) {
      const sortedGroupsData = groups.map((group) => {
        const sortedTeams = group.teams.slice().sort((a, b) => {
          const winA =
            wins[group.id ? group.id : 0] &&
            wins[group.id ? group.id : 0][a.id ? a.id : 0];
          const winB =
            wins[group.id ? group.id : 0] &&
            wins[group.id ? group.id : 0][b.id ? b.id : 0];
          return winB - winA;
        });
        return {
          ...group,
          teams: sortedTeams,
        };
      });

      const teams: ITeamDict = {};
      sortedGroupsData.forEach((group) => {
        group.teams.forEach((team) => {
          teams[team.id ? team.id : 0] = team;
        });
      });
      setTeamDict(teams);
      setSortedGroups(sortedGroupsData);
      setMaxGridRow(Math.ceil(Math.log2(Object.keys(teams).length)));
    }
  }, [groups, wins]);

  return (
    <div className={classes.container}>
      <div className={classes.groups}>
        {sortedGroups &&
          sortedGroups.map((group) => (
            <div className={classes.group} key={group.id}>
              <div className={classes.groupName}>
                <h3>
                  <FormattedMessage id="group" />
                </h3>
                <h3>{group.groupMark}</h3>
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
                  {group.teams.map((team) => (
                    <tr key={team.id}>
                      <th className={classes.team}>
                        <h4>{team.name}</h4>
                      </th>
                      <th className={classes.wins}>
                        <h4>
                          {wins[group.id ? group.id : 0] &&
                            wins[group.id ? group.id : 0][
                              team.id ? team.id : 0
                            ]}
                        </h4>
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
      </div>
      <div className={classes.gridBox}>
        <div className={classes.gridTitleBox}>
          <div>
            <h3>
              <FormattedMessage id="specifyGrid" />
            </h3>
            <div className={classes.gridTitle}>
              <input
                type="range"
                min={1}
                max={maxGridRow}
                value={gridRow}
                onChange={(e) => {
                  if (Number(e.target.value) >= minGridRow) {
                    setGridRow(Number(e.target.value));
                  }
                }}
              />
              <h3>{gridRow}</h3>
            </div>
          </div>
          <div className={classes.thirdPlace}>
            <label htmlFor="thirdPlace">
              <h3>
                <FormattedMessage id="thirdPlace" />
              </h3>
            </label>
            <input
              id="thirdPlace"
              type="checkbox"
              className={classes.checkbox}
              checked={thirdPlace}
              onChange={() => setThirdPlace(!thirdPlace)}
            />
          </div>
        </div>
        <div className={classes.grid}>
          {Array.from(Array(gridRow).keys()).map((row) => (
            <div className={classes.row} key={row}>
              {Array.from(Array(2 ** row).keys()).map((col) => (
                <div className={classes.colBox} key={col}>
                  {row + 1 == gridRow && (
                    <div className={classes.col}>
                      {row === 0 && (
                        <p className={classes.final}>
                          <FormattedMessage id="final" />
                        </p>
                      )}
                      <select
                        className={`${classes.select} 
                      ${
                        lvlsTournaments[1] &&
                        lvlsTournaments[1][col] &&
                        lvlsTournaments[1][col].teamOne &&
                        lvlsTournaments[1][col].winner &&
                        lvlsTournaments[1][col].teamOne ==
                          lvlsTournaments[1][col].winner
                          ? classes.winner
                          : ""
                      }`}
                        value={
                          lvlsTournaments[1] && lvlsTournaments[1][col]
                            ? lvlsTournaments[1][col].teamOne
                            : 0
                        }
                        onChange={(e) => handleSelectFirstTeam(e, col, 1)}
                      >
                        <option value="0" disabled>
                          <FormattedMessage id="selectTeam" />
                        </option>
                        {teamDict &&
                          Object.values(teamDict).map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                      </select>
                      <select
                        className={`${classes.select} 
                      ${
                        lvlsTournaments[1] &&
                        lvlsTournaments[1][col] &&
                        lvlsTournaments[1][col].teamTwo &&
                        lvlsTournaments[1][col].winner &&
                        lvlsTournaments[1][col].teamTwo ==
                          lvlsTournaments[1][col].winner
                          ? classes.winner
                          : ""
                      }`}
                        value={
                          lvlsTournaments[1] && lvlsTournaments[1][col]
                            ? lvlsTournaments[1][col].teamTwo
                            : 0
                        }
                        onChange={(e) => handleSelectSecondTeam(e, col, 1)}
                      >
                        <option value="0" disabled>
                          <FormattedMessage id="selectTeam" />
                        </option>
                        {teamDict &&
                          Object.values(teamDict).map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                  {row + 1 !== gridRow && (
                    <div
                      style={{
                        width: `${
                          (200 * 2 ** (gridRow - 1)) / Array(2 ** row).length +
                          20 * (gridRow - row - 1)
                        }px`,
                      }}
                      className={`${classes.col} ${classes.textCol}`}
                    >
                      {row === 0 && (
                        <p>
                          <FormattedMessage id="final" />
                        </p>
                      )}
                      {lvlsTournaments[gridRow - row] &&
                        lvlsTournaments[gridRow - row][col] &&
                        lvlsTournaments[gridRow - row][col].id && (
                          <div className={classes.teamBox}>
                            <p
                              className={`${classes.team} 
                        ${
                          lvlsTournaments[gridRow - row] &&
                          lvlsTournaments[gridRow - row][col] &&
                          lvlsTournaments[gridRow - row][col].teamOne &&
                          lvlsTournaments[gridRow - row][col].winner &&
                          lvlsTournaments[gridRow - row][col].teamOne ==
                            lvlsTournaments[gridRow - row][col].winner
                            ? classes.winner
                            : ""
                        }`}
                            >
                              {teamDict &&
                                teamDict[
                                  lvlsTournaments[gridRow - row][col].teamOne
                                ]?.name}
                            </p>
                            <p
                              className={`${classes.team}
                        ${
                          lvlsTournaments[gridRow - row] &&
                          lvlsTournaments[gridRow - row][col] &&
                          lvlsTournaments[gridRow - row][col].teamTwo &&
                          lvlsTournaments[gridRow - row][col].winner &&
                          lvlsTournaments[gridRow - row][col].teamTwo ==
                            lvlsTournaments[gridRow - row][col].winner
                            ? classes.winner
                            : ""
                        }`}
                            >
                              {teamDict &&
                                teamDict[
                                  lvlsTournaments[gridRow - row][col].teamTwo
                                ]?.name}
                            </p>
                          </div>
                        )}
                      {(!lvlsTournaments[gridRow - row] ||
                        !lvlsTournaments[gridRow - row][col] ||
                        !lvlsTournaments[gridRow - row][col].id) && (
                        <div className={classes.teamBox}>
                          {lvlsTournaments[gridRow - row - 1] &&
                          lvlsTournaments[gridRow - row - 1][col * 2] &&
                          lvlsTournaments[gridRow - row - 1][col * 2]
                            ?.winner !== -1 ? (
                            <p className={classes.team}>
                              {teamDict &&
                                teamDict[
                                  lvlsTournaments[gridRow - row - 1][col * 2]
                                    ?.winner
                                ]?.name}
                            </p>
                          ) : (
                            <p className={classes.team}></p>
                          )}
                          {lvlsTournaments[gridRow - row - 1] &&
                          lvlsTournaments[gridRow - row - 1][col * 2 + 1] &&
                          lvlsTournaments[gridRow - row - 1][col * 2 + 1]
                            ?.winner !== -1 ? (
                            <p className={classes.team}>
                              {teamDict &&
                                teamDict[
                                  lvlsTournaments[gridRow - row - 1][
                                    col * 2 + 1
                                  ]?.winner
                                ]?.name}
                            </p>
                          ) : (
                            <p className={classes.team}></p>
                          )}
                        </div>
                      )}
                      <div className={classes.line_1}>
                        <div
                          className={classes.col_1}
                          style={{
                            width: `${100 * 2 ** (gridRow - row - 2) + 20}px`,
                          }}
                        ></div>
                        <div
                          className={classes.col_2}
                          style={{
                            width: `${100 * 2 ** (gridRow - row - 2) + 20}px`,
                          }}
                        ></div>
                      </div>
                      <div
                        className={classes.line_2}
                        style={{
                          width: `${200 * 2 ** (gridRow - row - 2) + 40}px`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
              {thirdPlace && row === 0 && (
                <div
                  className={classes.thirdPlace}
                  style={{ position: gridRow >= 4 ? "relative" : "absolute" }}
                >
                  <p>
                    <FormattedMessage id="thirdPlace" />
                  </p>
                  <select
                    className={`${classes.select} ${
                      lvlsTournaments[999] &&
                      lvlsTournaments[999][0] &&
                      lvlsTournaments[999][0].teamOne &&
                      lvlsTournaments[999][0].winner &&
                      lvlsTournaments[999][0].teamOne ==
                        lvlsTournaments[999][0].winner
                        ? classes.winner
                        : ""
                    }`}
                    value={
                      lvlsTournaments[999] && lvlsTournaments[999][0]
                        ? lvlsTournaments[999][0].teamOne
                        : 0
                    }
                    onChange={(e) => handleSelectFirstTeam(e, 0, 999)}
                  >
                    <option value="0" disabled>
                      <FormattedMessage id="selectTeam" />
                    </option>
                    {teamDict &&
                      Object.values(teamDict).map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                  </select>
                  <select
                    className={`${classes.select} ${
                      lvlsTournaments[999] &&
                      lvlsTournaments[999][0] &&
                      lvlsTournaments[999][0].teamTwo &&
                      lvlsTournaments[999][0].winner &&
                      lvlsTournaments[999][0].teamTwo ==
                        lvlsTournaments[999][0].winner
                        ? classes.winner
                        : ""
                    }`}
                    value={
                      lvlsTournaments[999] && lvlsTournaments[999][0]
                        ? lvlsTournaments[999][0].teamTwo
                        : 0
                    }
                    onChange={(e) => handleSelectSecondTeam(e, 0, 999)}
                  >
                    <option value="0" disabled>
                      <FormattedMessage id="selectTeam" />
                    </option>
                    {teamDict &&
                      Object.values(teamDict).map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default GridDistribution;
