import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { useEffect, useState, FC } from "react";
import { useCookies } from "react-cookie";
import { TournamentApi } from "services/TournamentService";
import { selectLocalTime } from "store/reducers/AccountSlice";
import { selectGroups } from "store/reducers/GroupsSlice";
import {
  selectInputValues,
  selectSelectedTeams,
  setInputValues,
  setSelectedTeams,
} from "store/reducers/MatchesSlice";
import classes from "./MatchDistribution.module.scss";
import moment from "moment";
import Button7x from "components/UI/Button7x/Button7x";
import { Tooltip } from "react-tooltip";
import { FormattedMessage } from "react-intl";

/**
 * MatchDistribution component
 * 
 * This component manages the distribution of matches between teams in different groups and stages.
 * It allows users to select teams for matches, set match start times, and reset the match distribution.
 */
const MatchDistribution: FC = () => {
  const [slideGroupIndex, setSlideGroupIndex] = useState<number>(0);
  const [slideStageIndex, setSlideStageIndex] = useState<number>(0);
  const [additionalStages, setAdditionalStages] = useState<number[]>([]);
  const [regPairs, setRegPairs] = useState<number[][]>([]);
  const [blocksCnt, setBlocksCnt] = useState<number[]>([]);
  const [stagesCnt, setStagesCnt] = useState<number[]>([]);
  const [oldLocalTime, setOldLocalTime] = useState<string | null>(null);
  const inputValues = useAppSelector(selectInputValues);
  const selectedTeams = useAppSelector(selectSelectedTeams);
  const dispatch = useAppDispatch();
  const groups = useAppSelector(selectGroups);
  const localTime = useAppSelector(selectLocalTime);
  const { data: fetchedTournaments } = TournamentApi.useFetchTournamentsQuery();
  const [postTournament] = TournamentApi.usePostTournamentMutation();
  const [deleteAllTournaments] = TournamentApi.useDeleteTournamentsMutation();
  const [cookies] = useCookies(["token"]);

  const handleIncreaseslideGroupIndex = () => {
    setSlideGroupIndex((prev) => (prev < groups.length - 1 ? prev + 1 : 0));
    setSlideStageIndex(0);
  };

  const handleDecreaseslideGroupIndex = () => {
    setSlideGroupIndex((prev) => (prev > 0 ? prev - 1 : groups.length - 1));
    setSlideStageIndex(0);
  };

  const handleIncreaseslideStageIndex = () => {
    setSlideStageIndex((prev) =>
      prev < stagesCnt[slideGroupIndex] ? prev + 1 : 0
    );
  };

  const handleDecreaseslideStageIndex = () => {
    setSlideStageIndex((prev) =>
      prev > 0 ? prev - 1 : stagesCnt[slideGroupIndex]
    );
  };

  useEffect(() => {
    if (groups) {
      setBlocksCnt(groups.map((group) => Math.floor(group.teams.length / 2)));
    }
  }, [groups]);

  useEffect(() => {
    if (groups && groups[slideGroupIndex]) {
      if (groups[slideGroupIndex].teams.length % 2 === 0) {
        setStagesCnt(
          groups.map(
            (group, index) =>
              group.teams.length - 1 + additionalStages[index] - 1
          )
        );
      } else {
        setStagesCnt(
          groups.map(
            (group, index) => group.teams.length - 1 + additionalStages[index]
          )
        );
      }
    }
  }, [groups, additionalStages]);

  useEffect(() => {
    if (groups && blocksCnt.length > 0) {
      const stages: number[][] = [];
      groups.forEach((group) => {
        if (group.teams.length % 2 === 0) {
          stages.push(
            Array.from(
              { length: Math.floor(group.teams.length - 1) },
              (_, i) => i
            )
          );
        } else {
          stages.push(
            Array.from({ length: Math.floor(group.teams.length) }, (_, i) => i)
          );
        }
      });

      const initialInputValues = groups.map((_, groupIndex) =>
        stages[groupIndex].map(() =>
          Array(blocksCnt[groupIndex]).fill([
            "0",
            "0",
            localTime ? localTime : "0",
          ])
        )
      );
      const maxStages = Math.max(...groups.map((group) => group.teams.length));
      const initialSelectedTeams: number[][] = Array.from(
        { length: maxStages },
        () => []
      );
      const initialAdditionalStages = Array(groups.length).fill(0);

      let blockIndexes: number[][] = Array(Math.max(...blocksCnt))
        .fill(0)
        .map(() => Array(maxStages).fill(0));

      if (fetchedTournaments) {
        fetchedTournaments.forEach((tournament) => {
          const groupIndex = groups.findIndex(
            (group) => group.id === tournament.group
          );
          const stageIndex = tournament.stage;
          if (stages && stages[groupIndex]) {
            while (stageIndex > stages[groupIndex].length - 1) {
              stages[groupIndex].push(stageIndex);
              initialInputValues[groupIndex].push(
                Array(blocksCnt[groupIndex]).fill([
                  "0",
                  "0",
                  localTime ? localTime : "0",
                ])
              );
              initialSelectedTeams.push([]);
              blockIndexes[groupIndex].push(0);

              initialAdditionalStages[groupIndex]++;
            }
          }
          if (groupIndex !== -1) {
            const blockIndex = blockIndexes[groupIndex][stageIndex];

            if (blockIndex !== -1) {
              if (groupIndex !== 0) {
              }

              initialInputValues[groupIndex][stageIndex][blockIndex] = [
                tournament.team_one,
                tournament.team_two,
                tournament.match_start_time,
              ];
              setRegPairs((prev) => [
                ...prev,
                [tournament.team_one, tournament.team_two].sort(
                  (a, b) => a - b
                ),
              ]);
              initialSelectedTeams[stageIndex].push(tournament.team_one);
              initialSelectedTeams[stageIndex].push(tournament.team_two);
              blockIndexes[groupIndex][stageIndex] = blockIndex + 1;
            }
          }
        });
      }

      dispatch(setInputValues(initialInputValues));
      dispatch(setSelectedTeams(initialSelectedTeams));

      setAdditionalStages(initialAdditionalStages);
    }
  }, [groups, blocksCnt, fetchedTournaments]);

  useEffect(() => {
    if (inputValues && inputValues[slideGroupIndex] && oldLocalTime) {
      inputValues[slideGroupIndex][slideStageIndex].forEach((block) => {
        if (block && block[2] === oldLocalTime) {
          const updatedInputValues = inputValues.map((group) => {
            return group.map((stage) => {
              return stage.map((block) => {
                if (block && block[2] === oldLocalTime) {
                  return [block[0], block[1], localTime || "0"];
                }
                return block;
              });
            });
          });

          dispatch(setInputValues(updatedInputValues));
        }
      });
    }

    setOldLocalTime(localTime);
  }, [localTime]);

  return (
    <div className={classes.distrSlide}>
      {groups && groups.length > 0 && (
        <div className={classes.distrSlideContent}>
          <div className={classes.DistrSelection}>
            <button
              className={classes.button}
              onClick={handleDecreaseslideGroupIndex}
            >
              &lt;
            </button>
            <h3>
              <FormattedMessage id="group" />{" "}
              {groups[slideGroupIndex].groupMark}
            </h3>
            <button
              className={classes.button}
              onClick={handleIncreaseslideGroupIndex}
            >
              &gt;
            </button>
          </div>
          <div
            className={`${classes.distrStageBttns} ${classes.DistrSelection}`}
          >
            <button
              className={classes.button}
              onClick={handleDecreaseslideStageIndex}
            >
              &lt;
            </button>
            <h3>
              <FormattedMessage id="stage" /> {slideStageIndex + 1}
            </h3>
            <button
              className={classes.button}
              onClick={handleIncreaseslideStageIndex}
            >
              &gt;
            </button>
          </div>
          <div className={classes.distrSlideItems}>
            {blocksCnt.length > 0 &&
              blocksCnt[slideGroupIndex] &&
              Array.from({ length: blocksCnt[slideGroupIndex] }).map(
                (_, blockIndex) => {
                  if (
                    inputValues &&
                    inputValues[slideGroupIndex] &&
                    inputValues[slideGroupIndex][slideStageIndex] &&
                    inputValues[slideGroupIndex][slideStageIndex][blockIndex]
                  ) {
                    return (
                      <form className={classes.distrSlideItem} key={blockIndex}>
                        <div className={classes.distrSlideItemBlock}>
                          <select
                            className={classes.distrSlideItemSelect}
                            value={
                              inputValues[slideGroupIndex][slideStageIndex][
                                blockIndex
                              ][0]
                            }
                            onChange={(e) => {
                              const updatedInputValues = inputValues.map(
                                (group, groupIndex) => {
                                  if (groupIndex === slideGroupIndex) {
                                    return group.map((stage, stageIndex) => {
                                      if (stageIndex === slideStageIndex) {
                                        return stage.map((block, lastIndex) => {
                                          if (blockIndex === lastIndex) {
                                            return [
                                              e.target.value,
                                              block[1],
                                              block[2],
                                            ];
                                          }
                                          return block;
                                        });
                                      }
                                      return stage;
                                    });
                                  }
                                  return group;
                                }
                              );
                              const updatedSelectedTeams = selectedTeams.map(
                                (stage, stageIndex) => {
                                  if (stageIndex === slideStageIndex) {
                                    const newStage = stage.filter(
                                      (team) =>
                                        team !==
                                        parseInt(
                                          inputValues[slideGroupIndex][
                                            slideStageIndex
                                          ][blockIndex][0]
                                        )
                                    );
                                    return [
                                      ...newStage,
                                      parseInt(e.target.value),
                                    ];
                                  }
                                  return stage;
                                }
                              );
                              const regPairString = JSON.stringify(
                                [
                                  0,
                                  parseInt(
                                    inputValues[slideGroupIndex][
                                      slideStageIndex
                                    ][blockIndex][1]
                                  ),
                                ].sort((a, b) => a - b)
                              );
                              if (
                                regPairs.some(
                                  (pair) =>
                                    JSON.stringify(
                                      pair.sort((a, b) => a - b)
                                    ) === regPairString
                                )
                              ) {
                                const updatedRegPairs = regPairs.filter(
                                  (pair) =>
                                    JSON.stringify(pair) !== regPairString
                                );
                                updatedRegPairs.push(
                                  [
                                    parseInt(
                                      inputValues[slideGroupIndex][
                                        slideStageIndex
                                      ][blockIndex][1]
                                    ),
                                    parseInt(e.target.value),
                                  ].sort((a, b) => a - b)
                                );
                                setRegPairs(updatedRegPairs);
                              } else {
                                setRegPairs([
                                  ...regPairs,
                                  [
                                    parseInt(
                                      inputValues[slideGroupIndex][
                                        slideStageIndex
                                      ][blockIndex][1]
                                    ),
                                    parseInt(e.target.value),
                                  ].sort((a, b) => a - b),
                                ]);
                              }
                              dispatch(setInputValues(updatedInputValues));
                              dispatch(setSelectedTeams(updatedSelectedTeams));
                              if (
                                inputValues[slideGroupIndex][slideStageIndex][
                                  blockIndex
                                ][1] !== "0" &&
                                inputValues[slideGroupIndex][slideStageIndex][
                                  blockIndex
                                ][2] !== "0"
                              ) {
                                postTournament({
                                  tournament: {
                                    group: groups[slideGroupIndex].id,
                                    stage: slideStageIndex,
                                    team_one: parseInt(e.target.value),
                                    team_two: parseInt(
                                      inputValues[slideGroupIndex][
                                        slideStageIndex
                                      ][blockIndex][1]
                                    ),
                                    match_start_time: new Date(
                                      inputValues[slideGroupIndex][
                                        slideStageIndex
                                      ][blockIndex][2]
                                    ).toISOString(),
                                  },
                                  token: cookies.token,
                                });
                              }
                            }}
                          >
                            <option value="0" disabled>
                              <FormattedMessage id="selectTeam" />
                            </option>
                            {groups[slideGroupIndex].teams.map((team) => {
                              return (
                                <option
                                  key={team.id}
                                  value={team.id}
                                  disabled={
                                    selectedTeams[slideStageIndex].includes(
                                      team.id || -1
                                    ) ||
                                    (regPairs.some(
                                      (pair) =>
                                        JSON.stringify(
                                          pair.sort((a, b) => a - b)
                                        ) ===
                                        JSON.stringify(
                                          [
                                            parseInt(
                                              inputValues[slideGroupIndex][
                                                slideStageIndex
                                              ][blockIndex][0]
                                            ),
                                            team.id || -1,
                                          ].sort((a, b) => a - b)
                                        )
                                    ) &&
                                      inputValues[slideGroupIndex][
                                        slideStageIndex
                                      ][blockIndex][1] !== "0")
                                  }
                                >
                                  {team.name}
                                </option>
                              );
                            })}
                          </select>
                          <h3>VS</h3>
                          <select
                            className={classes.distrSlideItemSelect}
                            value={
                              inputValues[slideGroupIndex][slideStageIndex][
                                blockIndex
                              ][1]
                            }
                            onChange={(e) => {
                              const updatedInputValues = inputValues.map(
                                (group, groupIndex) => {
                                  if (groupIndex === slideGroupIndex) {
                                    return group.map((stage, stageIndex) => {
                                      if (stageIndex === slideStageIndex) {
                                        return stage.map((block, lastIndex) => {
                                          if (blockIndex === lastIndex) {
                                            return [
                                              block[0],
                                              e.target.value,
                                              block[2],
                                            ];
                                          }
                                          return block;
                                        });
                                      }
                                      return stage;
                                    });
                                  }
                                  return group;
                                }
                              );
                              const updatedSelectedTeams = selectedTeams.map(
                                (stage, stageIndex) => {
                                  if (stageIndex === slideStageIndex) {
                                    const newStage = stage.filter(
                                      (team) =>
                                        team !==
                                        parseInt(
                                          inputValues[slideGroupIndex][
                                            slideStageIndex
                                          ][blockIndex][1]
                                        )
                                    );
                                    return [
                                      ...newStage,
                                      parseInt(e.target.value),
                                    ];
                                  }
                                  return stage;
                                }
                              );
                              const regPairString = JSON.stringify(
                                [
                                  0,
                                  parseInt(
                                    inputValues[slideGroupIndex][
                                      slideStageIndex
                                    ][blockIndex][0]
                                  ),
                                ].sort((a, b) => a - b)
                              );
                              if (
                                regPairs.some(
                                  (pair) =>
                                    JSON.stringify(
                                      pair.sort((a, b) => a - b)
                                    ) === regPairString
                                )
                              ) {
                                const updatedRegPairs = regPairs.filter(
                                  (pair) =>
                                    JSON.stringify(pair) !== regPairString
                                );
                                updatedRegPairs.push(
                                  [
                                    parseInt(
                                      inputValues[slideGroupIndex][
                                        slideStageIndex
                                      ][blockIndex][0]
                                    ),
                                    parseInt(e.target.value),
                                  ].sort((a, b) => a - b)
                                );
                                setRegPairs(updatedRegPairs);
                              } else {
                                setRegPairs([
                                  ...regPairs,
                                  [
                                    parseInt(
                                      inputValues[slideGroupIndex][
                                        slideStageIndex
                                      ][blockIndex][0]
                                    ),
                                    parseInt(e.target.value),
                                  ].sort((a, b) => a - b),
                                ]);
                              }
                              dispatch(setInputValues(updatedInputValues));
                              dispatch(setSelectedTeams(updatedSelectedTeams));
                              if (
                                inputValues[slideGroupIndex][slideStageIndex][
                                  blockIndex
                                ][0] !== "0" &&
                                inputValues[slideGroupIndex][slideStageIndex][
                                  blockIndex
                                ][2] !== "0"
                              ) {
                                postTournament({
                                  tournament: {
                                    group: groups[slideGroupIndex].id,
                                    stage: slideStageIndex,
                                    team_one: parseInt(
                                      inputValues[slideGroupIndex][
                                        slideStageIndex
                                      ][blockIndex][0]
                                    ),
                                    team_two: parseInt(e.target.value),
                                    match_start_time: new Date(
                                      inputValues[slideGroupIndex][
                                        slideStageIndex
                                      ][blockIndex][2]
                                    ).toISOString(),
                                  },
                                  token: cookies.token,
                                });
                              }
                            }}
                          >
                            <option value="0" disabled>
                              <FormattedMessage id="selectTeam" />
                            </option>
                            {groups[slideGroupIndex].teams.map((team) => {
                              return (
                                <option
                                  key={team.id}
                                  value={team.id}
                                  disabled={
                                    selectedTeams[slideStageIndex].includes(
                                      team.id || -1
                                    ) ||
                                    (regPairs.some(
                                      (pair) =>
                                        JSON.stringify(
                                          pair.sort((a, b) => a - b)
                                        ) ===
                                        JSON.stringify(
                                          [
                                            parseInt(
                                              inputValues[slideGroupIndex][
                                                slideStageIndex
                                              ][blockIndex][0]
                                            ),
                                            team.id || -1,
                                          ].sort((a, b) => a - b)
                                        )
                                    ) &&
                                      inputValues[slideGroupIndex][
                                        slideStageIndex
                                      ][blockIndex][0] !== "0")
                                  }
                                >
                                  {team.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <input
                          className={classes.distrSlideItemInput}
                          type="datetime-local"
                          value={
                            inputValues[slideGroupIndex][slideStageIndex]
                              ? moment(
                                  inputValues[slideGroupIndex][slideStageIndex][
                                    blockIndex
                                  ][2]
                                ).format("YYYY-MM-DDTHH:mm")
                              : ""
                          }
                          name="match_start_time"
                          onChange={(e) => {
                            const updatedInputValues = inputValues.map(
                              (group, groupIndex) => {
                                if (groupIndex === slideGroupIndex) {
                                  return group.map((stage, stageIndex) => {
                                    if (stageIndex === slideStageIndex) {
                                      return stage.map((block, lastIndex) => {
                                        if (blockIndex === lastIndex) {
                                          return [
                                            block[0],
                                            block[1],
                                            e.target.value,
                                          ];
                                        }
                                        return block;
                                      });
                                    }
                                    return stage;
                                  });
                                }
                                return group;
                              }
                            );
                            dispatch(setInputValues(updatedInputValues));
                            if (
                              inputValues[slideGroupIndex][slideStageIndex][
                                blockIndex
                              ][0] !== "0" &&
                              inputValues[slideGroupIndex][slideStageIndex][
                                blockIndex
                              ][1] !== "0"
                            ) {
                              postTournament({
                                tournament: {
                                  group: groups[slideGroupIndex].id,
                                  stage: slideStageIndex,
                                  team_one: parseInt(
                                    inputValues[slideGroupIndex][
                                      slideStageIndex
                                    ][blockIndex][0]
                                  ),
                                  team_two: parseInt(
                                    inputValues[slideGroupIndex][
                                      slideStageIndex
                                    ][blockIndex][1]
                                  ),
                                  match_start_time: new Date(
                                    e.target.value
                                  ).toISOString(),
                                },
                                token: cookies.token,
                              });
                            }
                          }}
                        />
                      </form>
                    );
                  }
                  return null;
                }
              )}
          </div>
          <Button7x
            className={classes.distrSlideBtn}
            onClick={() => {
              const resetInputValues = groups.map((_, groupIndex) =>
                Array.from(
                  { length: Math.floor(groups[groupIndex].teams.length) },
                  (_) =>
                    Array(blocksCnt[groupIndex]).fill([
                      "0",
                      "0",
                      localTime ? localTime : "0",
                    ])
                )
              );

              const maxStages = Math.max(
                ...groups.map((group) => group.teams.length)
              );
              const resetSelectedTeams: number[][] = Array.from(
                { length: maxStages },
                () => []
              );

              dispatch(setInputValues(resetInputValues));
              dispatch(setSelectedTeams(resetSelectedTeams));
              setRegPairs([]);
              deleteAllTournaments({ token: cookies.token });
            }}
          >
            <FormattedMessage id="reset" />
          </Button7x>
          <Tooltip id="additionalStageTooltip" border="1px solid red">
            <h3>
              <FormattedMessage id="addStage" />
            </h3>
          </Tooltip>
          <button
            data-tooltip-id="additionalStageTooltip"
            className={classes.additionalStageBtn}
            onClick={() => {
              const newInputValues = [...inputValues[slideGroupIndex]];
              newInputValues.push(
                Array(blocksCnt[slideGroupIndex]).fill([
                  "0",
                  "0",
                  localTime ? localTime : "0",
                ])
              );
              const updatedInputValues = inputValues.map(
                (group, groupIndex) => {
                  if (groupIndex === slideGroupIndex) {
                    return newInputValues;
                  }
                  return group;
                }
              );
              const updatedAdditionalStages = [...additionalStages];
              updatedAdditionalStages[slideGroupIndex]++;
              dispatch(setInputValues(updatedInputValues));
              dispatch(setSelectedTeams([...selectedTeams, []]));
              setAdditionalStages(updatedAdditionalStages);
            }}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchDistribution;
