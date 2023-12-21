import { ITournamentApiResponse } from 'models/ITournamentApiResponse';
import React, { useState } from 'react';
import classes from './TournamentCard.module.scss';
import teamDefault from '@assets/images/team/teamDefault.png';
import moment from 'moment';
import { Tooltip } from 'react-tooltip';
import Button7x from 'components/UI/Button7x/Button7x';
import { TournamentApi } from 'services/TournamentService';
import { useCookies } from 'react-cookie';

interface TournamentCardProps extends React.HTMLProps<HTMLDivElement> {
    tournament: ITournamentApiResponse
}

const TournamentCard: React.FC<TournamentCardProps> = ({...props}) => {
    const [askForChange, setAskForChange] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>(props.tournament.startTime);
    const [startTime, setStartTime] = useState<string>(props.tournament.startTime);
    const [timeSuggestion, setTimeSuggestion] = useState<string | null>(props.tournament.timeSuggested);
    const [sendChangeTimeSuggestion] = TournamentApi.useSetTimeSuggestionMutation();
    const [acceptTimeSuggestion] = TournamentApi.useAcceptTimeSuggestionMutation();
    const [cookies] = useCookies(['token']);
    let changeStartTimeTimeout: NodeJS.Timeout;

  return (
    <div className={`${props.className ? props.className : ''} ${classes.tournamentCard} ${askForChange ? classes.askForChange : ''} ${timeSuggestion ? classes.timeSuggested : ''}`}>
        <div className={classes.opponent}>
            <div>
                <h3>Opponent: </h3>
                <div className={classes.opponentLeft}>
                    <img className={classes.opponentLogo} src={teamDefault} alt="" 
                    onLoad={(e) => {
                        e.currentTarget.src = `${import.meta.env.VITE_SERVER_URL}${props.tournament.opponent.logo}`
                    }}/>
                    <div>
                        <h3>{props.tournament.opponent.name}</h3>
                        <h4>&lt;{props.tournament.opponent.tag}&gt;</h4>
                    </div>
                </div>
            </div>
            <div className={classes.opponentRight}>
                <h3>Start time:</h3>
                <h3 className={classes.opponentTime}>
                    {moment(startTime).format('DD.MM.YYYY HH:mm')}
                </h3>
                <Tooltip className={classes.tooltip} border="1px solid red" id={`changeTime_${props.tournament.id}`}>
                    <h3>You can send a request to your opponent to change the time, <br/> they will be able to accept the time change or offer an alternative </h3>
                </Tooltip>
                <div className={classes.changeTime} data-tooltip-id={`changeTime_${props.tournament.id}`} data-tooltip-place='right'>
                    <Button7x className={classes.button} onClick={() => setAskForChange(askForChange ? false : true)}>Change time</Button7x>
                </div>
            </div>
        </div>
            {askForChange && 
            <div className={classes.inputContainer}>
                <input value={moment(inputValue).format('YYYY-MM-DDTHH:mm')} onChange={(e) => {
                    setInputValue(e.target.value);
                    if (changeStartTimeTimeout) {
                        clearTimeout(changeStartTimeTimeout);
                    }
                    changeStartTimeTimeout = setTimeout(() => {
                        sendChangeTimeSuggestion({id: props.tournament.id, timeSuggestion: new Date(e.target.value).toISOString(), token: cookies.token});
                        setTimeSuggestion(null);
                    }, 1000);
                }} className={classes.input} type="datetime-local" />
            </div>}
            <div>
                {timeSuggestion && 
                <div className={classes.timeSuggestedMessage}>
                    <h3>Opponent proposes to move the time of games to {moment(timeSuggestion).format('DD.MM.YYYY HH:mm')}</h3>
                    <h3>Accept the time change or offer an alternative by clicking the button above</h3>
                    <Button7x className={classes.button} onClick={() => {
                        acceptTimeSuggestion({id: props.tournament.id, token: cookies.token});
                        setAskForChange(false);
                        setTimeSuggestion(null);
                        setStartTime(timeSuggestion);
                    }}>Accept</Button7x>
                </div>}
            </div>
    </div>
  )
}

export default TournamentCard