import Button7x from 'components/UI/Button7x/Button7x';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { SeasonApi } from 'services/SeasonService';
import classes from './StartedSeasonManage.module.scss';
import { FormattedMessage } from 'react-intl';
import {    setLocalTime, 
            selectLocalTime,
            setCanRegister,
            selectCanRegister,
            setIsInitialLoadFirst,
            selectIsInitialLoad
             } from 'store/reducers/AccountSlice';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';


interface StartedSeasonManageProps {
    setSeasonStarted: React.Dispatch<React.SetStateAction<boolean | undefined>>;
    timeZoneOffsetString: string;
}

const StartedSeasonManage: React.FC<StartedSeasonManageProps> = ({...props}) => {
    const {data: currentSeason, } = SeasonApi.useFetchCurrentSeasonQuery();
    const [cookies, ] = useCookies(['token']);
    const [changeTime, {}] = SeasonApi.useChangeDatetimeMutation();
    const [changeIsFinished, {}] = SeasonApi.useChangeIsFinishedMutation();
    const [changeCanRegister, {}] = SeasonApi.useChangeCanRegisterMutation();
    const [askForFinished, setAskForFinished] = useState<boolean>(false);
    const localTime = useAppSelector(selectLocalTime);
    const canRegister = useAppSelector(selectCanRegister);
    const isInitialLoad = useAppSelector(selectIsInitialLoad);
    const dispatch = useAppDispatch();
    let setDateTimeout: NodeJS.Timeout | null = null;

    useEffect(() => {
        if (currentSeason && isInitialLoad[0]) {
            dispatch(setLocalTime(moment.utc(currentSeason.start_datetime).local().format('YYYY-MM-DDTHH:mm')));
            dispatch(setCanRegister(currentSeason.can_register));
            dispatch(setIsInitialLoadFirst(false));       
        }
    }, [currentSeason, isInitialLoad]);

  return (
    <div className={`${classes.form} ${askForFinished ? classes.formAskForFinished : ''}`}>
        <h2><FormattedMessage id='manage_started_season' values={{season: currentSeason?.number}} /></h2>
        <div>
            <label className={classes.label} htmlFor="datetime"><FormattedMessage id='tournament_start' />(UTC {props.timeZoneOffsetString}): </label>
            <input id="datetime" className={classes.input} type="datetime-local" defaultValue={localTime ? localTime : ''} onChange={(e) => {
                if (setDateTimeout) {
                    clearTimeout(setDateTimeout);
                }
                setDateTimeout = setTimeout(() => {
                    changeTime({
                        token: cookies.token,
                        datetime: new Date(e.target.value).toISOString(),
                        season: currentSeason ? currentSeason.number : 0 
                });
                    dispatch(setLocalTime(e.target.value));
            }, 3000)}} />
        </div>
        <div className={classes.form_content}>
            <label className={classes.label} htmlFor="can_register"><FormattedMessage id='open_registration' /></label>
                {canRegister !== null && <input className={classes.input} id="can_register" type="checkbox" checked={canRegister ? canRegister : false} onChange={(e) => {
                dispatch(setCanRegister(e.target.checked));
                    changeCanRegister({
                        token: cookies.token,
                        can_register: e.target.checked,
                        season: currentSeason ? currentSeason.number : 0 
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
                        season: currentSeason ? currentSeason.number : 0 
                    });
                    props.setSeasonStarted(false);
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