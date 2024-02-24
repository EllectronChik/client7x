import { FC } from "react";
import classes from "./Tournament.module.scss";
import { useParams } from "react-router";
import { TournamentApi } from "services/TournamentService";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

/**
 * Tournament Component
 * 
 * This component displays information about a specific tournament, including team details,
 * match schedules, and match results.
 */
const Tournament: FC = () => {
  const params = useParams();
  const { data: tournamentData } = TournamentApi.useFetchTournamentByIdQuery(
    params.tour ? parseInt(params.tour) : 1
  );

  return (
    <div className={classes.container}>
      {tournamentData && (
        <div className={classes.tournament}>
          <div className={classes.header}>
            <Link to={`/team/${tournamentData.tournament.teamOneId}`}>
              <div className={classes.teamInfo}>
                <img
                  className={classes.teamLogo}
                  src={
                    import.meta.env.VITE_SERVER_URL +
                    tournamentData.tournament.teamOneLogo
                  }
                  alt={tournamentData.tournament.teamOne}
                />
                <h2 className={classes.team}>
                  {tournamentData.tournament.teamOne}
                </h2>
              </div>
            </Link>
            <h2>
              {tournamentData.tournament.teamOneWins} :{" "}
              {tournamentData.tournament.teamTwoWins}
            </h2>
            <Link to={`/team/${tournamentData.tournament.teamTwoId}`}>
              <div className={classes.teamInfo}>
                <img
                  className={classes.teamLogo}
                  src={
                    import.meta.env.VITE_SERVER_URL +
                    tournamentData.tournament.teamTwoLogo
                  }
                  alt={tournamentData.tournament.teamTwo}
                />
                <h2 className={classes.team}>
                  {tournamentData.tournament.teamTwo}
                </h2>
              </div>
            </Link>
          </div>
          <div>
            <h3>
              {new Date(
                tournamentData.tournament.matchStartTime
              ).toLocaleString()}
            </h3>
          </div>
          {tournamentData.matches.map((match) => (
            <div className={classes.match} key={match.id}>
              <div className={classes.matchInfo}>
                <Link to={`/player/${match.playerOneId}`}>
                  <h3
                    className={`${classes.team} ${
                      match.winner === true ? classes.winner : ""
                    }`}
                  >
                    {match.playerOne}
                  </h3>
                </Link>
                <h3 className={classes.vs}>vs</h3>
                <Link to={`/player/${match.playerTwoId}`}>
                  <h3
                    className={`${classes.team} ${
                      match.winner === false ? classes.winner : ""
                    }`}
                  >
                    {match.playerTwo}
                  </h3>
                </Link>
              </div>
              <h3>
                <FormattedMessage id="mapLabel" />: {match.map}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tournament;
