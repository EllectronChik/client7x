import React from 'react';
import Participate from './Participate/Participate';
import { ClanApi } from 'services/ClanService';
import { SeasonApi } from 'services/SeasonService';
import { useCookies } from 'react-cookie';


const TeamManage: React.FC = () => {
  const [cookies,] = useCookies(['token', 'userId', ]);
  const {data: currentTournament} = SeasonApi.useFetchCurrentSeasonQuery();
  const {data: myTeam} = ClanApi.useFetchClanByManagerQuery(cookies.userId);

  return (
    <div>
      <Participate currentTournament={currentTournament} myTeam={myTeam} />
    </div>
  )
}

export default TeamManage