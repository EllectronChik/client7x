import moment from 'moment';
import 'moment/locale/ru';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { FormattedMessage, useIntl } from 'react-intl'
import { ClanApi } from 'services/ClanService';
import { SeasonApi } from 'services/SeasonService';


const TeamManage: React.FC = () => {
  const intl = useIntl();
  const [cookies, ] = useCookies(['token', 'userId', 'locale']);
  const [canRegister, setCanRegister] = useState<boolean | null>(null);
  const {data: currentTournament} = SeasonApi.useFetchCurrentSeasonQuery();
  const {data: myTeam} = ClanApi.useFetchClanByManagerQuery(cookies.userId);
  const [parsedDate, setParsedDate] = useState<String | null>(null);
  const [parsedTime, setParsedTime] = useState<String | null>(null);


  useEffect(() => {
    document.title = intl.formatMessage({id: 'team_manage'})
  }, [intl])

  useEffect(() => {
    if (currentTournament) {
      if (currentTournament.can_register) {
      setCanRegister(currentTournament.can_register);
    }
     if (currentTournament.start_datetime) {
      if (cookies.locale === 'ru' || cookies.locale === 'ua') {
        setParsedDate(moment(currentTournament.start_datetime).format('DD.MM.YYYY'));
        setParsedTime(moment(currentTournament.start_datetime).format('HH:mm'));
      } else {
        setParsedDate(moment(currentTournament.start_datetime).locale('en').format('LL'));
        setParsedTime(moment(currentTournament.start_datetime).locale('en').format('LT'));
      }
     }
  }
  }, [currentTournament])

  useEffect(() => {
    if (currentTournament) {
      if (cookies.locale === 'ru' || cookies.locale === 'ua') {
        setParsedDate(moment(currentTournament.start_datetime).format('DD.MM.YYYY'));
        setParsedTime(moment(currentTournament.start_datetime).format('HH:mm'));
      } else {
        setParsedDate(moment(currentTournament.start_datetime).locale('en').format('LL'));
        setParsedTime(moment(currentTournament.start_datetime).locale('en').format('LT'));
      }
    }
  }, [intl])

  useEffect(() => {
    console.log(myTeam);
  }, [myTeam])

  return (
    <div>
      {currentTournament && canRegister && 
      <div>
        <h2>
          <FormattedMessage id='tournamentStartMessage' values={{number: currentTournament.number, date: parsedDate, time: parsedTime}} />
        </h2>
      </div>}      
    </div>
  )
}

export default TeamManage