import { FC, useEffect, useState } from "react";
import classes from "./Statistics.module.scss";
import { StatisticsApi } from "services/StatisticsService";
import grandmaster from "@assets/images/leagueMarks/7.webp";
import master from "@assets/images/leagueMarks/6.webp";
import diamond from "@assets/images/leagueMarks/5.webp";
import zerg from "@assets/images/races/zerg.svg";
import terran from "@assets/images/races/terran.svg";
import protoss from "@assets/images/races/protoss.svg";
import random from "@assets/images/races/random.svg";
import { FormattedMessage, useIntl } from "react-intl";

const Statistics: FC = () => {
  const { data: statistics } = StatisticsApi.useFetchStatisticsQuery();
  const [strongestRaces, setStrongestRaces] = useState<{
    [key: number]: number;
  }>({});
  const [weakestRaces, setWeakestRaces] = useState<{
    [key: number]: number;
  }>({});
  const intl = useIntl();

  useEffect(() => {
    document.title = intl.formatMessage({ id: "statistic" });
  }, [intl]);

  useEffect(() => {
    if (statistics) {
      statistics.maps.forEach((map) => {
        const tvpTerranWinPercentage =
          map.tvpCount !== 0 ? (map.tvpTerranWins / map.tvpCount) * 100 : null;
        const tvpProtossWinPercentage =
          tvpTerranWinPercentage !== null ? 100 - tvpTerranWinPercentage : null;
        const tvzTerranWinPercentage =
          map.tvzCount !== 0 ? (map.tvzTerranWins / map.tvzCount) * 100 : null;
        const tvzZergWinPercentage =
          tvzTerranWinPercentage !== null ? 100 - tvzTerranWinPercentage : null;
        const pvzProtossWinPercentage =
          map.pvzCount !== 0 ? (map.pvzProtossWins / map.pvzCount) * 100 : null;
        const pvzZergWinPercentage =
          pvzProtossWinPercentage !== null
            ? 100 - pvzProtossWinPercentage
            : null;
        const maxPercentage = Math.max(
          tvpTerranWinPercentage ? tvpTerranWinPercentage : 0,
          tvzTerranWinPercentage ? tvzTerranWinPercentage : 0,
          pvzProtossWinPercentage ? pvzProtossWinPercentage : 0,
          pvzZergWinPercentage ? pvzZergWinPercentage : 0,
          tvpProtossWinPercentage ? tvpProtossWinPercentage : 0,
          tvzZergWinPercentage ? tvzZergWinPercentage : 0
        );
        const minPercentage = Math.min(
          tvpTerranWinPercentage ? tvpTerranWinPercentage : 0,
          tvzTerranWinPercentage ? tvzTerranWinPercentage : 0,
          pvzProtossWinPercentage ? pvzProtossWinPercentage : 0,
          pvzZergWinPercentage ? pvzZergWinPercentage : 0,
          tvpProtossWinPercentage ? tvpProtossWinPercentage : 0,
          tvzZergWinPercentage ? tvzZergWinPercentage : 0
        );

        setStrongestRaces((prev) => ({
          ...prev,
          [map.id]:
            maxPercentage === tvpProtossWinPercentage
              ? 3
              : maxPercentage === pvzProtossWinPercentage
              ? 3
              : maxPercentage === tvpTerranWinPercentage
              ? 2
              : maxPercentage === tvzTerranWinPercentage
              ? 2
              : maxPercentage === pvzZergWinPercentage
              ? 1
              : maxPercentage === tvzZergWinPercentage
              ? 1
              : 0,
        }));
        setWeakestRaces((prev) => ({
          ...prev,
          [map.id]:
            minPercentage === tvpProtossWinPercentage
              ? 3
              : minPercentage === pvzProtossWinPercentage
              ? 3
              : minPercentage === tvpTerranWinPercentage
              ? 2
              : minPercentage === tvzTerranWinPercentage
              ? 2
              : minPercentage === pvzZergWinPercentage
              ? 1
              : minPercentage === tvzZergWinPercentage
              ? 1
              : 0,
        }));
      });
    }
  }, [statistics]);

  return (
    <div className={classes.container}>
      <h2>
        <FormattedMessage id="statistic" />
      </h2>
      <div className={classes.stats}>
        <h3>
          <FormattedMessage id="teamsParticipating" />
        </h3>
        {statistics &&
          statistics.inSeasonTeams.map((inSeasonTeam, key) => (
            <div key={key} className={classes.appliedTeam}>
              <h3 className={classes.seasonName}>
                <FormattedMessage id="season" /> {inSeasonTeam.number}
              </h3>
              <h3 className={classes.teamCount}>{inSeasonTeam.teamCount}</h3>
              {statistics.maxTeamsInSeasonCnt !== 0 && (
                <div className={classes.lineBox}>
                  <div
                    className={classes.line}
                    style={{
                      width: `${
                        (100 * inSeasonTeam.teamCount) /
                        statistics.maxTeamsInSeasonCnt
                      }%`,
                    }}
                  ></div>
                </div>
              )}
            </div>
          ))}
      </div>
      {statistics && (
        <div className={classes.playerStats}>
          <div className={classes.playerStatsTitle}>
            <div className={classes.totalPlayers}>
              <h3>
                <FormattedMessage id="totalPlayers" />:
              </h3>
              <h3>{statistics.playerCnt}</h3>
            </div>
            <div className={classes.totalPlayers}>
              <h3>
                <FormattedMessage id="otherLeagues" />:
              </h3>
              <h3>
                {
                  statistics.leagueStats.find((l) => l.league === 0)
                    ?.playerCount
                }
              </h3>
            </div>
          </div>
          <div className={classes.playerStatsBox}>
            <div className={classes.playerBox}>
              <img
                className={classes.techImg}
                src={zerg}
                alt="zerg"
                draggable={false}
              />
              <h3>
                {statistics.raceStats.find((r) => r.race === 1)?.playerCount}
              </h3>
            </div>
            <div className={classes.playerBox}>
              <img
                className={classes.techImg}
                src={terran}
                alt="terran"
                draggable={false}
              />
              <h3>
                {statistics.raceStats.find((r) => r.race === 2)?.playerCount}
              </h3>
            </div>
            <div className={classes.playerBox}>
              <img
                className={classes.techImg}
                src={protoss}
                alt="protoss"
                draggable={false}
              />
              <h3>
                {statistics.raceStats.find((r) => r.race === 3)?.playerCount}
              </h3>
            </div>
            <div className={classes.playerBox}>
              <img
                className={classes.techImg}
                src={random}
                alt="random"
                draggable={false}
              />
              <h3>
                {statistics.raceStats.find((r) => r.race === 4)?.playerCount}
              </h3>
            </div>
          </div>
          <div className={classes.playerStatsBox}>
            <div className={classes.playerBox}>
              <img
                className={classes.techImg}
                src={grandmaster}
                alt="grandmaster"
                draggable={false}
              />
              <h3>
                {
                  statistics.leagueStats.find((l) => l.league === 7)
                    ?.playerCount
                }
              </h3>
            </div>
            <div className={classes.playerBox}>
              <img
                className={classes.techImg}
                src={master}
                alt="master"
                draggable={false}
              />
              <h3>
                {
                  statistics.leagueStats.find((l) => l.league === 6)
                    ?.playerCount
                }
              </h3>
            </div>
            <div className={classes.playerBox}>
              <img
                className={classes.techImg}
                src={diamond}
                alt="diamond"
                draggable={false}
              />
              <h3>
                {
                  statistics.leagueStats.find((l) => l.league === 5)
                    ?.playerCount
                }
              </h3>
            </div>
          </div>
        </div>
      )}
      {statistics && (
        <div className={classes.matchesStats}>
          <div>
            <div className={classes.totalMatches}>
              <h3>
                <FormattedMessage id="totalGames" />:
              </h3>
              <h3>{statistics.matchStats.totalMatches}</h3>
            </div>
            <div className={classes.totalMatches}>
              <h3>
                <FormattedMessage id="mirrors" />:{" "}
              </h3>
              <h3>{statistics.matchStats.mirrors}</h3>
            </div>
          </div>
          <div className={classes.matchesBox}>
            {statistics.matchStats.tvzCount > 0 && (
              <div className={classes.matchBox}>
                <h3>TvZ</h3>
                <h3>
                  {(
                    (statistics.matchStats.tvzTerranWins /
                      statistics.matchStats.tvzCount) *
                    100
                  ).toFixed(2)}
                  %
                </h3>
                <p>
                  ({statistics.matchStats.tvzTerranWins} :{" "}
                  {statistics.matchStats.tvzCount -
                    statistics.matchStats.tvzTerranWins}
                  )
                </p>
              </div>
            )}
            {statistics.matchStats.tvpCount > 0 && (
              <div className={classes.matchBox}>
                <h3>TvP</h3>
                <h3>
                  {(
                    (statistics.matchStats.tvpTerranWins /
                      statistics.matchStats.tvpCount) *
                    100
                  ).toFixed(2)}
                  %
                </h3>
                <p>
                  ({statistics.matchStats.tvpTerranWins} :{" "}
                  {statistics.matchStats.tvpCount -
                    statistics.matchStats.tvpTerranWins}
                  )
                </p>
              </div>
            )}
            {statistics.matchStats.pvzCount > 0 && (
              <div className={classes.matchBox}>
                <h3>PvZ</h3>
                <h3>
                  {(
                    (statistics.matchStats.pvzProtossWins /
                      statistics.matchStats.pvzCount) *
                    100
                  ).toFixed(2)}
                  %
                </h3>
                <p>
                  ({statistics.matchStats.pvzProtossWins} :{" "}
                  {statistics.matchStats.pvzCount -
                    statistics.matchStats.pvzProtossWins}
                  )
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      <div className={classes.mapStats}>
        <div className={classes.mapBox}>
          <h3 className={classes.mapName}>
            <FormattedMessage id="mapLabel" />
          </h3>
          <div className={classes.mapStatsBox}>
            <h3 className={classes.mapStatistics}>TvZ</h3>
            <h3 className={classes.mapStatistics}>TvP</h3>
            <h3 className={classes.mapStatistics}>PvZ</h3>
            {window.innerWidth > 576 && (
              <h3 className={classes.mapStatistics}>
                <FormattedMessage id="strongest" />
              </h3>
            )}
            {window.innerWidth > 576 && (
              <h3 className={classes.mapStatistics}>
                <FormattedMessage id="weakest" />
              </h3>
            )}
          </div>
        </div>
        {statistics &&
          statistics.maps.map((map) => (
            <div className={classes.mapBox} key={map.id}>
              <h3 className={classes.mapName}>{map.name}</h3>
              <div className={classes.mapStatsBox}>
                <div className={classes.mapStatistics}>
                  <h3>
                    {map.tvzCount > 0
                      ? `${(map.tvzTerranWins / map.tvzCount) * 100}%`
                      : "0%"}
                  </h3>
                  <p>
                    ({map.tvzTerranWins} : {map.tvzCount - map.tvzTerranWins})
                  </p>
                </div>
                <div className={classes.mapStatistics}>
                  <h3>
                    {map.tvpCount > 0
                      ? `${(map.tvpTerranWins / map.tvpCount) * 100}%`
                      : "0%"}
                  </h3>
                  <p>
                    ({map.tvpTerranWins} : {map.tvpCount - map.tvpTerranWins})
                  </p>
                </div>
                <div className={classes.mapStatistics}>
                  <h3>
                    {map.pvzCount > 0
                      ? `${(map.pvzProtossWins / map.pvzCount) * 100}%`
                      : "0%"}
                  </h3>
                  <p>
                    ({map.pvzProtossWins} : {map.pvzCount - map.pvzProtossWins})
                  </p>
                </div>
                {window.innerWidth > 576 && (
                  <div className={classes.mapStatistics}>
                    <h3>
                      {strongestRaces[map.id] === 0
                        ? "-"
                        : strongestRaces[map.id] === 1
                        ? intl.formatMessage({ id: "zerg" })
                        : strongestRaces[map.id] === 2
                        ? intl.formatMessage({ id: "terran" })
                        : intl.formatMessage({ id: "protoss" })}
                    </h3>
                  </div>
                )}
                {window.innerWidth > 576 && (
                  <div className={classes.mapStatistics}>
                    <h3>
                      {weakestRaces[map.id] === 0
                        ? "-"
                        : weakestRaces[map.id] === 1
                        ? intl.formatMessage({ id: "zerg" })
                        : weakestRaces[map.id] === 2
                        ? intl.formatMessage({ id: "terran" })
                        : intl.formatMessage({ id: "protoss" })}
                    </h3>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Statistics;
