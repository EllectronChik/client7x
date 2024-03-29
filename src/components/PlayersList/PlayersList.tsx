import { useEffect, useState, useRef, FC, JSX, DragEvent } from "react";
import axios from "axios";
import { ClanApi } from "services/ClanService";
import { IPlayer } from "models/IPlayer";
import { regionApi } from "services/regionService";
import { IResorce } from "models/IResorce";
import { useCookies } from "react-cookie";
import { PlayerApi } from "services/PlayerService";
import { ClanResourcesApi } from "services/ClanResourcesService";
import { ManagerApi } from "services/ManagerSerevice";
import Loader7x from "../UI/Loader7x/Loader7x";
import PlayerItem from "../PlayerItem/PlayerItem";
import classes from "./PlayersList.module.scss";
import Button7x from "./../UI/Button7x/Button7x";
import Input7x from "components/UI/Input7x/Input7x";
import Select from "react-select";
import ReloadinWarning from "components/UI/ReloadinWarning";
import important from "assets/images/techImages/important.svg";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { cancelAllLogoRequests } from "services/PlayerLogoService";
import { setClan, updateClanField, selectClan } from "store/reducers/ClanSlice";
import {
  updatePlayerList,
  selectPlayerList,
  updatePlayerField,
} from "store/reducers/PlayerListSlice";
import { setPageManager } from "store/reducers/pageManagerSlice";
import { handleAddPlayerForm } from "components/PlayerUtils/ManualPlayer";
import { handleAddMediaForm } from "components/ClanUtils/MediaForm";
import { FormattedMessage, useIntl } from "react-intl";
import { setIsManager } from "store/reducers/AccountSlice";

interface PlayersListProps {
  tag: string;
}

/**
 * PlayersList component
 * 
 * This component displays a list of players, allowing the user to select players for a clan and create a new clan with selected players.
 * 
 * @param tag - A string representing the tag of the clan.
 */
