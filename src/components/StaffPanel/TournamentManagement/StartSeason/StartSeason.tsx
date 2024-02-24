import { useState, HTMLProps, FC, Dispatch, SetStateAction } from "react";
import { SeasonApi } from "services/SeasonService";
import { useCookies } from "react-cookie";
import important from "assets/images/techImages/important.svg";
import classes from "./StartSeason.module.scss";
import { FormattedMessage } from "react-intl";
import Button7x from "components/UI/Button7x/Button7x";

interface StartSeasonProps extends HTMLProps<HTMLFormElement> {
  setSeasonStarted: Dispatch<SetStateAction<boolean | undefined>>;
  timeZoneOffsetString: string;
}

/**
 * StartSeason Component
 * 
 * This component represents the form for starting a new season in the application.
 * It allows users to specify the start time for the season and initiates the process
 * to start a new season upon submission.
 * @param {StartSeasonProps} props - Props for the StartSeason component.
 * @param {Dispatch<SetStateAction<boolean | undefined>>} props.setSeasonStarted - Function to set whether a season has started.
 * @param {string} props.timeZoneOffsetString - String representing the timezone offset.
 */
const StartSeason: FC<StartSeasonProps> = ({ ...props }) => {
  const [startSeason, { error: seasonStartError }] =
    SeasonApi.useStartSeasonMutation();
  const { data: lastSeasonNumber } = SeasonApi.useFetchLastSeasonNumberQuery();
  const [cookies] = useCookies(["token"]);
  const [seasonStartErrorState, setSeasonStartErrorState] =
    useState<boolean>(false);

  return (
    <form
      className={classes.form}
      onSubmit={(e) => {
        e.preventDefault();
        if (!e.currentTarget.start_time.value) {
          setSeasonStartErrorState(true);
          return;
        }
        const isoTime = new Date(
          e.currentTarget.start_time.value
        ).toISOString();
        startSeason({
          token: cookies.token,
          season: {
            number: lastSeasonNumber ? lastSeasonNumber + 1 : 1,
            start_datetime: isoTime,
            is_finished: false,
            can_register: true,
          },
        });

        props.setSeasonStarted(true);
        window.location.reload();
      }}
    >
      <p className={classes.title}>
        <FormattedMessage id="noSeasons" />
      </p>
      {(seasonStartError || seasonStartErrorState) && (
        <div className={classes.error}>
          <img className={classes.errorIcon} src={important} alt="ERROR: " />
          <FormattedMessage id="requiredField" />
        </div>
      )}
      <div className={classes.formContent}>
        <label htmlFor="start_time">
          <FormattedMessage id="start_time" /> (UTC {props.timeZoneOffsetString}
          ){" "}
        </label>
        <input
          className={classes.input}
          id="start_time"
          type="datetime-local"
        />
      </div>
      <div>
        <Button7x type="submit">
          <FormattedMessage id="openRegistration" />
        </Button7x>
      </div>
    </form>
  );
};

export default StartSeason;
