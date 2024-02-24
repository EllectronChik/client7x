import { FC } from "react";
import zerg from "@assets/images/races/zerg.svg";
import terran from "@assets/images/races/terran.svg";
import protoss from "@assets/images/races/protoss.svg";
import random from "@assets/images/races/random.svg";
import bronze from "@assets/images/leagueMarks/1.webp";
import silver from "@assets/images/leagueMarks/2.webp";
import gold from "@assets/images/leagueMarks/3.webp";
import platinum from "@assets/images/leagueMarks/4.webp";
import diamond from "@assets/images/leagueMarks/5.webp";
import master from "@assets/images/leagueMarks/6.webp";
import grandmaster from "@assets/images/leagueMarks/7.webp";
import leagueDefault from "@assets/images/leagueMarks/0.svg";
import classes from "./RaceLeagueImgs.module.scss";
import { IPlayer } from "models/IPlayer";

/**
 * RaceLeagueImgs component
 *
 * This component displays images representing a player's race and league in a game.
 * It takes a player object as a prop and renders the corresponding league and race images.
 *
 * @param {IPlayer} player - The player object containing information about the player, including race and league
 */
const RaceLeagueImgs: FC<{ player: IPlayer }> = ({ player }) => {
  return (
    <div className={classes.infoImages}>
      <img
        className={classes.infoImg}
        src={
          player.league === 1
            ? bronze
            : player.league === 2
            ? silver
            : player.league === 3
            ? gold
            : player.league === 4
            ? platinum
            : player.league === 5
            ? diamond
            : player.league === 6
            ? master
            : player.league === 7
            ? grandmaster
            : leagueDefault
        }
        alt=""
      />
      <img
        className={classes.infoImg}
        src={
          player.race === 1
            ? zerg
            : player.race === 2
            ? terran
            : player.race === 3
            ? protoss
            : player.race === 4
            ? random
            : leagueDefault
        }
        alt=""
      />
    </div>
  );
};

export default RaceLeagueImgs;
