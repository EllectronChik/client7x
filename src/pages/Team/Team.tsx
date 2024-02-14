import { FC, useEffect, useState } from "react";
import { useParams } from "react-router";
import classes from "./Team.module.scss";
import { ClanApi } from "services/ClanService";
import { IResorce } from "models/IResorce";
import playerDefault from "assets/images/player/default.svg";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const Team: FC = () => {
  const params = useParams();
  const { data: teamData } = ClanApi.useFetchClanDataQuery(
    parseInt(params.team ? params.team : "1")
  );
  const [shownLinks, setShownLinks] = useState<IResorce[]>([]);
  const [showBtn, setShowBtn] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (teamData) {
      document.title = `${teamData.team.name}`;
      if (teamData.teamResources.length > 3) {
        setShownLinks([...teamData.teamResources.slice(0, 2)]);
      } else if (teamData.teamResources.length <= 3) {
        setShownLinks([...teamData.teamResources]);
      }
    }
  }, [teamData]);

  return (
    <div className={classes.container}>
      {teamData && (
        <div className={classes.team}>
          <div className={classes.header}>
            <div className={classes.teamInfo}>
              <div className={classes.teamData}>
                <img
                  className={classes.teamLogo}
                  src={`${import.meta.env.VITE_SERVER_URL}${
                    teamData.team.logo
                  }`}
                  alt={teamData.team.name}
                />
                <div>
                  <h2>{teamData.team.name}</h2>
                  <h3>&lt;{teamData.team.tag}&gt;</h3>
                </div>
              </div>
              <img
                className={classes.teamFlag}
                src={`${import.meta.env.VITE_SERVER_URL}${
                  teamData.teamRegion.url
                }`}
                alt={teamData.teamRegion.name}
              />
            </div>
            <div className={classes.teamResources}>
              {shownLinks.map((resource) => (
                <div className={classes.teamResourceBox} key={resource.id}>
                  <a target="_blank" href={resource.url}>
                    <h3 className={classes.teamResource}>{resource.name}</h3>
                  </a>
                </div>
              ))}
              {teamData.teamResources.length < 3 &&
                Array.from({ length: 3 - shownLinks.length }).map((_, i) => (
                  <div
                    className={`${classes.teamResourceBox} ${classes.empty}`}
                    key={i}
                  />
                ))}
              {teamData.teamResources.length > 3 && (
                <div className={classes.teamResourceBox}>
                  <button>
                    <h3
                      onClick={() => setShowBtn(!showBtn)}
                      className={classes.teamResource}
                    >
                      Show more media
                    </h3>
                  </button>
                </div>
              )}
            </div>
            {showBtn && (
              <div className={classes.teamLinks}>
                {teamData.teamResources.map((resource) => {
                  if (shownLinks.includes(resource)) return null;
                  return (
                    <a target="_blank" href={resource.url}>
                      <h3 className={classes.teamResource}>{resource.name}</h3>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
          <div className={classes.buttons}>
            <button
              className={`${page === 1 ? classes.active : ""} ${
                classes.button
              }`}
              onClick={() => setPage(1)}
            >
              <h3>
                <FormattedMessage id="players" />
              </h3>
            </button>
            <button
              className={`${page === 2 ? classes.active : ""} ${
                classes.button
              }`}
              onClick={() => setPage(2)}
            >
              <h3>
                <FormattedMessage id="tournaments" />
              </h3>
            </button>
          </div>
          {page === 1 && (
            <div className={classes.players}>
              {teamData.players.map((player) => (
                <Link
                  to={`/player/${player.id}`}
                  key={player.id}
                  className={classes.player}
                >
                  <div className={classes.playerAvatarBox}>
                    <img
                      draggable={false}
                      src={playerDefault}
                      alt={player.username}
                      className={classes.playerAvatar}
                      onLoad={(e) => {
                        if (!e.currentTarget.classList.contains("error")) {
                          player.avatar
                            ? (e.currentTarget.src = player.avatar)
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
                    <div className={classes.playerInfo}>
                      <h3>{player.username}</h3>
                      <h3>MMR: {player.mmr}</h3>
                    </div>
                  </div>
                  <div className={classes.playerStats}>
                    <h3>
                      <FormattedMessage id="totalGames" />: {player.total_games}
                    </h3>
                    <h3>
                      <FormattedMessage id="wins" />: {player.wins}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {page === 2 && (
            <div className={classes.tours}>
              <div className={classes.tourHeader}>
                <h3 className={classes.col}>
                  <FormattedMessage id="opponentLabel" />
                </h3>
                <h3 className={classes.col}>
                  <FormattedMessage id="score" />
                </h3>
                <h3 className={classes.col}>
                  <FormattedMessage id="date" />
                </h3>
              </div>
              {teamData.tournaments.map((tour) => (
                <Link
                  to={`/tour/${tour.id}`}
                  key={tour.id}
                  className={classes.tour}
                >
                  <h3 className={classes.col}>{tour.opponent}</h3>
                  <h3 className={classes.col}>
                    {tour.wins} : {tour.opponentWins}
                  </h3>
                  <h3 className={classes.col}>
                    {new Date(tour.matchStartTime).toLocaleString()}
                  </h3>
                </Link>
              ))}
            </div>
          )}
          <div className={classes.teamManager}>
            <h3>
              <FormattedMessage id="teamManager" />: {teamData.manager}
            </h3>
            {Object.keys(teamData.managerContacts).length > 0 && (
              <div>
                <h3>
                  <FormattedMessage id="managerContacts" />:
                </h3>
                {teamData.managerContacts.map((contact) => (
                  <a
                    key={contact.id}
                    href={`${contact.url}`}
                    target="_blank"
                    className={classes.contact}
                  >
                    {contact.url.replace(/^(http:\/\/|https:\/\/)/, "")}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
