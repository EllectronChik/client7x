import { FC } from "react";
import classes from "./Player.module.scss";
import { useParams } from "react-router";
import { PlayerApi } from "services/PlayerService";
import zerg from "assets/images/races/zerg.svg";
import terran from "assets/images/races/terran.svg";
import protoss from "assets/images/races/protoss.svg";
import random from "assets/images/races/random.svg";
import bronze from "assets/images/leagueMarks/1.webp";
import silver from "assets/images/leagueMarks/2.webp";
import gold from "assets/images/leagueMarks/3.webp";
import platinum from "assets/images/leagueMarks/4.webp";
import diamond from "assets/images/leagueMarks/5.webp";
import master from "assets/images/leagueMarks/6.webp";
import grandmaster from "assets/images/leagueMarks/7.webp";
import { Link } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";

const Player: FC = () => {
  const params = useParams();
  const intl = useIntl();
  const { data: playerData } = PlayerApi.useFetchPlayerByIdQuery(
    params.player ? parseInt(params.player) : 1
  );

  return (
    <div className={classes.container}>
      <div className={classes.player}>
        <div className={classes.header}>
          <div className={classes.playerInfoLeft}>
            <div className={classes.teachImgs}>
              <img
                className={classes.leagueMark}
                src={
                  playerData?.player.league === 1
                    ? bronze
                    : playerData?.player.league === 2
                    ? silver
                    : playerData?.player.league === 3
                    ? gold
                    : playerData?.player.league === 4
                    ? platinum
                    : playerData?.player.league === 5
                    ? diamond
                    : playerData?.player.league === 6
                    ? master
                    : playerData?.player.league === 7
                    ? grandmaster
                    : undefined
                }
              />
              <img
                className={classes.race}
                src={
                  playerData?.player.race === 1
                    ? zerg
                    : playerData?.player.race === 2
                    ? terran
                    : playerData?.player.race === 3
                    ? protoss
                    : random
                }
                alt=""
              />
            </div>
            <img
              className={classes.avatar}
              src={playerData?.player.avatar}
              alt={playerData?.player.username}
            />
            <div>
              <h3>{playerData?.player.username}</h3>
              <h4>MMR: {playerData?.player.mmr}</h4>
            </div>
          </div>
          <div className={classes.playerInfo}>
            <h3>
              <FormattedMessage id="totalGames" />:{" "}
              {playerData?.player.total_games}
            </h3>
            <h3>
              <FormattedMessage id="wins" />: {playerData?.player.wins}
            </h3>
          </div>
        </div>
        <div className={classes.content}>
          <h2 className={classes.title}>
            <FormattedMessage id="matches" />
          </h2>
          <div className={classes.matchHead}>
            <h3 className={classes.matchLine}>
              <FormattedMessage id="opponentLabel" />
            </h3>
            <h3 className={classes.matchLine}>
              <FormattedMessage id="result" />
            </h3>
            <h3 className={classes.matchLine}>
              <FormattedMessage id="mapLabel" />
            </h3>
          </div>
          {playerData?.matches.map((match) => (
            <div className={classes.match} key={match.id}>
              <Link to={`/player/${match.opponentId}`}>
                <h3 className={`${classes.matchLine} ${classes.opponentLine}`}>
                  &lt;{match.opponentTag}&gt;{match.opponent}
                </h3>
              </Link>
              <h3 className={classes.matchLine}>
                {match.winner
                  ? intl.formatMessage({ id: "win" })
                  : intl.formatMessage({ id: "lose" })}
              </h3>
              <h3 className={classes.matchLine}>{match.map}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Player;
