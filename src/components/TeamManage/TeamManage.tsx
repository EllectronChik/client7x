import { useEffect, useState, FC, lazy, Suspense } from "react";
import ClanInfo from "./ClanInfo/ClanInfo";
import Participate from "./Participate/Participate";
import classes from "./TeamManage.module.scss";
import { SeasonApi } from "services/SeasonService";
import moment from "moment";
import { ClanApi } from "services/ClanService";
import { useCookies } from "react-cookie";
import { useIntl } from "react-intl";
import Loader7x from "components/UI/Loader7x/Loader7x";
const TournamentProgress = lazy(
  () => import("./TournamentProgress/TournamentProgress")
);

/**
 * TeamManage Component
 *
 * This component is responsible for managing a team within a tournament. It displays information about the team,
 * allows the team to participate in upcoming tournaments, and shows the progress of the team during ongoing tournaments.
 */
const TeamManage: FC = () => {
  const [cookies] = useCookies(["userId", "token"]);
  const intl = useIntl();
  const { data: currentTournament } = SeasonApi.useFetchCurrentSeasonQuery();
  const { data: myTeam } = ClanApi.useFetchClanByManagerQuery(cookies.userId);
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [currentDateTime]);

  useEffect(() => {
    if (
      myTeam &&
      myTeam.isRegToCurrentSeason &&
      currentTournament &&
      moment(currentDateTime).isAfter(currentTournament.start_datetime)
    ) {
      document.title = intl.formatMessage({ id: "tournamentProgressTitle" });
    } else {
      document.title = intl.formatMessage({ id: "team_manage" });
    }
  }, [intl, myTeam]);

  return (
    <div className={classes.teamManage}>
      <ClanInfo />
      {myTeam &&
        currentTournament &&
        moment(currentDateTime).isBefore(currentTournament.start_datetime) && (
          <Participate />
        )}
      {myTeam &&
        myTeam.isRegToCurrentSeason &&
        currentTournament &&
        moment(currentDateTime).isAfter(currentTournament.start_datetime) && (
          <Suspense fallback={<Loader7x />}>
            <TournamentProgress />
          </Suspense>
        )}
    </div>
  );
};

export default TeamManage;
