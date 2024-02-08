import moment from "moment";
import { useEffect, useState, FC, HTMLAttributes } from "react";
import { FormattedPlural, useIntl } from "react-intl";

interface TimerProps extends HTMLAttributes<HTMLDivElement> {
  datetime: string;
}

interface ITimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Timer: FC<TimerProps> = ({ ...props }) => {
  const intl = useIntl();
  const calculateTimeLeft = () => {
    const now = moment.utc();
    const target = moment.utc(props.datetime);
    const duration = moment.duration(target.diff(now));

    return {
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  };

  const [timeLeft, setTimeLeft] = useState<ITimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [props.datetime]);

  return (
    <div>
      {timeLeft.days > 0 && (
        <span>
          {timeLeft.days}
          <span> </span>
          <FormattedPlural
            value={timeLeft.days}
            one={intl.formatMessage({ id: "daySingle" })}
            few={intl.formatMessage({ id: "dayFew" })}
            other={intl.formatMessage({ id: "dayPlural" })}
          />{" "}
        </span>
      )}
      {timeLeft.hours > 0 && (
        <span>
          {timeLeft.hours}
          <span> </span>
          <FormattedPlural
            value={timeLeft.hours}
            one={intl.formatMessage({ id: "hourSingle" })}
            few={intl.formatMessage({ id: "hourFew" })}
            other={intl.formatMessage({ id: "hourPlural" })}
          />{" "}
        </span>
      )}
      {timeLeft.minutes > 0 && (
        <span>
          {timeLeft.minutes}
          <span> </span>
          <FormattedPlural
            value={timeLeft.minutes}
            one={intl.formatMessage({ id: "minuteSingle" })}
            few={intl.formatMessage({ id: "minuteFew" })}
            other={intl.formatMessage({ id: "minutePlural" })}
          />{" "}
        </span>
      )}
      {timeLeft.seconds > 0 && (
        <span>
          {timeLeft.seconds}
          <span> </span>
          <FormattedPlural
            value={timeLeft.seconds}
            one={intl.formatMessage({ id: "secondSingle" })}
            few={intl.formatMessage({ id: "secondFew" })}
            other={intl.formatMessage({ id: "secondPlural" })}
          />{" "}
        </span>
      )}
    </div>
  );
};

export default Timer;
