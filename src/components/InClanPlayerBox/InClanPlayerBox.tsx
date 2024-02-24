import { FC, HTMLProps } from "react";
import classes from "./InClanPlayerBox.module.scss";
import { IPlayer } from "models/IPlayer";
import RaceLeagueImgs from "components/RaceLeagueImgs/RaceLeagueImgs";
import { FormattedMessage } from "react-intl";
import playerDefault from "@assets/images/player/default.svg";

interface IProps extends HTMLProps<HTMLDivElement> {
  player: IPlayer;
}

/**
 * InClanPlayerBox component
 *
 * This component represents a box displaying information about a player within a clan.
 * It includes the player's avatar, username, MMR (Match Making Rating), total games played, and wins.
 *
 * @param props - HTMLProps props for the div element representing the player box
 * @param props.player - Information about the player to be displayed
 * @param props.onClick - Event handler for the click event on the player box
 */
const InClanPlayerBox: FC<IProps> = ({ ...props }) => {
  return (
    <div
      key={props.key}
      onClick={props.onClick}
      className={`${classes.playerInfo} ${
        props.className ? props.className : ""
      }`}
    >
      <div className={classes.playerInfoBox}>
        <RaceLeagueImgs player={props.player} />
        <img
          draggable={false}
          src={playerDefault}
          alt={props.player.username}
          className={classes.playerLogo}
          onLoad={(e) => {
            if (!e.currentTarget.classList.contains("error")) {
              props.player.avatar
                ? (e.currentTarget.src = props.player.avatar)
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
        <div className={classes.playerNameBox}>
          <h2 className={classes.playerName}>{props.player.username}</h2>
          <h3 className={classes.playerMMR}>MMR: {props.player.mmr}</h3>
        </div>
      </div>
      <div className={classes.playerStats}>
        <div className={classes.playerStat}>
          <h4>
            <FormattedMessage id="totalGames" />:{" "}
            {props.player.total_games ? props.player.total_games : 0}
          </h4>
        </div>
        <div className={classes.playerStat}>
          <h4>
            <FormattedMessage id="wins" />:{" "}
            {props.player.wins ? props.player.wins : 0}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default InClanPlayerBox;
