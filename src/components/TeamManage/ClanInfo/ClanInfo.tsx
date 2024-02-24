import { useEffect, useRef, useState, FC } from "react";
import { useCookies } from "react-cookie";
import { ClanApi } from "services/ClanService";
import teamDefault from "@assets/images/team/teamDefault.webp";
import classes from "./ClanInfo.module.scss";
import {
  selectTeamRegistred,
  addRegPlayer,
  selectRegPlayers,
} from "store/reducers/AccountSlice";
import { selectPlayers, setPlayers } from "store/reducers/ClanSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { PlayerApi } from "services/PlayerService";
import Button7x from "components/UI/Button7x/Button7x";
import AddPlayers from "./AddPlayers/AddPlayers";
import InClanPlayerBox from "components/InClanPlayerBox/InClanPlayerBox";
import EditLinks from "./EditLinks/EditLinks";
import { SeasonApi } from "services/SeasonService";
import { FormattedMessage } from "react-intl";

/**
 * ClanInfo Component
 * 
 * This component represents the management interface for a clan/team. It allows users
 * to view and modify various aspects of the clan/team, such as logo, name, tag, players,
 * and links.
 */
const ClanInfo: FC = () => {
  const [cookies] = useCookies(["userId", "token"]);
  const { data: myTeam } = ClanApi.useFetchClanByManagerQuery(cookies.userId);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [changeLogo, {}] = ClanApi.useChangeLogoMutation();
  const [changeName, {}] = ClanApi.useChangeNameMutation();
  const [changeTag, {}] = ClanApi.useChangeTagMutation();
  const regPlayers = useAppSelector(selectRegPlayers);
  const teamRegistred = useAppSelector(selectTeamRegistred);
  const { data: currentTournament } = SeasonApi.useFetchCurrentSeasonQuery();
  const [managePage, setManagePage] = useState<number>(0);
  const [setPlayerToSeason, {}] = PlayerApi.usePostPlayerToSeasonMutation();
  const players = useAppSelector(selectPlayers);
  const [teamLogoUrl, setTeamLogoUrl] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  let changeNameTimeout: NodeJS.Timeout;
  let changeTagTimeout: NodeJS.Timeout;

  useEffect(() => {
    if (myTeam) {
      dispatch(setPlayers(myTeam.players));
      setTeamLogoUrl(`${import.meta.env.VITE_SERVER_URL}${myTeam.teamLogoUrl}`);
      if (tagInputRef.current) {
        const textWidth = getTextWidth(myTeam.teamTag);
        tagInputRef.current.style.width = `${textWidth}px`;
      }
    }
  }, [myTeam]);

  const getTextWidth = (text: string) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context!.font = window.getComputedStyle(tagInputRef.current!).font;
    const width = context!.measureText(text).width;
    return width;
  };

  return (
    <div className={classes.teamManage}>
      {myTeam && (
        <div className={classes.teamInfo}>
          <div
            className={classes.teamLogoBox}
            onClick={() => logoInputRef.current?.click()}
          >
            <img
              src={teamDefault}
              alt={myTeam.teamName}
              className={classes.teamLogo}
              onLoad={(e) => {
                e.currentTarget.src = teamLogoUrl ? teamLogoUrl : teamDefault;
              }}
            />
            <input
              ref={logoInputRef}
              type="file"
              className={classes.editLogo}
              onChange={(e) => {
                changeLogo({
                  teamId: myTeam.teamId,
                  logo: e.target.files![0],
                  token: cookies.token,
                });
                setTeamLogoUrl(URL.createObjectURL(e.target.files![0]));
              }}
            />
          </div>
          <div>
            <input
              className={classes.teamName}
              defaultValue={myTeam.teamName}
              onChange={(e) => {
                if (changeNameTimeout) {
                  clearTimeout(changeNameTimeout);
                }
                changeNameTimeout = setTimeout(() => {
                  changeName({
                    teamId: myTeam.teamId,
                    name: e.target.value,
                    token: cookies.token,
                  });
                }, 1000);
              }}
            />
            <div>
              <span>&lt;</span>
              <input
                ref={tagInputRef}
                className={classes.teamTag}
                defaultValue={myTeam.teamTag}
                onChange={(e) => {
                  if (changeTagTimeout) {
                    clearTimeout(changeTagTimeout);
                  }
                  changeTagTimeout = setTimeout(() => {
                    changeTag({
                      teamId: myTeam.teamId,
                      tag: e.target.value,
                      token: cookies.token,
                    });
                  }, 1000);
                  if (tagInputRef.current) {
                    const textWidth = getTextWidth(e.target.value);
                    tagInputRef.current.style.width = `${textWidth}px`;
                  }
                }}
              />
              <span>&gt;</span>
            </div>
          </div>
          <div className={classes.regionFlag}>
            <img
              draggable={false}
              src={`${import.meta.env.VITE_SERVER_URL}${myTeam.teamRegionFlag}`}
              alt={myTeam.teamRegionName}
            />
          </div>
        </div>
      )}
      <div className={classes.teamContent}>
        <div className={classes.playersInfo}>
          {teamRegistred && (
            <h3 className={classes.playersInfoTitle}>
              <FormattedMessage id="clickOnPlayerToAdd" />
            </h3>
          )}
          {players &&
            players.map((player, index) => (
              <InClanPlayerBox
                className={`${
                  regPlayers.find((p) => p.id === player.id)
                    ? ""
                    : classes.playerNotRegistred
                }`}
                key={index}
                player={player}
                onClick={() => {
                  {
                    if (
                      teamRegistred &&
                      !regPlayers.find((p) => p.id === player.id)
                    ) {
                      setPlayerToSeason({
                        player_id: player.id,
                        token: cookies.token,
                        season: currentTournament?.number ?? 0,
                      });
                      dispatch(addRegPlayer(player));
                    }
                  }
                }}
              />
            ))}
          <div className={classes.manageBtns}>
            <Button7x
              className={classes.manageBtn}
              onClick={() => setManagePage(managePage === 1 ? 0 : 1)}
            >
              <FormattedMessage id="addPlayers" />
            </Button7x>
            <Button7x
              className={classes.manageBtn}
              onClick={() => setManagePage(managePage === 2 ? 0 : 2)}
            >
              <FormattedMessage id="editLinks" />
            </Button7x>
          </div>
          {managePage === 1 && myTeam && myTeam.teamTag && (
            <AddPlayers clantag={myTeam.teamTag} />
          )}
          {managePage === 2 && myTeam && (
            <EditLinks
              managerResources={myTeam.managerResources}
              teamResources={myTeam.teamResources}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClanInfo;
