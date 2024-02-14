import { FC } from "react";
import { ClanApi } from "services/ClanService";
import { selectPlayers, setPlayers } from "store/reducers/ClanSlice";
import { useAppSelector, useAppDispatch } from "hooks/reduxHooks";
import classes from "./AddPlayers.module.scss";
import InClanPlayerBox from "components/InClanPlayerBox/InClanPlayerBox";
import { PlayerApi } from "services/PlayerService";
import { useCookies } from "react-cookie";
import Loader7x from "components/UI/Loader7x/Loader7x";
import { FormattedMessage } from "react-intl";

interface IProps {
  clantag: string;
}

const AddPlayers: FC<IProps> = ({ clantag }) => {
  const players = useAppSelector(selectPlayers);
  const dispatch = useAppDispatch();
  const [cookies] = useCookies(["token", "userId"]);
  const { data: newPlayers, isLoading } =
    ClanApi.useFetchClanMembersQuery(clantag);
  const { data: myTeam } = ClanApi.useFetchClanByManagerQuery(cookies.userId);
  const [postPlayer, {}] = PlayerApi.usePostPlayerMutation();

  return (
    <div>
      {!isLoading && (
        <div className={classes.container}>
          <div className={classes.textBox}>
            <h3>
              <FormattedMessage id="clickOnPlayer" />
            </h3>
            <h3>
              <FormattedMessage id="newPlayerAvatars" />
            </h3>
          </div>
          {newPlayers &&
            newPlayers.map((player) => {
              if (
                players.findIndex(
                  (p) => p.battlenet_id === player.id || p.id === player.id
                ) === -1
              )
                return (
                  <InClanPlayerBox
                    className={classes.playerBox}
                    key={player.id}
                    onClick={() => {
                      const playerData = {
                        id: player.id,
                        realm: player.realm,
                        region: player.region,
                        selected: player.selected,
                        username: player.username,
                        mmr: player.mmr,
                        race: player.race,
                        league: player.league,
                        avatar: "",
                        team: myTeam?.teamId ? myTeam.teamId : 0,
                        total_games: 0,
                        wins: 0,
                        user: cookies.userId,
                      };

                      dispatch(setPlayers([...players, player]));
                      postPlayer({ player: playerData, token: cookies.token });
                    }}
                    player={player}
                  />
                );
            })}
        </div>
      )}
      {isLoading && (
        <div className={classes.container}>
          <Loader7x />
        </div>
      )}
    </div>
  );
};

export default AddPlayers;
