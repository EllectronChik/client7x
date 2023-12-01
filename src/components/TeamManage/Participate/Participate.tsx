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
import Timer from 'components/Timer/Timer';
import { SeasonApi } from 'services/SeasonService';


const Participate: React.FC<React.HTMLProps<HTMLDivElement>> = ({...props}) => {
    const intl = useIntl();
    const [cookies, ] = useCookies(['token', 'userId', 'locale']);
    const [canRegister, setCanRegister] = useState<boolean | null>(null);
    const [parsedDate, setParsedDate] = useState<String | null>(null);
    const [parsedTime, setParsedTime] = useState<String | null>(null);
    const [participate, {}] = ClanApi.useParticipateInSeasonMutation();
    const dispatch = useAppDispatch();
    const isInitialLoad = useAppSelector(selectIsInitialLoad);
    const teamRegistred = useAppSelector(selectTeamRegistred);
    const {data: currentTournament} = SeasonApi.useFetchCurrentSeasonQuery();
    const {data: myTeam} = ClanApi.useFetchClanByManagerQuery(cookies.userId);
  
  
    const handleChangeDateFormat = () => {
      if (currentTournament) {
        if (currentTournament.start_datetime) {
          if (!cookies.locale) {
            if (navigator.language === 'ru' || navigator.language === 'uk') {
              setParsedDate(moment(currentTournament.start_datetime).format('DD.MM.YYYY'));
              setParsedTime(moment(currentTournament.start_datetime).format('HH:mm'));
            } else {
              setParsedDate(moment(currentTournament.start_datetime).locale('en').format('LL'));
              setParsedTime(moment(currentTournament.start_datetime).locale('en').format('LT'));
              
            }
          } else {
            if (cookies.locale === 'ru' || cookies.locale === 'uk') {
              setParsedDate(moment(currentTournament.start_datetime).format('DD.MM.YYYY'));
              setParsedTime(moment(currentTournament.start_datetime).format('HH:mm'));
            } else {
              setParsedDate(moment(currentTournament.start_datetime).locale('en').format('LL'));
              setParsedTime(moment(currentTournament.start_datetime).locale('en').format('LT'));
            }
          }
          }}
    }
  
  
    useEffect(() => {
      document.title = intl.formatMessage({id: 'team_manage'});
      handleChangeDateFormat();
    }, [intl])
  
    useEffect(() => {
      if (currentTournament) {        
        if (currentTournament.can_register) {
        setCanRegister(currentTournament.can_register);
      }
    }
      handleChangeDateFormat();
    }, [currentTournament])
  
  
    useEffect(() => {
      if (myTeam && isInitialLoad[1] === true) {
        if (myTeam.is_reg_to_current_season !== undefined) {
          dispatch(setTeamRegistred(myTeam.is_reg_to_current_season));
          dispatch(setIsInitialLoadSecond(false));
        }
      }
    }, [myTeam, isInitialLoad]);
    
  
    return (
      <div className={props.className}>
        {currentTournament && myTeam && canRegister && teamRegistred === false &&
        <div className={classes.team_manage}>
          <h2>
            <FormattedMessage id='tournamentStartMessage' values={{number: currentTournament.number, date: parsedDate, time: parsedTime}} />
          </h2>
          <Button7x
            className={classes.button}
            onClick={() => {
              if (currentTournament && myTeam) {
                participate({
                  token: cookies.token,
                  user: cookies.userId,
                  season: currentTournament.number,
                  team: myTeam.team_id
                })
              dispatch(setTeamRegistred(true));
              }}}
          >
            <FormattedMessage id='participate' />
          </Button7x>
        </div>}
        {currentTournament && myTeam && teamRegistred === true &&
        <div className={classes.timer}>
          <FormattedMessage id='tourStartMessage' 
          values={{
            time: <Timer datetime={currentTournament.start_datetime} />, 
            season: currentTournament.number
            }}/>
        </div>
        }
      </div>
    )
}

export default Participate