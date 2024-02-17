import { FC, useEffect } from "react";
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
  const intl = useIntl();

  useEffect(() => {
    document.title = intl.formatMessage({ id: "statistic" });
  }, [intl]);

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
          Array.from(Object.keys(statistics.inSeasonTeams)).map((key) => (
            <div key={key} className={classes.appliedTeam}>
              <h3>
                <FormattedMessage id="season" /> {key}
              </h3>
              <h3>{statistics.inSeasonTeams[key]}</h3>
              {statistics.maxTeamsInSeasonCnt !== 0 && (
                <div className={classes.lineBox}>
                  <div
                    className={classes.line}
                    style={{
                      width: `${
                        (100 * statistics.inSeasonTeams[key]) /
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
              <h3>{statistics.otherLeaguesCnt}</h3>
            </div>
          </div>
          <div className={classes.playerStatsBox}>
            <div className={classes.playerBox}>
              <img className={classes.techImg} src={zerg} alt="zerg" />
              <h3>{statistics.playerZergCnt}</h3>
            </div>
            <div className={classes.playerBox}>
              <img className={classes.techImg} src={terran} alt="terran" />
              <h3>{statistics.playerTerranCnt}</h3>
            </div>
            <div className={classes.playerBox}>
              <img className={classes.techImg} src={protoss} alt="protoss" />
              <h3>{statistics.playerProtossCnt}</h3>
            </div>
            <div className={classes.playerBox}>
              <img className={classes.techImg} src={random} alt="random" />
              <h3>{statistics.playerRandomCnt}</h3>
            </div>
          </div>
          <div className={classes.playerStatsBox}>
            <div className={classes.playerBox}>
              <img
                className={classes.techImg}
                src={grandmaster}
                alt="grandmaster"
              />
              <h3>{statistics.playerGmLeagueCnt}</h3>
            </div>
            <div className={classes.playerBox}>
              <img className={classes.techImg} src={master} alt="master" />
              <h3>{statistics.playerMLeagueCnt}</h3>
            </div>
            <div className={classes.playerBox}>
              <img className={classes.techImg} src={diamond} alt="diamond" />
              <h3>{statistics.playerDmLeagueCnt}</h3>
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
              <h3>{statistics.matchesCnt}</h3>
            </div>
            <div className={classes.totalMatches}>
              <h3>
                <FormattedMessage id="mirrors" />:{" "}
              </h3>
              <h3>{statistics.mirrorsCnt}</h3>
            </div>
          </div>
          <div className={classes.matchesBox}>
            {statistics.tvzCnt > 0 && (
              <div className={classes.matchBox}>
                <h3>TvZ</h3>
                <h3>
                  {(
                    (statistics.tvzTerranWins / statistics.tvzCnt) *
                    100
                  ).toFixed(2)}
                  %
                </h3>
                <p>
                  ({statistics.tvzTerranWins} :{" "}
                  {statistics.tvzCnt - statistics.tvzTerranWins})
                </p>
              </div>
            )}
            {statistics.tvpCnt > 0 && (
              <div className={classes.matchBox}>
                <h3>TvP</h3>
                <h3>
                  {(
                    (statistics.tvpTerranWins / statistics.tvpCnt) *
                    100
                  ).toFixed(2)}
                  %
                </h3>
                <p>
                  ({statistics.tvpTerranWins} :{" "}
                  {statistics.tvpCnt - statistics.tvpTerranWins})
                </p>
              </div>
            )}
            {statistics.pvzCnt > 0 && (
              <div className={classes.matchBox}>
                <h3>PvZ</h3>
                <h3>
                  {(
                    (statistics.pvzProtossWins / statistics.pvzCnt) *
                    100
                  ).toFixed(2)}
                  %
                </h3>
                <p>
                  ({statistics.pvzProtossWins} :{" "}
                  {statistics.pvzCnt - statistics.pvzProtossWins})
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
