import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { FormattedPlural, useIntl } from 'react-intl';
import classes from './Timer.module.scss';


interface TimerProps extends React.HTMLAttributes<HTMLDivElement> {
    datetime: string,
}

interface ITimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const Timer: React.FC<TimerProps> = ({...props}) => {
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
    }

    const [timeLeft, setTimeLeft] = useState<ITimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [props.datetime])

  return (
    <div className={classes.timer}>
        {timeLeft.days > 0 &&
        <span>{timeLeft.days}<span> </span>
        <FormattedPlural value={timeLeft.days}
        one={intl.formatMessage({id: 'day_single'})} 
        few={intl.formatMessage({id: 'day_few'})}
        other={intl.formatMessage({id: 'day_plural'})}/> </span>}
        {timeLeft.hours > 0 &&
        <span>{timeLeft.hours}<span> </span>
        <FormattedPlural value={timeLeft.hours}
        one={intl.formatMessage({id: 'hour_single'})}
        few={intl.formatMessage({id: 'hour_few'})}
        other={intl.formatMessage({id: 'hour_plural'})}/> </span>}
        {timeLeft.minutes > 0 &&
        <span>{timeLeft.minutes}<span> </span>
        <FormattedPlural value={timeLeft.minutes}
        one={intl.formatMessage({id: 'minute_single'})}
        few={intl.formatMessage({id: 'minute_few'})}
        other={intl.formatMessage({id: 'minute_plural'})}/> </span>}
        {timeLeft.seconds > 0 &&
        <span>{timeLeft.seconds}<span> </span>
        <FormattedPlural value={timeLeft.seconds}
        one={intl.formatMessage({id: 'second_single'})}
        few={intl.formatMessage({id: 'second_few'})}
        other={intl.formatMessage({id: 'second_plural'})}/> </span>}
    </div>
  )
}

export default Timer