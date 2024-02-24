import { IPlayer } from "models/IPlayer";
import { useEffect, useState, MouseEvent, FC } from "react";
import classes from "./PlayerItem.module.scss";
import { PlayerLogoApi } from "services/PlayerLogoService";
import defaultPlayer from "../../assets/images/player/default.svg";
import { useAppDispatch } from "hooks/reduxHooks";
import { updatePlayerField } from "store/reducers/PlayerListSlice";
import usFlag from "assets/images/regionFlags/us.svg";
import euFlag from "assets/images/regionFlags/eu.svg";
import krFlag from "assets/images/regionFlags/kr.svg";
import noLeagueMark from "assets/images/leagueMarks/0.svg";
import bronzeLeagueMark from "assets/images/leagueMarks/1.webp";
import silverLeagueMark from "assets/images/leagueMarks/2.webp";
import goldLeagueMark from "assets/images/leagueMarks/3.webp";
import platinumLeagueMark from "assets/images/leagueMarks/4.webp";
import diamondLeagueMark from "assets/images/leagueMarks/5.webp";
import masterLeagueMark from "assets/images/leagueMarks/6.webp";
import grandmasterLeagueMark from "assets/images/leagueMarks/7.webp";
import { FormattedMessage } from "react-intl";

interface PlayerItemProps {
  player: IPlayer;
  onClick?: (e: MouseEvent) => void;
  title?: string;
}

/**
 * PlayerItem Component
 * 
 * This component represents an individual player item within a list.
 * It displays player information such as username, MMR, avatar, league, and race.
 * Users can interact with the player item by selecting the race from a dropdown menu.
 * 
 * @param player - The player object containing information like username, MMR, league, race, etc.
 * @param onClick - Optional click event handler for the player item.
 * @param title - Optional title attribute for the player item.
 */
const PlayerItem: FC<PlayerItemProps> = ({ player, onClick, title }) => {
  const dispatch = useAppDispatch();
  const [playerLeagueLogo, setPlayerLeagueLogo] = useState<string>("");
  const [playerRegionFlag, setPlayerRegionFlag] = useState<
    typeof usFlag | null
  >(null);
  const [playerLeagueName, setPlayerLeagueName] = useState<string>("");

  useEffect(() => {
    switch (player.league) {
      case 0:
        setPlayerLeagueLogo(noLeagueMark);
        break;
      case 1:
        setPlayerLeagueLogo(bronzeLeagueMark);
        setPlayerLeagueName("Bronze");
        break;
      case 2:
        setPlayerLeagueLogo(silverLeagueMark);
        setPlayerLeagueName("Silver");
        break;
      case 3:
        setPlayerLeagueLogo(goldLeagueMark);
        setPlayerLeagueName("Gold");
        break;
      case 4:
        setPlayerLeagueLogo(platinumLeagueMark);
        setPlayerLeagueName("Platinum");
        break;
      case 5:
        setPlayerLeagueLogo(diamondLeagueMark);
        setPlayerLeagueName("Diamond");
        break;
      case 6:
        setPlayerLeagueLogo(masterLeagueMark);
        setPlayerLeagueName("Master");
        break;
      case 7:
        setPlayerLeagueLogo(grandmasterLeagueMark);
        setPlayerLeagueName("Grandmaster");
        break;
      default:
        setPlayerLeagueLogo(noLeagueMark);
        break;
    }

    switch (player.region) {
      case 1:
        setPlayerRegionFlag(usFlag);
        break;
      case 2:
        setPlayerRegionFlag(euFlag);
        break;
      case 3:
        setPlayerRegionFlag(krFlag);
        break;
      default:
        break;
    }
  }, [player]);

  const { data: playerLogo, error } = PlayerLogoApi.useFetchPlayerLogoQuery({
    region: player.region,
    realm: player.realm,
    id: player.id,
  });

  useEffect(() => {
    dispatch(
      updatePlayerField({
        playerId: player.id,
        field: "avatar",
        value: playerLogo,
      })
    );
  }, [playerLogo]);

  return (
    <div
      {...(title && { title })}
      draggable="false"
      {...(onClick && { onClick })}
      className={classes.playerItem}
    >
      <div className={classes.infoWrapper}>
        <div className={classes.avatarWrapper}>
          {playerRegionFlag && (
            <img
              className={classes.flag}
              src={playerRegionFlag}
              alt={
                player.region === 1 ? "US" : player.region === 2 ? "EU" : "KR"
              }
            />
          )}

          {player.league && (
            <img
              className={classes.avatarLeague}
              src={playerLeagueLogo}
              alt={playerLeagueName}
            />
          )}
        </div>
        {!error ? (
          <img
            className={`${classes.avatar} ${classes.logo}`}
            src={defaultPlayer}
            alt={player.username}
            onLoad={(e) => {
              if (!e.currentTarget.classList.contains("error")) {
                playerLogo
                  ? (e.currentTarget.src = playerLogo)
                  : (e.currentTarget.src = defaultPlayer);
              }
            }}
            onError={(e) => {
              if (!e.currentTarget.classList.contains("error")) {
                e.currentTarget.src = defaultPlayer;
                e.currentTarget.classList.add("error");
              }
            }}
          />
        ) : (
          <img
            className={`${classes.avatar} ${classes.logo}`}
            src={defaultPlayer}
            alt={player.username}
          />
        )}
        <div>
          <h3>{player.username}</h3>
          <p>MMR: {player.mmr}</p>
        </div>
      </div>
      <div className={classes.selectWrapper}>
        <select
          onClick={(e) => e.stopPropagation()}
          value={player.race.toString()}
          onChange={(e) => {
            dispatch(
              updatePlayerField({
                playerId: player.id,
                field: "race",
                value: Number(e.target.value),
              })
            );
          }}
          className={classes.select}
          name="race"
          id={`race_${player.id}`}
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
    </div>
  );
};

export default PlayerItem;
