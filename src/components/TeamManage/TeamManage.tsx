import React, { useEffect, useState } from 'react';
import ClanInfo from './ClanInfo/ClanInfo';
import Participate from './Participate/Participate';
import classes from './TeamManage.module.scss';
import { SeasonApi } from 'services/SeasonService';
import moment from 'moment';
import { ClanApi } from 'services/ClanService';
import { useCookies } from 'react-cookie';
import TournamentProgress from './TournamentProgress/TournamentProgress';


const TeamManage: React.FC = () => {
  const [cookies, ] = useCookies(['userId', 'token']);
  const {data: currentTournament} = SeasonApi.useFetchCurrentSeasonQuery();
  const {data: myTeam} = ClanApi.useFetchClanByManagerQuery(cookies.userId);
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [currentDateTime]);

  return (
    <div className={classes.teamManage}>
      <ClanInfo />
      {myTeam && myTeam.is_reg_to_current_season && currentTournament && moment(currentDateTime).isBefore(currentTournament.start_datetime) &&
      <Participate />
    }
      {myTeam && myTeam.is_reg_to_current_season && currentTournament && moment(currentDateTime).isAfter(currentTournament.start_datetime) &&
        <div>
          <TournamentProgress />
        </div>
      }
      </div>
  )
}

export default TeamManage