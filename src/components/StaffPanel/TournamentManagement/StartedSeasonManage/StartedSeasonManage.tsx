import Button7x from 'components/UI/Button7x/Button7x';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { SeasonApi } from 'services/SeasonService';
import classes from './StartedSeasonManage.module.scss';
import { FormattedMessage } from 'react-intl';
import {    setLocalTime, 
            selectLocalTime,
            setGlobalTime,
            selectGlobalTime,
            setCanRegister,
            selectCanRegister,
            setIsInitialLoadFirst,
            selectIsInitialLoad
             } from 'store/reducers/AccountSlice';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import Timer from 'components/Timer/Timer';


interface StartedSeasonManageProps {
    setSeasonStarted: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    timeZoneOffsetString: string;
}

const StartedSeasonManage: React.FC<StartedSeasonManageProps> = ({...props}) => {
    const {data: currentSeason, } = SeasonApi.useFetchCurrentSeasonQuery();
    const [seasonNumber, setSeasonNumber] = useState<number | undefined>(undefined);
    const [cookies, ] = useCookies(['token']);
    const [changeTime, {}] = SeasonApi.useChangeDatetimeMutation();
    const [changeIsFinished, {}] = SeasonApi.useChangeIsFinishedMutation();
    const [changeCanRegister, {}] = SeasonApi.useChangeCanRegisterMutation();
    const [askForFinished, setAskForFinished] = useState<boolean>(false);
    const localTime = useAppSelector(selectLocalTime);
    const globalTime = useAppSelector(selectGlobalTime);
    const canRegister = useAppSelector(selectCanRegister);
    const isInitialLoad = useAppSelector(selectIsInitialLoad);
    const dispatch = useAppDispatch();
    let setDateTimeout: NodeJS.Timeout | null = null;

    useEffect(() => {
        if (currentSeason && isInitialLoad[0]) {
            dispatch(setLocalTime(moment.utc(currentSeason.start_datetime).local().format('YYYY-MM-DDTHH:mm')));
            dispatch(setGlobalTime(currentSeason.start_datetime));
            dispatch(setCanRegister(currentSeason.can_register));
            dispatch(setIsInitialLoadFirst(false));       
        }
    }, [currentSeason, isInitialLoad]);

    useEffect(() => {
        if (currentSeason) {
            setSeasonNumber(currentSeason.number);
        }
    }, [currentSeason])

  return (
    <div className={`${classes.form} ${askForFinished ? classes.formAskForFinished : ''}`}>
        <h2><FormattedMessage id='manage_started_season' values={{season: seasonNumber}} /></h2>
        <div className={classes.form_content}>
            <label className={classes.label} htmlFor="datetime"><FormattedMessage id='tournament_start' />(UTC {props.timeZoneOffsetString}): </label>
            <input id="datetime" className={classes.input} type="datetime-local" defaultValue={localTime ? localTime : ''} onChange={(e) => {
                if (setDateTimeout) {
                    clearTimeout(setDateTimeout);
                }
                setDateTimeout = setTimeout(() => {
                    changeTime({
                        token: cookies.token,
                        datetime: new Date(e.target.value).toISOString(),
                        season: seasonNumber ? seasonNumber : 0 
                });
                    dispatch(setLocalTime(e.target.value));
                    dispatch(setGlobalTime(new Date(e.target.value).toISOString()));
            }, 3000)}} />
        </div>
            {globalTime && <Timer datetime={globalTime} />}
        <div className={classes.form_content}>
            <label className={classes.label} htmlFor="can_register"><FormattedMessage id='open_registration' /></label>
                {canRegister !== null && <input className={classes.input} id="can_register" type="checkbox" checked={canRegister ? canRegister : false} onChange={(e) => {
                dispatch(setCanRegister(e.target.checked));
                    changeCanRegister({
                        token: cookies.token,
                        can_register: e.target.checked,
                        season: seasonNumber ? seasonNumber : 0 
                    });
                }} />}
        </div>
        <Button7x className={classes.button} onClick={() => {
            setAskForFinished(true);
            }} ><FormattedMessage id='finish_tournament' /></Button7x>
        {askForFinished && 
        <div>
            <p className={classes.confirm_finish}><FormattedMessage id='confirm_finish' /></p>
            <div className={classes.buttons}>
                <Button7x className={classes.button} onClick={() => {
                    changeIsFinished({
                        token: cookies.token,
                        is_finished: true,
                        season: seasonNumber ? seasonNumber : 0 
                    });
                    props.setSeasonStarted(false);
                    if (seasonNumber) setSeasonNumber(seasonNumber + 1);
                }}><FormattedMessage id='yes' /></Button7x>
                <Button7x className={classes.button} onClick={() => {
                    setAskForFinished(false);
                }}><FormattedMessage id='no' /></Button7x>
            </div>
        </div>
        }
    </div>
  )
}

export default StartedSeasonManage