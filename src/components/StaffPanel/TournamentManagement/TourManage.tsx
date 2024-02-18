import Loader7x from "components/UI/Loader7x/Loader7x";
import { useEffect, useState, FC } from "react";
import StartSeason from "./StartSeason/StartSeason";
import { SeasonApi } from "services/SeasonService";
import StartedSeasonManage from "./StartedSeasonManage/StartedSeasonManage";
import GroupDistribution from "./GroupDistribution/GroupDistribution";
import classes from "./TourManage.module.scss";
import MatchDistribution from "./MatchDistribution/MatchDistribution";
import moment from "moment";
import TournamentAdminProgress from "./TournamentAdminProgress/TournamentAdminProgress";
import { useIntl } from "react-intl";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from "react-device-detect";

const TourManage: FC = () => {
  const {
    data: currentSeason,
    isLoading: currentSeasonLoading,
    error: currentSeasonError,
  } = SeasonApi.useFetchCurrentSeasonQuery();
  const [seasonStarted, setSeasonStarted] = useState<boolean | undefined>(
    undefined
  );
  const [timeZoneOffset] = useState<number>(
    -new Date().getTimezoneOffset() / 60
  );
  const [timeZoneOffsetString, setTimeZoneOffsetString] = useState<string>(
    String(timeZoneOffset)
  );
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
  const intl = useIntl();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [currentDateTime]);

  useEffect(() => {
    if (timeZoneOffset < 0) {
      setTimeZoneOffsetString(`- ${timeZoneOffset}`);
    } else {
      setTimeZoneOffsetString(`+ ${timeZoneOffset}`);
    }
  }, [timeZoneOffset]);

  useEffect(() => {
    if (!currentSeasonLoading) {
      if (currentSeason) {
        setSeasonStarted(true);
      } else {
        setSeasonStarted(false);
      }
    }
  }, [currentSeason]);

  useEffect(() => {
    if (currentSeasonError) {
      setSeasonStarted(false);
    }
  }, [currentSeasonError]);

  useEffect(() => {
    document.title = intl.formatMessage({ id: "staff" });
  }, [intl]);

  return (
    <div className={classes.tournamentManageContainer}>
      {seasonStarted === undefined ? (
        <Loader7x />
      ) : seasonStarted === false ? (
        <StartSeason
          setSeasonStarted={setSeasonStarted}
          timeZoneOffsetString={timeZoneOffsetString}
        />
      ) : currentSeason &&
        moment(currentSeason.start_datetime).isAfter(currentDateTime) ? (
        <div className={classes.tournamentManage}>
          <div className={classes.tournamentsAdmin}>
            <StartedSeasonManage
              setSeasonStarted={setSeasonStarted}
              timeZoneOffsetString={timeZoneOffsetString}
            />
            <MatchDistribution />
          </div>
          <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <GroupDistribution />
          </DndProvider>
        </div>
      ) : (
        <div className={classes.tournamentsAdminProgress}>
          <TournamentAdminProgress />
          <StartedSeasonManage
            setSeasonStarted={setSeasonStarted}
            timeZoneOffsetString={timeZoneOffsetString}
          />
        </div>
      )}
    </div>
  );
};

export default TourManage;