const PlayersList: FC<PlayersListProps> = ({ tag }) => {
  const dispatch = useAppDispatch();
  const clan = useAppSelector(selectClan);
  const playersSliceList = useAppSelector(selectPlayerList);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cookies] = useCookies(["token", "userId"]);

  const [clanExists, setClanExists] = useState<boolean>(false);
  const [drag, setDrag] = useState<boolean>(false);
  const [clanLogo, setClanLogo] = useState<File | null>(null);
  const [resorces, setResorces] = useState<IResorce[]>([]);
  const [manualPlayers, setManualPlayers] = useState<IPlayer[]>([]);
  const [resForms, setResForms] = useState<JSX.Element[]>([]);
  const [playerForms, setPlayerForms] = useState<JSX.Element[]>([]);
  const [isClanCreating, setIsClanCreating] = useState<boolean>(false);
  const [managerLinksCnt, setManagerLinksCnt] = useState<number>(1);
  const [managerUrls, setManagerUrls] = useState<{ [key: number]: string }>({});
  const {
    data: players,
    isLoading,
    error: ClanFetchError,
  } = ClanApi.useFetchClanMembersQuery(tag);
  const { data: regions } = regionApi.useFetchAllRegionsQuery();
  const [createClan, { error: createClanError, isLoading: createClanLoading }] =
    ClanApi.usePostClanMutation();
  const [postPlayer, {}] = PlayerApi.usePostPlayerMutation();
  const [postResource, {}] = ClanResourcesApi.usePostClanResourceMutation();
  const [postManager, {}] = ManagerApi.usePostManagerMutation();
  const [postManagerContacts, {}] = ManagerApi.usePostManagerContactsMutation();
  const intl = useIntl();

  useEffect(() => {
    dispatch(
      setClan({
        tag: tag,
        name: tag,
        logo: null,
        region: 0,
        user: cookies.userId,
      })
    );
  }, []);

  useEffect(() => {
    if (players)
      dispatch(
        updatePlayerList(
          players.map((player: IPlayer) => ({
            id: player.id,
            username: player.username,
            race: player.race,
            league: player.league,
            region: player.region,
            avatar: "",
            mmr: player.mmr,
            wins: 0,
            total_games: 0,
            realm: player.realm,
            team: player.team,
            user: cookies.userId,
            selected: false,
          }))
        )
      );
  }, [players]);

  useEffect(() => {
    if (manualPlayers && players && players.length > 0) {
      dispatch(
        updatePlayerList(
          manualPlayers.map((player: IPlayer) => {
            const mappedPlayer = {
              id: player.id + players.length,
              username: player.username,
              race: player.race,
              league: playersSliceList[player.id + players.length]
                ? playersSliceList[player.id + players.length].league
                : 0,
              region: player.region,
              avatar: "",
              mmr: player.mmr,
              wins: 0,
              total_games: 0,
              realm: player.realm,
              team: player.team,
              user: cookies.userId,
              selected: true,
            };

            return mappedPlayer;
          })
        )
      );
    } else {
      dispatch(
        updatePlayerList(
          manualPlayers.map((player: IPlayer) => {
            const mappedPlayer = {
              id: player.id,
              username: player.username,
              race: player.race,
              league: playersSliceList[player.id]
                ? playersSliceList[player.id].league
                : 0,
              region: player.region,
              avatar: "",
              mmr: player.mmr,
              wins: 0,
              total_games: 0,
              realm: player.realm,
              team: player.team,
              user: cookies.userId,
              selected: true,
            };

            return mappedPlayer;
          })
        )
      );
    }
  }, [manualPlayers]);

  useEffect(() => {
    document.title = intl.formatMessage({ id: "team_manage" });
  }, [intl]);

  const handleCreateClan = async () => {
    if (!clan) {
      return;
    }

    const clanData = {
      tag: clan.tag,
      name: clan.name,
      logo: clanLogo,
      region: clan.region,
      user: cookies.userId,
    };

    cancelAllLogoRequests();

    try {
      if (
        (
          await axios.get(
            `${import.meta.env.VITE_API_URL}teams/?tag=${clan.tag}`
          )
        ).data.results.length > 0
      ) {
        setIsClanCreating(false);
        setClanExists(true);
        return;
      }
      await createClan({ clan: clanData, token: cookies.token });
      setIsClanCreating(true);

      const createdClan = await axios.get(
        `${import.meta.env.VITE_API_URL}teams/?tag=${clan.tag}`
      );

      if (playersSliceList.filter((player) => player.selected) && createdClan) {
        await Promise.all(
          playersSliceList
            .filter((player) => player.selected)
            .map(async (player) => {
              const playerData = { ...player };
              if (!player) {
                return;
              }
              playerData.avatar =
                playersSliceList?.find((p) => p.id === player.id)?.avatar || "";
              playerData.team = createdClan.data.results[0].id;

              await postPlayer({ player: playerData, token: cookies.token });
            })
        );
        await Promise.all(
          resorces.map(async (resource) => {
            const resourceData: IResorce = { ...resource };
            if (!resource) {
              return;
            }
            resourceData.team = createdClan.data.results[0].id;
            resourceData.user = cookies.userId;
            await postResource({
              resource: resourceData,
              token: cookies.token,
            });
          })
        ),
          await postManager({
            manager: {
              team: createdClan.data.results[0].id,
              user: cookies.userId,
            },
            token: cookies.token,
          });

        await postManagerContacts({
          token: cookies.token,
          urls: Object.values(managerUrls),
        });
        dispatch(setIsManager(true));
        dispatch(setPageManager(1));
      }
    } catch (error) {
      setIsClanCreating(false);
    }
  };

  const handleLogoDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLogoDivDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setClanLogo(e.dataTransfer.files[0]);
    setDrag(false);
  };

  const handleLogoDivDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(true);
  };

  const handleLogoDivDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
  };

  const regionOptions = regions?.map((region) => ({
    label: region.name,
    value: region.id,
  }));

  return (
    <div className={classes.container}>
      {!isClanCreating ? (
        <div className={classes.clanBox}>
          <form className={classes.clanInfo}>
            <h2 className={classes.clanInfoTitle}>
              <FormattedMessage id="enterClanData" />
            </h2>
            <div className={classes.clanInfoBox}>
              <div className={classes.clanInput}>
                <label htmlFor="tag">
                  <FormattedMessage id="tag" />
                </label>
                <Input7x
                  className={classes.clanTag}
                  id="tag"
                  defaultValue={tag}
                  onChange={(e) =>
                    dispatch(
                      updateClanField({ field: "tag", value: e.target.value })
                    )
                  }
                  placeholder={intl.formatMessage({ id: "enterClanTag" })}
                />
              </div>
              <div className={classes.clanInput}>
                <label htmlFor="name">
                  <FormattedMessage id="name" />
                </label>
                <Input7x
                  className={classes.clanTag}
                  id="name"
                  defaultValue={tag}
                  onChange={(e) =>
                    dispatch(
                      updateClanField({ field: "name", value: e.target.value })
                    )
                  }
                  placeholder={intl.formatMessage({ id: "enterClanName" })}
                />
              </div>
            </div>
            <div className={classes.clanInfoBox}>
              <div className={`${classes.clanInputLogo} ${classes.clanInput}`}>
                <label htmlFor="logo">
                  <FormattedMessage id="logo" />
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="logo"
                  className={classes.logoInput}
                  onChange={(e) => {
                    if (e.target.files) setClanLogo(e.target.files[0]);
                  }}
                />
                <div
                  onClick={handleLogoDivClick}
                  onDragLeave={handleLogoDivDragLeave}
                  onDragOver={handleLogoDivDragOver}
                  onDrop={handleLogoDivDrop}
                  className={classes.logoDiv}
                >
                  {!clanLogo
                    ? drag
                      ? `${intl.formatMessage({ id: "dropLogo" })}`
                      : `${intl.formatMessage({ id: "addLogo" })}`
                    : null}
                  {clanLogo && (
                    <img src={URL.createObjectURL(clanLogo)} alt="logo" />
                  )}
                </div>
                {createClanError && !clanLogo && (
                  <div className={classes.error}>
                    <img
                      className={classes.errorIcon}
                      src={important}
                      alt="ERROR: "
                    />
                    <FormattedMessage id="requiredField" />
                  </div>
                )}
              </div>
            </div>
            <div className={classes.clanInfoBox}>
              <div
                className={`${classes.clanInput} ${classes.clanInputRegion}`}
              >
                <label>
                  <FormattedMessage id="region" />
                </label>
                <Select
                  styles={{
                    container: (baseStyles) => ({
                      ...baseStyles,
                      width: "100%",
                    }),
                    control: (baseStyles) => ({
                      ...baseStyles,
                      border: "2px solid #ff0000",
                    }),
                    option: (baseStyles) => ({
                      ...baseStyles,
                      color: "#1D1D1D",
                    }),
                    indicatorSeparator: (baseStyles) => ({
                      ...baseStyles,
                      display: "none",
                    }),
                    dropdownIndicator: (baseStyles) => ({
                      ...baseStyles,
                      backgroundColor: "#ff0000",
                    }),
                  }}
                  options={regionOptions}
                  defaultValue={{
                    label: `${intl.formatMessage({ id: "selectRegion" })}`,
                    value: 0,
                  }}
                  onChange={(selectedOption) => {
                    if (selectedOption)
                      dispatch(
                        updateClanField({
                          field: "region",
                          value: selectedOption.value,
                        })
                      );
                  }}
                />
                {clan && createClanError && !clan.region && (
                  <div className={classes.error}>
                    <img
                      className={classes.errorIcon}
                      src={important}
                      alt="ERROR: "
                    />
                    <FormattedMessage id="requiredField" />
                  </div>
                )}
              </div>
            </div>
            <div className={classes.clanInfoBox}>
              <div className={`${classes.clanInput} ${classes.clanInputMedia}`}>
                <label>
                  <FormattedMessage id="clanMedia" />
                </label>
                <div
                  onClick={() =>
                    handleAddMediaForm(resForms, setResForms, setResorces)
                  }
                  className={classes.AddTeamBox}
                >
                  <FormattedMessage id="addMedia" />
                </div>
                {resForms.map((form) => form)}
              </div>
            </div>
            <div className={classes.managerBox}>
              <h3>
                <FormattedMessage id="enterManagerContacts" />:
              </h3>
              {Array(managerLinksCnt)
                .fill(0)
                .map((_, key) => (
                  <Input7x
                    className={classes.managerInput}
                    type="text"
                    key={key}
                    placeholder={intl.formatMessage({ id: "enterLink" })}
                    onChange={(e) =>
                      setManagerUrls({
                        ...managerUrls,
                        [key]: e.target.value,
                      })
                    }
                  />
                ))}
              <button
                className={classes.addButton}
                onClick={(e) => {
                  e.preventDefault();
                  setManagerLinksCnt(managerLinksCnt + 1);
                }}
              >
                +
              </button>
            </div>
          </form>
          <ReloadinWarning />
          <div className={classes.selectedList}>
            {playersSliceList.filter((player) => player.selected).length ===
              0 &&
              !ClanFetchError && (
                <h2>
                  <FormattedMessage id="selectOnlyActivePlayers" />
                </h2>
              )}
            {playersSliceList.filter((player) => player.selected).length >
              0 && (
              <div>
                <h2 className={classes.selectedListTitle}>
                  <FormattedMessage id="selectedPlayers" />
                </h2>
                {playersSliceList
                  .filter((player) => player.selected)
                  .map((player) => (
                    <PlayerItem
                      title={intl.formatMessage({ id: "removePlayerLabel" })}
                      onClick={() => {
                        dispatch(
                          updatePlayerField({
                            playerId: player.id,
                            field: "selected",
                            value: false,
                          })
                        );
                      }}
                      key={player.id}
                      player={player}
                    />
                  ))}
                {clan && clanExists && (
                  <div className={classes.error}>
                    <img
                      className={classes.errorIcon}
                      src={important}
                      alt="ERROR: "
                    />
                    <FormattedMessage
                      id="clanExists"
                      values={{ tag: clan.tag }}
                    />
                  </div>
                )}
                {!createClanLoading && (
                  <div className={classes.selectedListButtons}>
                    <Button7x
                      className={classes.lightBtn}
                      onClick={() => {
                        playersSliceList.map((player) => {
                          () =>
                            dispatch(
                              updatePlayerField({
                                playerId: player.id,
                                field: "selected",
                                value: false,
                              })
                            );
                        });
                      }}
                    >
                      <FormattedMessage id="clearSelected" />
                    </Button7x>
                    <Button7x
                      className={`${classes.submitButton} ${classes.lightBtn}`}
                      onClick={handleCreateClan}
                    >
                      <FormattedMessage id="submit" />
                    </Button7x>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className={classes.techInfo}>
            {(isLoading || createClanLoading) && <Loader7x />}
            {ClanFetchError &&
              "status" in ClanFetchError &&
              ClanFetchError.status === "FETCH_ERROR" && (
                <h1>
                  {" "}
                  <FormattedMessage id="serverDoNotRespond" />{" "}
                </h1>
              )}
          </div>
          <div>
            {!createClanLoading &&
              playersSliceList
                .filter((player) => player.selected === false)
                ?.map((player) => (
                  <PlayerItem
                    title={intl.formatMessage({ id: "addPlayerLabel" })}
                    onClick={() => {
                      dispatch(
                        updatePlayerField({
                          playerId: player.id,
                          field: "selected",
                          value: true,
                        })
                      );
                    }}
                    key={player.id}
                    player={player}
                  />
                ))}
          </div>
          {!isLoading &&
            (players ? (
              <div className={`${classes.techInfo} ${classes.techInfoBottom}`}>
                <h2>
                  <FormattedMessage id="addPlayerManually" />
                </h2>
              </div>
            ) : (
              <div className={classes.techInfo}>
                <h3>
                  <FormattedMessage
                    id="didNotFindClan"
                    values={{ br: <br /> }}
                  />
                </h3>
              </div>
            ))}
          <div className={classes.addPlayerButton}>
            <Button7x
              className={classes.lightBtn}
              onClick={() => {
                handleAddPlayerForm(
                  playerForms,
                  setPlayerForms,
                  manualPlayers,
                  setManualPlayers,
                  players ? players : [],
                  dispatch,
                  cookies,
                  intl
                );
              }}
            >
              <FormattedMessage id="addPlayer" />
            </Button7x>
          </div>
          {playerForms.map((form) => form)}
        </div>
      ) : (
        <Loader7x />
      )}
    </div>
  );
};

export default PlayersList;
