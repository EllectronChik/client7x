import Button7x from 'components/UI/Button7x/Button7x';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { FormattedMessage, useIntl } from 'react-intl';
import { ClanApi } from 'services/ClanService';
import classes from './Participate.module.scss';
import {    selectIsInitialLoad, 
            selectTeamRegistred, 
            setTeamRegistred, 
            setIsInitialLoadSecond 
} from 'store/reducers/AccountSlice';
import { useAppDispatch, useAppSelector } from 'hooks/reduxHooks';
import { ISeason } from 'models/ISeason';
import { IClanByManager } from 'models/IClanByManager';
import Timer from 'components/Timer/Timer';

interface IParticipateProps {
    currentTournament: ISeason | undefined;
    myTeam: IClanByManager | undefined;
}

const Participate: React.FC<IParticipateProps> = ({...props}) => {
    const intl = useIntl();
    const [cookies, ] = useCookies(['token', 'userId', 'locale']);
    const [canRegister, setCanRegister] = useState<boolean | null>(null);
    const [parsedDate, setParsedDate] = useState<String | null>(null);
    const [parsedTime, setParsedTime] = useState<String | null>(null);
    const [participate, {}] = ClanApi.useParticipateInSeasonMutation();
    const dispatch = useAppDispatch();
    const isInitialLoad = useAppSelector(selectIsInitialLoad);
    const teamRegistred = useAppSelector(selectTeamRegistred);
  
  
    const handleChangeDateFormat = () => {
      if (props.currentTournament) {
        if (props.currentTournament.start_datetime) {
          if (!cookies.locale) {
            if (navigator.language === 'ru' || navigator.language === 'uk') {
              setParsedDate(moment(props.currentTournament.start_datetime).format('DD.MM.YYYY'));
              setParsedTime(moment(props.currentTournament.start_datetime).format('HH:mm'));
            } else {
              setParsedDate(moment(props.currentTournament.start_datetime).locale('en').format('LL'));
              setParsedTime(moment(props.currentTournament.start_datetime).locale('en').format('LT'));
              
            }
          } else {
            if (cookies.locale === 'ru' || cookies.locale === 'uk') {
              setParsedDate(moment(props.currentTournament.start_datetime).format('DD.MM.YYYY'));
              setParsedTime(moment(props.currentTournament.start_datetime).format('HH:mm'));
            } else {
              setParsedDate(moment(props.currentTournament.start_datetime).locale('en').format('LL'));
              setParsedTime(moment(props.currentTournament.start_datetime).locale('en').format('LT'));
            }
          }
          }}
    }
  
  
    useEffect(() => {
      document.title = intl.formatMessage({id: 'team_manage'});
      handleChangeDateFormat();
    }, [intl])
  
    useEffect(() => {
      if (props.currentTournament) {        
        if (props.currentTournament.can_register) {
        setCanRegister(props.currentTournament.can_register);
      }
    }
      handleChangeDateFormat();
    }, [props.currentTournament])
  
  
    useEffect(() => {
      if (props.myTeam && isInitialLoad[1] === true) {
        if (props.myTeam.is_reg_to_current_season !== undefined) {
          dispatch(setTeamRegistred(props.myTeam.is_reg_to_current_season));
          dispatch(setIsInitialLoadSecond(false));
        }
      }
    }, [props.myTeam, isInitialLoad]);
    
  
    return (
      <div>
        {props.currentTournament && props.myTeam && canRegister && teamRegistred === false &&
        <div className={classes.team_manage}>
          <h2>
            <FormattedMessage id='tournamentStartMessage' values={{number: props.currentTournament.number, date: parsedDate, time: parsedTime}} />
          </h2>
          <Button7x
            className={classes.button}
            onClick={() => {
              if (props.currentTournament && props.myTeam) {
                participate({
                  token: cookies.token,
                  user: cookies.userId,
                  season: props.currentTournament.number,
                  team: props.myTeam.team_id
                })
              dispatch(setTeamRegistred(true));
              }}}
          >
            <FormattedMessage id='participate' />
          </Button7x>
        </div>}
        {props.currentTournament && props.myTeam && teamRegistred === true &&
        <Timer datetime={props.currentTournament.start_datetime} season={props.currentTournament.number} />}
      </div>
    )
}

export default Participate